import { db } from './firebase.js'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js'

let domController = null
let currentCycle = { start: new Date(), end: new Date() } // Chu kỳ hiển thị hiện tại

// Biến lưu trữ dữ liệu
let allPersonnel = []
let allStores = []
let allAreas = []
let allRegions = []
let allRoles = []
let allShiftCodes = []
let dailyTemplate = null
const mockStaffAvailabilities = new Map() // Map<employeeId, Map<dateStr, {shift, priority}[]>>
// BỔ SUNG: Lưu trữ kết quả phân công để tránh tính toán lại
const mockAssignmentsCache = new Map() // Map<`${storeId}_${dateStr}`, { assignments: Map<employeeId, shiftInfo>, diff: number }>

/**
 * BỔ SUNG: Tạo dữ liệu đăng ký ca giả lập cho tất cả nhân viên trong chu kỳ.
 * QUY TẮC TẠO CHÊNH LỆCH MAN-HOUR NGẪU NHIÊN:
 * 1. Phạm vi: Mỗi ngày, chỉ có 1 đến 2 cửa hàng được chọn ngẫu nhiên để có sự chênh lệch man-hour.
 * 2. Tiêu chuẩn: Model man-hour chuẩn cho mỗi cửa hàng là 80 giờ/ngày.
 * 3. Logic chênh lệch:
 *    - THIẾU MAN-HOUR (< 80h): Xảy ra khi tổng số giờ đăng ký của nhân viên trong cửa hàng nhỏ hơn 80 giờ.
 *      Hệ thống sẽ mô phỏng bằng cách giảm bớt số lượng nhân viên đăng ký ca trong ngày đó.
 *    - THỪA MAN-HOUR (> 80h): Xảy ra khi tổng số giờ đăng ký của nhân viên lớn hơn 80 giờ.
 *      Hệ thống sẽ mô phỏng bằng cách tăng số lượng nhân viên đăng ký ca trong ngày đó.
 *    - ĐẠT CHUẨN (= 80h): Các cửa hàng không được chọn sẽ có tổng số giờ đăng ký vừa đủ 80 giờ.
 */
function generateMockAvailabilities(cycleDates, templateManHour) {
  mockStaffAvailabilities.clear()

  cycleDates.forEach(date => {
    const dateStr = formatDate(date)
    const shuffledStores = [...allStores].sort(() => 0.5 - Math.random())
    let shortageStoreIds = new Set()
    let surplusStoreIds = new Set()
    let extraVarianceStoreIds = new Set()

    // Đảm bảo luôn có 3 cửa hàng thừa và 1 cửa hàng thiếu man-hour
    while (surplusStoreIds.size < 3 && shuffledStores.length > 0) {
      surplusStoreIds.add(shuffledStores.pop().id)
    }

    if (shuffledStores.length > 0) {
      shortageStoreIds.add(shuffledStores.pop().id)
    }

    // Các cửa hàng còn lại sẽ được gán ngẫu nhiên
    while (shuffledStores.length > 0) {
      extraVarianceStoreIds.add(shuffledStores.pop().id)
    }

    allStores.forEach(store => {
      const storeStaff = allPersonnel.filter(
        p => p.storeId === store.id && p.type === 'employee'
      )
      if (storeStaff.length === 0) return

      let staffToRegister = [...storeStaff]
      const requiredStaffCount = Math.ceil(templateManHour / 8) // Giả định mỗi ca 8 giờ

      if (shortageStoreIds.has(store.id) && storeStaff.length > 2) {
        // CHẮC CHẮN THIẾU: Giảm số lượng nhân viên đăng ký
        staffToRegister = storeStaff.slice(
          0,
          Math.max(1, requiredStaffCount - 2)
        )
      } else if (surplusStoreIds.has(store.id) && storeStaff.length > 2) {
        // CHẮC CHẮN THỪA: Tăng số lượng nhân viên đăng ký
        staffToRegister = storeStaff.slice(0, requiredStaffCount + 3)
      } else if (extraVarianceStoreIds.has(store.id)) {
        // NGẪU NHIÊN THỪA/THIẾU cho các cửa hàng được chọn thêm
        if (Math.random() < 0.5 && storeStaff.length > 2) {
          // TẠO THIẾU: Giảm số lượng nhân viên đăng ký
          staffToRegister = storeStaff.slice(
            0,
            Math.max(1, requiredStaffCount - 2)
          )
        } else {
          // TẠO THỪA: Tăng số lượng nhân viên đăng ký (nếu có thể)
          staffToRegister = storeStaff.slice(0, requiredStaffCount + 3)
        }
      } else {
        // Cửa hàng còn lại: Lấy đúng số lượng nhân viên cần thiết để đủ man-hour
        staffToRegister = storeStaff.slice(0, requiredStaffCount)
      }

      // Gán nguyện vọng đăng ký cho các nhân viên đã được chọn
      staffToRegister.forEach((employee, index) => {
        if (!mockStaffAvailabilities.has(employee.id))
          mockStaffAvailabilities.set(employee.id, new Map())

        // Chia đều đăng ký giữa hai ca V812 và V829
        const shiftToRegister = index % 2 === 0 ? 'V812' : 'V829'
        const standardRegistrations = [{ shift: shiftToRegister, priority: 1 }]

        mockStaffAvailabilities
          .get(employee.id)
          .set(dateStr, standardRegistrations)
      })
    })
  })
}
/**
 * Định dạng Date thành chuỗi 'YYYY-MM-DD'.
 */
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Lấy chu kỳ lương dựa trên một ngày tham chiếu.
 * @param {Date} referenceDate - Ngày tham chiếu để xác định chu kỳ.
 * @returns {{start: Date, end: Date}} - Đối tượng chứa ngày bắt đầu và kết thúc của chu kỳ.
 */
function getPayrollCycle(referenceDate) {
  const payrollStartDay = 26
  let year = referenceDate.getFullYear()
  let month = referenceDate.getMonth()

  // Logic mới: Luôn tính chu kỳ KẾ TIẾP để điều phối.
  // Nếu ngày hiện tại (referenceDate.getDate()) nhỏ hơn ngày bắt đầu chu kỳ (payrollStartDay),
  // thì chu kỳ tiếp theo sẽ bắt đầu vào ngày payrollStartDay của tháng NÀY.
  // Ví dụ: Hôm nay là 17/11, payrollStartDay là 26. 17 < 26 -> chu kỳ tiếp theo bắt đầu ngày 26/11.
  if (referenceDate.getDate() >= payrollStartDay) {
    // Nếu ngày hiện tại lớn hơn hoặc bằng ngày bắt đầu chu kỳ,
    // thì chu kỳ tiếp theo sẽ bắt đầu vào ngày payrollStartDay của tháng SAU.
    month += 1
  }
  const start = new Date(year, month, payrollStartDay)
  const end = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    payrollStartDay - 1
  )
  return { start, end }
}

/**
 * Hiển thị spinner loading.
 */
function showLoading() {
  const body = document.getElementById('dispatch-table-body')
  if (body) {
    body.innerHTML = `<tr><td colspan="15" class="text-center p-10"><i class="fas fa-spinner fa-spin fa-2x text-gray-400"></i><p class="mt-2">Đang tải dữ liệu...</p></td></tr>`
  }
}

/**
 * Tải tất cả dữ liệu cần thiết từ Firestore.
 */
async function fetchInitialData() {
  const currentUser = window.currentUser
  if (!currentUser) {
    console.error('Không thể xác định người dùng hiện tại.')
    return
  }

  try {
    // Tải dữ liệu mã ca từ Firestore
    const shiftCodesDocRef = doc(db, 'system_configurations', 'shift_codes')

    // Tối ưu hóa: Chuẩn bị các promise để chạy song song
    const promises = [
      // Các truy vấn này sẽ chạy đồng thời
      getDoc(shiftCodesDocRef), // Tải mã ca
      getDocs(collection(db, 'stores')),
      getDocs(collection(db, 'areas')),
      getDocs(collection(db, 'regions')),
      getDocs(
        query(collection(db, 'daily_templates'), where('name', '==', 'Test'))
      ),
      getDocs(query(collection(db, 'roles'))),
    ]

    // Chuẩn bị promise để tải nhân viên dựa trên vai trò
    let employeePromise
    switch (currentUser.roleId) {
      case 'ADMIN':
      case 'HQ_STAFF': {
        // Admin và HQ Staff có quyền xem tất cả
        employeePromise = getDocs(collection(db, 'employee'))
        break
      }
      case 'REGIONAL_MANAGER':
      case 'AREA_MANAGER':
      case 'STORE_INCHARGE': {
        // Với các vai trò này, chúng ta vẫn cần tải stores/areas trước để lọc,
        // nhưng có thể tối ưu hóa bằng cách không gộp vào Promise.all ban đầu.
        // Logic hiện tại đã khá tốt cho các trường hợp này. Chúng ta giữ nguyên.
        break // Sẽ xử lý bên dưới
      }
      default: {
        // STAFF
        employeePromise = getDocs(
          query(
            collection(db, 'employee'),
            where('storeId', '==', currentUser.storeId || '')
          )
        )
        break
      }
    }

    if (employeePromise) {
      promises.push(employeePromise)
    }

    const [
      shiftCodesSnap,
      storesSnap,
      areasSnap,
      regionsSnap,
      templateSnap,
      rolesSnap,
      employeeSnap,
    ] = await Promise.all(promises)

    // Xử lý mã ca
    if (shiftCodesSnap.exists()) {
      allShiftCodes = shiftCodesSnap.data().codes || []
    }

    allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    allAreas = areasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    allRoles = rolesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Nếu employeePromise đã được thực thi, xử lý kết quả
    if (employeeSnap) {
      const employees = employeeSnap.docs.map(doc => {
        const empData = doc.data()
        const role = allRoles.find(r => r.id === empData.roleId)
        return {
          id: doc.id,
          type: 'employee',
          level: role?.level || 0,
          ...empData,
        }
      })
      employees.sort(
        (a, b) => b.level - a.level || a.name.localeCompare(b.name)
      )
      allPersonnel = employees
    } else {
      // Logic cũ cho các vai trò quản lý cấp trung
      const managedStoreIds = getManagedStoreIds(
        currentUser,
        allStores,
        allAreas
      )
      if (managedStoreIds.length > 0) {
        const CHUNK_SIZE = 30
        const storeIdChunks = Array.from(
          { length: Math.ceil(managedStoreIds.length / CHUNK_SIZE) },
          (_, i) =>
            managedStoreIds.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE)
        )

        const employeePromises = storeIdChunks.map(chunk =>
          getDocs(
            query(collection(db, 'employee'), where('storeId', 'in', chunk))
          )
        )

        const employeeSnapshots = await Promise.all(employeePromises)
        const employees = employeeSnapshots.flatMap(snap =>
          snap.docs.map(doc => {
            const empData = doc.data()
            const role = allRoles.find(r => r.id === empData.roleId)
            return {
              id: doc.id,
              type: 'employee',
              level: role?.level || 0,
              ...empData,
            }
          })
        )
        employees.sort(
          (a, b) => b.level - a.level || a.name.localeCompare(b.name)
        )
        allPersonnel = employees
      } else {
        allPersonnel = []
      }
    }

    if (!templateSnap.empty) {
      dailyTemplate = {
        id: templateSnap.docs[0].id,
        ...templateSnap.docs[0].data(),
      }
    } else {
      console.warn(
        "Không tìm thấy template 'Test'. Các tính toán man-hour sẽ không chính xác."
      )
      dailyTemplate = { totalManHour: 80 } // Fallback
    }
  } catch (error) {
    console.error('Lỗi nghiêm trọng khi tải dữ liệu ban đầu:', error)
    window.showToast('Không thể tải dữ liệu cần thiết.', 'error')
  }
}

/**
 * Lấy danh sách ID các cửa hàng mà người dùng hiện tại có quyền quản lý.
 * @param {object} user - Đối tượng người dùng hiện tại.
 * @param {Array} stores - Mảng tất cả cửa hàng.
 * @param {Array} areas - Mảng tất cả khu vực.
 * @returns {Array<string>} - Mảng các storeId.
 */
function getManagedStoreIds(user, stores, areas) {
  switch (user.roleId) {
    case 'ADMIN':
    case 'HQ_STAFF':
      return stores.map(s => s.id)
    case 'REGIONAL_MANAGER': {
      if (!user.managedRegionId) return []
      const areaIdsInRegion = areas
        .filter(a => a.regionId === user.managedRegionId)
        .map(a => a.id)
      return stores
        .filter(s => areaIdsInRegion.includes(s.areaId))
        .map(s => s.id)
    }
    case 'AREA_MANAGER': {
      if (!user.managedAreaIds || user.managedAreaIds.length === 0) return []
      return stores
        .filter(s => user.managedAreaIds.includes(s.areaId))
        .map(s => s.id)
    }
    case 'STORE_INCHARGE': {
      return user.managedStoreIds || []
    }
    default:
      return user.storeId ? [user.storeId] : []
  }
}

/**
 * BỔ SUNG: Lấy hoặc tính toán và cache lại kết quả phân công cho một cửa hàng vào một ngày cụ thể.
 * @param {string} storeId - ID của cửa hàng.
 * @param {string} dateStr - Chuỗi ngày 'YYYY-MM-DD'.
 * @returns {{assignments: Map<string, {shift: string, priority: number}>, diff: number}}
 */
function getOrCalculateStoreAssignment(storeId, dateStr, templateManHour) {
  const cacheKey = `${storeId}_${dateStr}`
  if (mockAssignmentsCache.has(cacheKey)) {
    return mockAssignmentsCache.get(cacheKey)
  }

  // 1. Lấy tất cả nguyện vọng đăng ký của nhân viên trong cửa hàng cho ngày đó
  const storeStaff = allPersonnel.filter(
    p => p.storeId === storeId && p.type === 'employee'
  )
  let allRegistrations = []
  let totalRegisteredManHour = 0
  storeStaff.forEach(employee => {
    const availability =
      mockStaffAvailabilities.get(employee.id)?.get(dateStr) || []
    availability.forEach(reg => {
      const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === reg.shift)
      if (shiftInfo) {
        totalRegisteredManHour += shiftInfo.duration || 0
      }
      allRegistrations.push({ ...reg, employeeId: employee.id })
    })
  })

  // Sắp xếp tất cả các nguyện vọng: ưu tiên nguyện vọng 1 (chắc chắn), sau đó đến nguyện vọng 2 (có thể).
  allRegistrations.sort((a, b) => a.priority - b.priority)

  const assignments = new Map() // Map<employeeId, {shift, priority}>
  let smAssignedManHour = 0 // Giờ làm việc mà SM phân công
  const assignedEmployees = new Set()

  // 2. SM thực hiện phân công dựa trên nguyện vọng, nhưng không vượt quá man-hour của template
  for (const reg of allRegistrations) {
    const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === reg.shift)
    const shiftDuration = shiftInfo?.duration || 0

    // Điều kiện phân công:
    // 1. Nhân viên này chưa được phân bất kỳ ca nào trong ngày hôm đó.
    // 2. Tổng man-hour đã phân công (smAssignedManHour) chưa vượt quá yêu cầu của template.
    if (
      !assignedEmployees.has(reg.employeeId) &&
      smAssignedManHour + shiftDuration <= templateManHour
    ) {
      // Thay đổi: assignments giờ là Map<employeeId, Array<shiftInfo>>
      if (!assignments.has(reg.employeeId)) {
        assignments.set(reg.employeeId, [])
      }
      assignments
        .get(reg.employeeId)
        .push({ shift: reg.shift, priority: reg.priority })
      assignedEmployees.add(reg.employeeId)
      smAssignedManHour += shiftDuration
    }
  }

  // 3. Tính toán chênh lệch
  // - Nếu tổng giờ đăng ký < giờ mẫu => Thiếu. Chênh lệch = Giờ phân công - Giờ mẫu (sẽ ra số âm).
  // - Nếu tổng giờ đăng ký >= giờ mẫu => Thừa. Chênh lệch = Tổng giờ đăng ký - Giờ phân công (số giờ của NV không được xếp ca).
  const diff =
    totalRegisteredManHour < templateManHour
      ? smAssignedManHour - templateManHour // THIẾU
      : totalRegisteredManHour - smAssignedManHour // THỪA

  const result = { assignments, diff }
  mockAssignmentsCache.set(cacheKey, result) // Cache kết quả

  return result
}

/**
 * Lấy chuỗi HTML cho phần thân của bảng tổng quan trạng thái các cửa hàng.
 * @param {Array<Date>} cycleDates - Mảng các ngày trong chu kỳ.
 * @returns {string} - Chuỗi HTML chứa các thẻ <tr> cho tbody.
 */
function getStoreStatusTableBody(cycleDates) {
  let bodyHTML = ''

  const managedStores = allStores.filter(s =>
    getManagedStoreIds(window.currentUser, allStores, allAreas).includes(s.id)
  )

  managedStores.forEach(store => {
    let cellsHTML = ''
    cycleDates.forEach(date => {
      const templateManHour = dailyTemplate?.totalManhour || 80
      const dateStr = formatDate(date)
      const { diff } = getOrCalculateStoreAssignment(
        store.id,
        dateStr,
        templateManHour
      )

      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const weekendCellClass = isWeekend ? 'bg-amber-50' : 'bg-white'

      // Render ô dựa trên chênh lệch, colspan="2" để khớp với bảng dưới
      if (Math.abs(diff) > 0.01) {
        const diffText = diff.toFixed(1)
        if (diff > 0) {
          cellsHTML += `<td colspan="2" class="p-2 border text-center font-bold text-sm text-green-600 ${weekendCellClass}"><i class="fas fa-arrow-up mr-1"></i> ${diffText}</td>`
        } else {
          cellsHTML += `<td colspan="2" class="p-2 border text-center font-bold text-sm text-red-600 ${weekendCellClass}"><i class="fas fa-arrow-down mr-1"></i> ${Math.abs(diff).toFixed(1)}</td>`
        }
      } else {
        cellsHTML += `<td colspan="2" class="p-2 border text-center ${weekendCellClass}"></td>`
      }
    })

    bodyHTML += `
            <tr class="bg-white store-status-row" data-store-id="${store.id}">
                <td class="p-2 border sticky left-0 bg-white z-10 cursor-pointer" title="Click để mở/đóng danh sách nhân viên của ${store.name}">
                    <div class="font-semibold text-sm">${store.name}</div>
                </td>
                ${cellsHTML}
            </tr>
        `
  })

  if (managedStores.length === 0) {
    bodyHTML = `<tr><td colspan="${cycleDates.length + 1}" class="text-center p-4 text-gray-500">Không có cửa hàng nào để hiển thị.</td></tr>`
  }

  return bodyHTML
}

/**
 * Render toàn bộ bảng điều phối.
 */
function renderDispatchTable() {
  // ... (phần đầu hàm giữ nguyên)
  const table = document.getElementById('unified-dispatch-table')
  const header = table.querySelector('thead')
  const body = table.querySelector('tbody')
  const cycleDisplay = document.getElementById('cycle-range-display')
  if (!table || !header || !body || !cycleDisplay) return

  const cycleDates = []
  for (
    let d = new Date(currentCycle.start);
    d <= currentCycle.end;
    d.setDate(d.getDate() + 1)
  ) {
    cycleDates.push(new Date(d))
  }

  // Xóa cache cũ trước khi render lại
  mockAssignmentsCache.clear()

  const templateManHour = dailyTemplate?.totalManhour || 80
  // BỔ SUNG: Tạo dữ liệu đăng ký ca giả lập cho chu kỳ này
  generateMockAvailabilities(cycleDates, templateManHour)

  cycleDisplay.textContent = `Chu kỳ từ ${currentCycle.start.toLocaleDateString('vi-VN')} đến ${currentCycle.end.toLocaleDateString('vi-VN')}`

  // --- BƯỚC 1: RENDER HEADER CHUNG VÀ COLGROUP ---
  // Sử dụng colgroup để định nghĩa chiều rộng cố định cho các cột
  let colgroupHTML = '<colgroup><col style="min-width: 300px;">'
  cycleDates.forEach(() => {
    colgroupHTML +=
      '<col style="min-width: 120px;"><col style="min-width: 120px;">' // 2 ca mỗi ngày
  })
  colgroupHTML += '</colgroup>'

  let headerRowHTML =
    '<tr><th class="p-2 border sticky left-0 bg-slate-100 z-30 text-sm font-semibold">Nhân viên</th>'
  cycleDates.forEach(date => {
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 // 0: Sunday, 6: Saturday
    const weekendClass = isWeekend ? 'bg-amber-100' : 'bg-slate-100'
    headerRowHTML += `
            <th colspan="2" class="p-1 border text-center w-[240px] ${weekendClass}">
                <div class="font-semibold text-sm">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div class="text-xs font-normal">${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
            </th>`
  })
  headerRowHTML += '</tr>'
  // Chèn colgroup và header vào thead của bảng trên
  header.innerHTML = headerRowHTML // colgroup sẽ được chèn vào table

  // --- BƯỚC 2: RENDER TOÀN BỘ BODY (TỔNG QUAN + CHI TIẾT) VÀO MỘT TBODY DUY NHẤT ---
  body.innerHTML = '' // Xóa nội dung cũ
  const bodyFragment = document.createDocumentFragment() // *** TẠO FRAGMENT ***

  // 2.1. Render các hàng tổng quan cửa hàng và thêm vào fragment
  const storeStatusRowsHTML = getStoreStatusTableBody(cycleDates)
  const tempStoreDiv = document.createElement('div')
  tempStoreDiv.innerHTML = `<table><tbody>${storeStatusRowsHTML}</tbody></table>`
  Array.from(tempStoreDiv.querySelector('tbody').children).forEach(row =>
    bodyFragment.appendChild(row)
  )

  // 2.2. Render các hàng chi tiết nhân viên và thêm vào fragment
  const currentUser = window.currentUser
  const hierarchy = buildHierarchy(currentUser)
  hierarchy.forEach(item => {
    const rowsHTML = renderRowRecursive(item, 0, cycleDates)
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = `<table><tbody>${rowsHTML}</tbody></table>`
    Array.from(tempDiv.querySelector('tbody').children).forEach(row =>
      bodyFragment.appendChild(row)
    )
  })

  // --- BƯỚC 3: CHÈN COLGROUP VÀ BODY VÀO BẢNG CHÍNH ---
  table.insertAdjacentHTML('afterbegin', colgroupHTML)
  body.appendChild(bodyFragment) // *** CHÈN VÀO DOM 1 LẦN DUY NHẤT ***

  // Gắn sự kiện sau khi render
  attachRowEvents()
}

/**
 * Xây dựng cấu trúc cây phân cấp dựa trên vai trò người dùng.
 */
function buildHierarchy(user) {
  // Logic mới cho Area Manager:
  // Vì một Area Manager không thể quản lý các khu vực (Area) thuộc các miền (Region) khác nhau,
  // việc hiển thị cấp Region trở nên không cần thiết.
  // Do đó, đối với AM, chúng ta sẽ bắt đầu cây phân cấp từ cấp Area.
  if (user?.roleId === 'AREA_MANAGER') {
    const managedAreas = allAreas.filter(a =>
      user.managedAreaIds?.includes(a.id)
    )
    return managedAreas.map(area => ({
      ...area,
      type: 'area',
      children: allStores
        .filter(store => store.areaId === area.id)
        .map(store => {
          const storePersonnel = allPersonnel.filter(
            p => p.storeId === store.id && p.type === 'employee'
          )
          if (store.name === 'AEON MaxValu Điện Biên Phủ') {
            console.log(
              `[DEBUG] Building hierarchy for store (AM View): ${store.name} (ID: ${store.id}). Found ${storePersonnel.length} employees.`,
              storePersonnel.map(p => ({
                id: p.id,
                name: p.name,
                role: p.roleId,
              }))
            )
          }
          return { ...store, type: 'store', children: storePersonnel }
        }),
    }))
  }

  // Logic cũ cho các vai trò khác
  if (!user || !user.roleId) return []

  let filteredRegions = []
  let filteredAreas = []
  let filteredStores = []

  switch (user.roleId) {
    case 'ADMIN':
    case 'HQ_STAFF':
      // Admin/HQ thấy tất cả
      filteredRegions = [...allRegions]
      filteredAreas = [...allAreas]
      filteredStores = [...allStores]
      break

    case 'REGIONAL_MANAGER': {
      if (!user.managedRegionId) return []
      filteredRegions = allRegions.filter(r => r.id === user.managedRegionId)
      filteredAreas = allAreas.filter(a => a.regionId === user.managedRegionId)
      const areaIdsForRM = filteredAreas.map(a => a.id)
      filteredStores = allStores.filter(s => areaIdsForRM.includes(s.areaId))
      break
    }

    case 'AREA_MANAGER': {
      if (!user.managedAreaIds || user.managedAreaIds.length === 0) return []
      filteredAreas = allAreas.filter(a => user.managedAreaIds.includes(a.id))
      const regionIdsForAM = [...new Set(filteredAreas.map(a => a.regionId))]
      filteredRegions = allRegions.filter(r => regionIdsForAM.includes(r.id))
      filteredStores = allStores.filter(s =>
        user.managedAreaIds.includes(s.areaId)
      )
      break
    }

    case 'STORE_INCHARGE': {
      if (!user.managedStoreIds || user.managedStoreIds.length === 0) return []
      filteredStores = allStores.filter(s =>
        user.managedStoreIds.includes(s.id)
      )
      const areaIdsForSI = [...new Set(filteredStores.map(s => s.areaId))]
      filteredAreas = allAreas.filter(a => areaIdsForSI.includes(a.id))
      const regionIdsForSI = [...new Set(filteredAreas.map(a => a.regionId))]
      filteredRegions = allRegions.filter(r => regionIdsForSI.includes(r.id))
      break
    }

    default:
      return [] // Các vai trò khác không có quyền xem trang này
  }

  // Xây dựng cây phân cấp từ dữ liệu đã lọc
  return filteredRegions.map(region => {
    const areasInRegion = filteredAreas.filter(
      area => area.regionId === region.id
    )
    return {
      ...region,
      type: 'region',
      children: areasInRegion.map(area => ({
        ...area,
        type: 'area',
        children: filteredStores
          .filter(store => store.areaId === area.id)
          .map(store => {
            const storePersonnel = allPersonnel.filter(
              p => p.storeId === store.id && p.type === 'employee'
            )
            if (store.name === 'AEON MaxValu Điện Biên Phủ') {
              console.log(
                `[DEBUG] Building hierarchy for store (General View): ${store.name} (ID: ${store.id}). Found ${storePersonnel.length} employees.`,
                storePersonnel.map(p => ({
                  id: p.id,
                  name: p.name,
                  role: p.roleId,
                }))
              )
            }
            return { ...store, type: 'store', children: storePersonnel }
          }),
      })),
    }
  })
}

/**
 * Render một hàng và các con của nó một cách đệ quy, với trạng thái thu gọn mặc định.
 * @param {object} item - Mục cần render (region, area, store, employee).
 * @param {number} level - Cấp độ của mục trong cây phân cấp.
 * @param {Array<Date>} cycleDates - Mảng các ngày trong chu kỳ.
 * @param {boolean} isParentCollapsed - Trạng thái thu gọn của mục cha.
 * @returns {string} - Chuỗi HTML của hàng và các con của nó.
 */
function renderRowRecursive(
  item,
  level,
  cycleDates,
  isParentCollapsed = false
) {
  // BỎ SUNG: Gọi renderSingleRow để render hàng hiện tại
  const isCollapsible = item.children?.length > 0
  // Mặc định, tất cả các cấp có thể thu gọn (level > -1) đều được thu gọn.
  const isCollapsed = isCollapsible && level > -1
  const isHidden = isParentCollapsed // Hàng này bị ẩn nếu cha của nó bị thu gọn.

  let rowHTML = renderSingleRow(item, level, cycleDates, isCollapsed, isHidden) // SỬA: Luôn render hàng hiện tại

  if (isCollapsible) {
    item.children.forEach(child => {
      // Luôn render các con, nhưng truyền trạng thái isHidden
      rowHTML += renderRowRecursive(
        child,
        level + 1,
        cycleDates,
        isCollapsed || isHidden
      )
    })
  }
  return rowHTML
}

/**
 * Render nội dung một ô ca làm việc cho nhân viên.
 */
function renderEmployeeShiftCell(
  shiftRegistration,
  assignedShift,
  originalStoreId,
  managedStores
) {
  // Nếu không có nguyện vọng đăng ký cho ca này, trả về ô trống.
  if (!shiftRegistration || !shiftRegistration.shift) {
    return `<td class="p-1 border text-xs"></td>` // Chỉ render 1 ô cho 1 ca
  }

  const shiftCode = shiftRegistration.shift
  const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === shiftCode)
  const timeRange = shiftInfo ? shiftInfo.timeRange : '---'

  // Tạo các tùy chọn cho dropdown cửa hàng
  const storeOptions = managedStores
    .map(
      store =>
        `<option value="${store.id}" ${store.id === originalStoreId ? 'selected' : ''}>${store.name}</option>`
    )
    .join('')

  // Nếu nhân viên được phân công, ô sẽ có màu xanh.
  // Nếu chỉ đăng ký mà chưa được phân công (chờ điều phối), ô sẽ có màu vàng nhạt.
  const cellClass = assignedShift ? 'bg-green-50' : 'bg-yellow-50'

  return `
        <td class="p-1 border text-xs ${cellClass}">
            <div class="flex flex-col gap-1 h-full justify-center" data-shift-code="${shiftCode}">
                <select class="dispatch-store-select form-select form-select-sm w-full text-xs text-center">
                    ${storeOptions}
                </select>
                <div class="text-center text-gray-500 text-[10px] h-4">${timeRange}</div>
            </div>
        </td>`
}

/**
 * Render một hàng đơn lẻ trong bảng.
 * @param {object} item - Mục cần render.
 * @param {number} level - Cấp độ của mục.
 * @param {Array<Date>} cycleDates - Mảng các ngày.
 * @param {boolean} isCollapsed - Hàng này có được thu gọn không.
 * @param {boolean} isHidden - Hàng này có bị ẩn bởi cha không.
 * @returns {string} - Chuỗi HTML của một hàng <tr>.
 */
function renderSingleRow(item, level, cycleDates, isCollapsed, isHidden) {
  const indent = level * 20
  const isCollapsible = item.children?.length > 0
  const rowId = `${item.type}-${item.id}`

  // Lấy danh sách cửa hàng được quản lý một lần để truyền xuống
  const managedStores = getManagedStoresForCurrentUser()

  let firstColHTML = `
        <div class="flex items-center" style="padding-left: ${indent}px;">
            ${isCollapsible ? `<button class="toggle-btn w-6 h-6 flex-shrink-0 text-gray-500 hover:bg-gray-200 rounded-full"><i class="fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-down'}"></i></button>` : '<div class="w-6 h-6 flex-shrink-0"></div>'}
            <!-- Hiển thị tên nhân viên và chức vụ. Dòng này được tạo cho MỌI nhân viên trong allPersonnel
                 (đã được lọc theo quyền truy cập và nhóm theo cửa hàng/khu vực/miền). -->
            <div class="ml-2">
                <span class="font-semibold text-sm">${item.name}</span>
                ${item.type === 'employee' && item.roleId ? `<div class="text-xs text-gray-500">${allRoles.find(r => r.id === item.roleId)?.name || item.roleId}</div>` : ''}
            </div>
        </div>`

  let cellsHTML = ''
  cycleDates.forEach(date => {
    const dateStr = formatDate(date)
    const availability = mockStaffAvailabilities.get(item.id)?.get(dateStr)
    const hasRegistration = availability && availability.some(reg => reg.shift)

    if (item.type === 'employee') {
      if (!hasRegistration) {
        // Nếu không có nguyện vọng, gộp 2 ô và hiển thị thông báo.
        cellsHTML += `<td colspan="2" class="p-2 border text-center text-xs text-slate-400 italic">Staff không đăng ký nguyện vọng làm việc</td>`
      } else {
        // Nếu có nguyện vọng, kiểm tra phân công
        const templateManHour = dailyTemplate?.totalManhour || 80
        const assignmentResult = item.storeId
          ? getOrCalculateStoreAssignment(
              item.storeId,
              dateStr,
              templateManHour
            )
          : null
        const registeredShifts = availability || []
        const assignedShifts = assignmentResult?.assignments.get(item.id) || []

        // Render 2 ô ca, dựa trên nguyện vọng đăng ký.
        // Ô sẽ hiển thị ngay cả khi chưa được phân công (để chờ điều phối).
        const reg1 = registeredShifts[0]
        const reg2 = registeredShifts[1]
        cellsHTML += renderEmployeeShiftCell(
          reg1,
          assignedShifts.find(s => s.shift === reg1?.shift),
          item.storeId,
          managedStores
        )
        cellsHTML += renderEmployeeShiftCell(
          reg2,
          assignedShifts.find(s => s.shift === reg2?.shift),
          item.storeId,
          managedStores
        )
      }
    } else if (['store', 'area', 'region'].includes(item.type)) {
      // LOGIC HIỂN THỊ SỐ LƯỢNG: Tính toán và hiển thị số lượng nhân viên được phân công cho các cấp tổng hợp.
      const templateManHour = dailyTemplate?.totalManhour || 80
      let assignedCount = 0
      const staffInScope = getStaffInScope(item)
      staffInScope.forEach(employee => {
        const assignmentResult = getOrCalculateStoreAssignment(
          employee.storeId,
          dateStr,
          templateManHour
        )
        if (assignmentResult?.assignments.has(employee.id)) {
          assignedCount++
        }
      })

      if (assignedCount > 0) {
        cellsHTML += `
                    <td colspan="2" class="p-2 border text-center text-xs text-slate-600">
                        <i class="fas fa-users mr-1.5"></i>
                        <span class="font-semibold">${assignedCount}</span>
                    </td>`
      } else {
        cellsHTML += `<td colspan="2" class="p-2 border"></td>`
      }
    } else {
      // Dòng region và area sẽ có ô trống
      cellsHTML += `<td colspan="2" class="p-2 border"></td>`
    }
  })

  const collapsedClass = isCollapsed ? 'collapsed' : ''
  const hiddenClass = isHidden ? 'hidden' : ''

  return `<tr data-id="${rowId}" data-level="${level}" class="bg-white ${collapsedClass} ${hiddenClass}">
                <td class="p-2 border sticky left-0 bg-white z-10">${firstColHTML}</td>
                ${cellsHTML}
            </tr>`
}

/**
 * Helper: Lấy danh sách các cửa hàng mà người dùng hiện tại có quyền quản lý.
 * @returns {Array} - Mảng các đối tượng cửa hàng.
 */
function getManagedStoresForCurrentUser() {
  const user = window.currentUser
  if (!user) return []

  switch (user.roleId) {
    case 'ADMIN':
    case 'HQ_STAFF':
      return allStores
    case 'REGIONAL_MANAGER': {
      const areasInRegion = allAreas
        .filter(a => a.regionId === user.managedRegionId)
        .map(a => a.id)
      return allStores.filter(s => areasInRegion.includes(s.areaId))
    }
    case 'AREA_MANAGER':
      return allStores.filter(s => user.managedAreaIds?.includes(s.areaId))
    default: // STORE_INCHARGE và các vai trò khác
      return allStores.filter(
        s => user.managedStoreIds?.includes(s.id) || s.id === user.storeId
      )
  }
}
/**
 * Helper: Lấy danh sách nhân viên trong phạm vi của một mục (region, area, store).
 * @param {object} item - Mục region, area, hoặc store.
 * @returns {Array} - Mảng các đối tượng nhân viên.
 */
function getStaffInScope(item) {
  if (item.type === 'store') {
    return allPersonnel.filter(
      p => p.storeId === item.id && p.type === 'employee'
    )
  }
  if (item.type === 'area') {
    const storeIds = allStores.filter(s => s.areaId === item.id).map(s => s.id)
    return allPersonnel.filter(
      p => storeIds.includes(p.storeId) && p.type === 'employee'
    )
  }
  if (item.type === 'region') {
    const areaIds = allAreas.filter(a => a.regionId === item.id).map(a => a.id)
    const storeIds = allStores
      .filter(s => areaIds.includes(s.areaId))
      .map(s => s.id)
    return allPersonnel.filter(
      p => storeIds.includes(p.storeId) && p.type === 'employee'
    )
  }
  return []
}
/**
 * Gắn sự kiện cho các hàng (thu gọn/mở rộng).
 */
function attachRowEvents() {
  const tableBody = document.getElementById('dispatch-table-body')
  if (!tableBody) return

  // Sử dụng một event listener duy nhất cho toàn bộ tbody để tối ưu hiệu suất
  tableBody.addEventListener('click', event => {
    const toggleBtn = event.target.closest('.toggle-btn')
    const storeStatusRow = event.target.closest('.store-status-row')

    // Xử lý click nút mở/đóng
    if (toggleBtn) {
      const row = toggleBtn.closest('tr')
      const level = parseInt(row.dataset.level, 10)
      const isCollapsing = !row.classList.contains('collapsed')

      toggleBtn
        .querySelector('i')
        .classList.toggle('fa-chevron-down', !isCollapsing)
      toggleBtn
        .querySelector('i')
        .classList.toggle('fa-chevron-right', isCollapsing)
      row.classList.toggle('collapsed')

      let nextRow = row.nextElementSibling
      while (nextRow && parseInt(nextRow.dataset.level, 10) > level) {
        if (isCollapsing) {
          nextRow.classList.add('hidden')
        } else {
          if (parseInt(nextRow.dataset.level, 10) === level + 1) {
            nextRow.classList.remove('hidden')
            // Nếu hàng con này cũng bị thu gọn, các cháu của nó vẫn phải bị ẩn
            if (nextRow.classList.contains('collapsed')) {
              let grandChild = nextRow.nextElementSibling
              while (
                grandChild &&
                parseInt(grandChild.dataset.level, 10) > level + 1
              ) {
                grandChild.classList.add('hidden')
                grandChild = grandChild.nextElementSibling
              }
            }
          }
        }
        nextRow = nextRow.nextElementSibling
      }
    }

    // Xử lý click vào hàng cửa hàng ở bảng trên
    if (storeStatusRow) {
      const storeId = storeStatusRow.dataset.storeId
      if (storeId) {
        const storeRow = tableBody.querySelector(
          `tr[data-id="store-${storeId}"]`
        )
        if (!storeRow) return

        // Hàm helper để mở một hàng nếu nó đang đóng
        const expandRowIfNeeded = row => {
          if (row && row.classList.contains('collapsed')) {
            row.querySelector('.toggle-btn')?.click()
          }
        }

        // Tìm các hàng cha (khu vực và miền)
        let areaRow = null
        let regionRow = null
        let currentRow = storeRow.previousElementSibling

        while (currentRow && (!areaRow || !regionRow)) {
          const level = parseInt(currentRow.dataset.level, 10)
          if (level === 1 && !areaRow) {
            areaRow = currentRow
          }
          if (level === 0 && !regionRow) {
            regionRow = currentRow
            break // Đã tìm thấy cả hai, không cần đi xa hơn
          }
          currentRow = currentRow.previousElementSibling
        }

        // Mở rộng từ trên xuống dưới: Miền -> Khu vực -> Cửa hàng
        expandRowIfNeeded(regionRow)
        expandRowIfNeeded(areaRow)
        expandRowIfNeeded(storeRow)
      }
    }
  })
}

/**
 * Xử lý sự kiện khi nhấn nút "Lưu và Gửi".
 * Mô phỏng việc gửi dữ liệu và hiển thị thông báo toast.
 */
async function handleSaveAndSend() {
  const button = document.getElementById('save-and-send-dispatch-btn')
  if (!button) return

  button.disabled = true
  button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Đang gửi...'

  // Mô phỏng cuộc gọi API hoặc quá trình xử lý
  await new Promise(resolve => setTimeout(resolve, 1500)) // Giả lập độ trễ 1.5 giây

  // Hiển thị thông báo thành công
  window.showToast('Đã lưu và gửi điều phối thành công!', 'success')

  // Khôi phục trạng thái nút
  button.disabled = false
  button.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Lưu và Gửi'
}

/**
 * Chuyển chu kỳ và tải lại dữ liệu.
 */
async function changeCycle(direction) {
  const newRefDate = new Date(currentCycle.start)
  // direction = 1 (tới), -1 (lùi)
  newRefDate.setMonth(newRefDate.getMonth() + direction)
  currentCycle = getPayrollCycle(newRefDate)

  showLoading()
  renderDispatchTable()
}

/**
 * Hàm dọn dẹp khi rời khỏi trang.
 */
export function cleanup() {
  if (domController) {
    domController.abort()
    domController = null
  }
}

/**
 * Hàm khởi tạo chính.
 */
export async function init() {
  domController = new AbortController()
  const { signal } = domController

  currentCycle = getPayrollCycle(new Date()) // Lấy chu kỳ hiện tại
  showLoading()

  // Tải dữ liệu song song
  await fetchInitialData()

  renderDispatchTable()

  document
    .getElementById('prev-cycle-btn')
    ?.addEventListener('click', () => changeCycle(-1), { signal })
  document
    .getElementById('next-cycle-btn')
    ?.addEventListener('click', () => changeCycle(1), { signal })

  // Thêm nút "Lưu và Gửi"
  let dispatchSaveActionsContainer = document.getElementById(
    'dispatch-save-actions'
  )
  if (!dispatchSaveActionsContainer) {
    // Fallback: Nếu không tìm thấy container, tạo một cái và thêm vào main content area
    console.warn(
      'Container #dispatch-save-actions not found. Creating one and appending to main.'
    )
    dispatchSaveActionsContainer = document.createElement('div')
    dispatchSaveActionsContainer.id = 'dispatch-save-actions'
    dispatchSaveActionsContainer.className = 'mt-6 flex justify-end p-4' // Basic styling
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.appendChild(dispatchSaveActionsContainer)
    } else {
      document.body.appendChild(dispatchSaveActionsContainer) // Ultimate fallback
    }
  }
  const saveAndSendBtn = document.createElement('button')
  saveAndSendBtn.id = 'save-and-send-dispatch-btn'
  saveAndSendBtn.className = 'btn btn-indigo' // Sử dụng màu indigo cho nút chính
  saveAndSendBtn.innerHTML =
    '<i class="fas fa-paper-plane mr-2"></i> Lưu và Gửi'
  dispatchSaveActionsContainer.appendChild(saveAndSendBtn)

  saveAndSendBtn.addEventListener('click', handleSaveAndSend, { signal })
}
