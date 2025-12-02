import { db } from './firebase.js'
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js'

let activeListeners = []

// Bảng màu để người dùng có thể chọn cho mỗi nhóm.
// Lưu trữ giá trị màu HEX thực tế thay vì class Tailwind.
const colorPalette = {
  slate: {
    name: 'slate',
    bg: '#e2e8f0',
    text: '#1e293b',
    border: '#94a3b8',
    hover: '#cbd5e1',
    tailwind_bg: 'bg-slate-200',
    tailwind_text: 'text-slate-800',
    tailwind_border: 'border-slate-500',
  },
  green: {
    name: 'green',
    bg: '#bbf7d0',
    text: '#166534',
    border: '#4ade80',
    hover: '#86efac',
    tailwind_bg: 'bg-green-200',
    tailwind_text: 'text-green-800',
    tailwind_border: 'border-green-500',
  },
  blue: {
    name: 'blue',
    bg: '#bfdbfe',
    text: '#1e40af',
    border: '#60a5fa',
    hover: '#93c5fd',
    tailwind_bg: 'bg-blue-200',
    tailwind_text: 'text-blue-800',
    tailwind_border: 'border-blue-500',
  },
  amber: {
    name: 'amber',
    bg: '#fde68a',
    text: '#92400e',
    border: '#facc15',
    hover: '#fcd34d',
    tailwind_bg: 'bg-amber-200',
    tailwind_text: 'text-amber-800',
    tailwind_border: 'border-amber-500',
  },
  teal: {
    name: 'teal',
    bg: '#99f6e4',
    text: '#134e4a',
    border: '#2dd4bf',
    hover: '#5eead4',
    tailwind_bg: 'bg-teal-200',
    tailwind_text: 'text-teal-800',
    tailwind_border: 'border-teal-500',
  },
  purple: {
    name: 'purple',
    bg: '#e9d5ff',
    text: '#6b21a8',
    border: '#c084fc',
    hover: '#d8b4fe',
    tailwind_bg: 'bg-purple-200',
    tailwind_text: 'text-purple-800',
    tailwind_border: 'border-purple-500',
  },
  indigo: {
    name: 'indigo',
    bg: '#c7d2fe',
    text: '#3730a3',
    border: '#818cf8',
    hover: '#a5b4fc',
    tailwind_bg: 'bg-indigo-200',
    tailwind_text: 'text-indigo-800',
    tailwind_border: 'border-indigo-500',
  },
  red: {
    name: 'red',
    bg: '#fecaca',
    text: '#991b1b',
    border: '#f87171',
    hover: '#fca5a5',
    tailwind_bg: 'bg-red-200',
    tailwind_text: 'text-red-800',
    tailwind_border: 'border-red-500',
  },
  pink: {
    name: 'pink',
    bg: '#fbcfe8',
    text: '#9d174d',
    border: '#f472b6',
    hover: '#f9a8d4',
    tailwind_bg: 'bg-pink-200',
    tailwind_text: 'text-pink-800',
    tailwind_border: 'border-pink-500',
  },
}

/**
 * Safelist cho Tailwind CSS JIT Compiler. Các class này vẫn cần thiết cho các
 * task item được tạo động trong daily-templates.js.
 * tailwind.config.js cần được cấu hình để quét các class này.
 * bg-slate-200 text-slate-800 border-slate-500
 * bg-green-200 text-green-800 border-green-500
 * bg-blue-200 text-blue-800 border-blue-500
 * bg-amber-200 text-amber-800 border-amber-500
 * bg-teal-200 text-teal-800 border-teal-500
 * bg-purple-200 text-purple-800 border-purple-500
 * bg-indigo-200 text-indigo-800 border-indigo-500
 * bg-red-200 text-red-800 border-red-500
 * bg-pink-200 text-pink-800 border-pink-500
 */

/**
 * Render toàn bộ nội dung trang, bao gồm thống kê và các thẻ nhóm công việc.
 */
async function renderPage() {
  try {
    // Sử dụng getDocs thay vì onSnapshot vì trang này chủ yếu để hiển thị, không cần real-time phức tạp
    const q = query(collection(db, 'task_groups'), orderBy('order'))
    const querySnapshot = await getDocs(q)
    const taskGroups = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    renderStatistics(taskGroups)
    renderGroupCards(taskGroups)
    initializePageListeners() // Đổi tên để bao gồm cả listener highlight mới
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu nhóm công việc:', error)
    window.showToast('Không thể tải dữ liệu. Vui lòng thử lại.', 'error')
    document.getElementById('task-groups-container').innerHTML =
      `<p class="text-red-500">Lỗi tải dữ liệu.</p>`
  }
}

/**
 * Render khu vực thống kê.
 * @param {Array} taskGroups - Mảng các nhóm công việc.
 */
function renderStatistics(taskGroups) {
  const statsContainer = document.getElementById('stats-container')
  if (!statsContainer) return

  let totalTasks = 0
  let dailyTasks = 0
  let weeklyTasks = 0
  let monthlyTasks = 0
  let yearlyTasks = 0
  let otherTasks = 0

  taskGroups.forEach(group => {
    if (group.tasks && Array.isArray(group.tasks)) {
      totalTasks += group.tasks.length
      group.tasks.forEach(task => {
        switch (task.frequency) {
          case 'Daily':
            dailyTasks++
            break
          case 'Weekly':
            weeklyTasks++
            break
          case 'Monthly':
            monthlyTasks++
            break
          case 'Yearly':
            yearlyTasks++
            break
          default:
            otherTasks++
            break
        }
      })
    }
  })

  const stats = [
    { title: 'Tổng số Task', value: totalTasks, icon: 'fa-tasks', type: 'All' },
    { title: 'Daily Task', value: dailyTasks, icon: 'fa-sun', type: 'Daily' },
    {
      title: 'Weekly',
      value: weeklyTasks,
      icon: 'fa-calendar-week',
      type: 'Weekly',
    },
    {
      title: 'Monthly',
      value: monthlyTasks,
      icon: 'fa-calendar-alt',
      type: 'Monthly',
    },
    {
      title: 'Yearly',
      value: yearlyTasks,
      icon: 'fa-calendar-check',
      type: 'Yearly',
    },
    { title: 'Khác', value: otherTasks, icon: 'fa-asterisk', type: 'Other' },
  ]

  statsContainer.innerHTML = stats
    .map(
      stat => `
        <div class="stat-card flex items-baseline gap-3 border border-gray-200 p-4 bg-white rounded-lg transition-all duration-200 hover:shadow-md hover:border-green-300 hover:-translate-y-1 cursor-pointer" data-stat-type="${stat.type}">
            <div class="stat-icon text-gray-500"><i class="fas ${stat.icon}"></i></div>
            <p class="text-xs font-medium text-gray-600 whitespace-nowrap">${stat.title}:</p>
            <p class="text-lg font-bold text-gray-900">${stat.value}</p>
        </div>
    `
    )
    .join('')
}

/**
 * Render các thẻ nhóm công việc.
 * @param {Array} taskGroups - Mảng các nhóm công việc.
 */
function renderGroupCards(taskGroups) {
  const groupsContainer = document.getElementById('task-groups-container')
  if (!groupsContainer) return

  const defaultTaskColor = colorPalette['slate']

  groupsContainer.innerHTML = taskGroups
    .map(group => {
      const color =
        group.color && group.color.tailwind_bg
          ? group.color
          : colorPalette['slate']

      const headerCell = `
            <div class="group-code-card ${color.tailwind_bg} text-slate-800 rounded ${color.tailwind_border} flex flex-col items-center justify-between text-center w-28 h-[146px] flex-shrink-0 cursor-pointer transition-colors hover:bg-slate-300" data-group-id="${group.id}">
                <div class="w-full text-xs font-semibold py-0.5 bg-black/10 rounded-t">
                    Group Task ${group.order}
                </div>
                <h3 class="font-bold text-2xl">${group.code}</h3>
                <div class="w-full text-xs font-semibold py-0.5 bg-black/10 rounded-b">
                    Total Tasks: ${group.tasks?.length || 0}
                </div>
            </div>
        `

      const sortedTasks = (group.tasks || []).sort((a, b) => a.order - b.order)
      let taskCells = ''
      for (let i = 0; i < sortedTasks.length; i += 4) {
        const chunk = sortedTasks.slice(i, i + 4)

        const orderRow = chunk
          .map(
            task => `
                <div class="w-[70px] text-center text-sm font-semibold text-green-800">${task.order}</div>
            `
          )
          .join('<div class="w-3"></div>') // Spacer

        const taskRow = chunk
          .map(task => {
            const generatedCode = `1${group.order}${String(task.order).padStart(2, '0')}`
            const frequency = task.frequency || 'Other' // Mặc định là 'Other' nếu không có
            return `
                    <div class="task-card relative group ${defaultTaskColor.tailwind_bg} rounded ${defaultTaskColor.tailwind_border} flex flex-col items-center justify-between text-center w-[70px] h-[100px] flex-shrink-0 transition-all hover:bg-slate-300 hover:shadow-md cursor-pointer" 
                         data-task-order="${task.order}" data-task-frequency="${frequency}">
                        <button class="delete-task-btn absolute top-0 right-0 p-1 leading-none text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Xóa task này">
                            <i class="fas fa-times-circle"></i>
                        </button>
                        <div class="flex-1 flex flex-col justify-center items-center px-1 pt-2 pb-1">
                            <p class="text-sm font-medium text-slate-800 leading-tight">${task.name}</p>
                        </div>
                        <p class="text-xs font-semibold text-slate-500 pb-1.5">${generatedCode}</p>
                    </div>
                `
          })
          .join('')

        const borderClass = i === 0 ? 'border-l' : '' // Thêm border trái cho cụm đầu tiên

        taskCells += `
                <div class="task-chunk flex flex-col flex-shrink-0 border-y border-r border-gray-200 bg-white ${borderClass}">
                    <div class="flex flex-nowrap bg-green-200 py-1">
                        ${orderRow}
                    </div>
                    <div class="task-row-container flex flex-nowrap gap-3 p-2" data-group-code="${group.code}">
                    ${taskRow}
                    </div>
                </div>
            `
      }

      const actionCell = `
            <div class="action-card flex flex-col items-center justify-center gap-4 text-center w-28 h-[146px] flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg">
                <button class="add-task-to-group-btn text-slate-500 hover:text-blue-600 transition-colors" data-group-id="${group.id}" title="Thêm Task vào nhóm ${group.code}">
                    <i class="fas fa-plus fa-2x"></i>
                </button>
                <button class="edit-group-btn text-slate-500 hover:text-indigo-600 transition-colors" data-group-id="${group.id}" title="Sửa thông tin nhóm ${group.code}">
                    <i class="fas fa-pencil-alt fa-2x"></i>
                </button>
            </div>
        `

      return `
            <div class="group-row flex items-start gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-group-id="${group.id}">
                ${headerCell}
                <div class="tasks-scroll-container flex-1 overflow-x-auto"><div class="tasks-list-inner flex flex-nowrap" data-group-code="${group.code}">${taskCells}</div></div>
                ${actionCell}
            </div>
        `
    })
    .join('')
}

/**
 * Thêm các event listener cho các thẻ code của nhóm để đổi màu và các tương tác khác.
 * Đồng thời khởi tạo chức năng kéo-thả.
 */
function initializePageListeners() {
  // Sử dụng event delegation trên container để xử lý click
  const container = document.getElementById('task-groups-container')
  if (!container) return // Thoát nếu container chưa sẵn sàng

  container.addEventListener('click', e => {
    const groupCodeCard = e.target.closest('.group-code-card')
    const taskCard = e.target.closest('.task-card')
    const addTaskBtn = e.target.closest('.add-task-to-group-btn')
    const editGroupBtn = e.target.closest('.edit-group-btn')
    const deleteTaskBtn = e.target.closest('.delete-task-btn')

    if (deleteTaskBtn) {
      e.stopPropagation() // Ngăn không cho modal sửa task hiện ra
      const taskToDelete = deleteTaskBtn.closest('.task-card')
      const groupRow = taskToDelete.closest('.group-row[data-group-id]') // Tìm group-row gần nhất
      const groupId = groupRow.dataset.groupId // Lấy groupId từ group-row
      const taskOrder = parseInt(taskToDelete.dataset.taskOrder, 10)
      handleDeleteTask(groupId, taskOrder)
      return // Dừng xử lý để tránh các sự kiện khác
    }

    if (groupCodeCard) {
      // Click vào thẻ group
      const groupId = groupCodeCard.dataset.groupId
      showColorPalette(groupCodeCard, groupId)
    }

    if (taskCard) {
      const groupRow = taskCard.closest('.group-row[data-group-id]')
      const groupId = groupRow.dataset.groupId
      const taskOrder = taskCard.dataset.taskOrder
      showEditTaskModal(groupId, parseInt(taskOrder, 10))
    }

    if (addTaskBtn) {
      const groupId = addTaskBtn.dataset.groupId
      showAddTaskModal(groupId)
    }

    if (editGroupBtn) {
      const groupId = editGroupBtn.dataset.groupId
      showEditGroupModal(groupId)
    }
  })

  // Khởi tạo SortableJS cho mỗi nhóm
  document.querySelectorAll('.tasks-list-inner').forEach(groupContainer => {
    const groupCode = groupContainer.dataset.groupCode
    const taskRows = groupContainer.querySelectorAll('.task-row-container')

    taskRows.forEach(row => {
      Sortable.create(row, {
        group: `tasks-${groupCode}`, // Các hàng trong cùng một nhóm có thể kéo-thả cho nhau
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onEnd: handleTaskDrop,
      })
    })
  })

  // Thêm listener cho việc highlight task từ thẻ thống kê
  initializeHighlightListeners()
}

/**
 * Khởi tạo listener cho việc highlight các task khi hover vào thẻ thống kê.
 */
function initializeHighlightListeners() {
  const statsContainer = document.getElementById('stats-container')
  if (!statsContainer) return
  const mainContent = document.querySelector(
    '.flex-1.flex.flex-col.overflow-hidden'
  )

  const clearAllHighlights = () => {
    document
      .querySelectorAll('.stat-card.stat-active')
      .forEach(card => card.classList.remove('stat-active'))
    document
      .querySelectorAll('.task-card.highlight-task')
      .forEach(task => task.classList.remove('highlight-task'))
  }

  statsContainer.addEventListener('click', e => {
    const statCard = e.target.closest('.stat-card')
    if (!statCard) return

    e.stopPropagation() // Ngăn sự kiện click lan ra ngoài

    const statType = statCard.dataset.statType
    const isAlreadyActive = statCard.classList.contains('stat-active')

    // Xóa tất cả highlight cũ trước
    clearAllHighlights()

    // Nếu thẻ chưa active, thì bật highlight lên
    if (!isAlreadyActive) {
      statCard.classList.add('stat-active')
      const allTasks = document.querySelectorAll('.task-card')
      allTasks.forEach(task => {
        const taskFrequency = task.dataset.taskFrequency
        if (statType === 'All' || statType === taskFrequency) {
          task.classList.add('highlight-task')
        }
      })
    }
  })

  // Nếu click ra ngoài vùng thống kê, xóa highlight
  if (mainContent) mainContent.addEventListener('click', clearAllHighlights)
}

/**
 * Xử lý sau khi một task được kéo-thả xong.
 * @param {Event} evt - Sự kiện từ SortableJS.
 */
async function handleTaskDrop(evt) {
  const taskCard = evt.item
  const groupContainer = taskCard.closest('.tasks-list-inner')
  const groupCode = groupContainer.dataset.groupCode

  if (!groupCode) {
    console.error(
      'Lỗi: Không thể xác định mã nhóm (groupCode) từ DOM sau khi kéo-thả.'
    )
    return
  }

  // 1. Đọc lại toàn bộ các task card trong nhóm theo thứ tự DOM mới
  const allTaskCardsInGroup = Array.from(
    groupContainer.querySelectorAll('.task-card')
  )

  // 2. Lấy dữ liệu task hiện tại từ Firestore để giữ lại các thông tin khác
  const groupDocRef = doc(db, 'task_groups', groupCode)
  const docSnap = await getDoc(groupDocRef)
  if (!docSnap.exists()) {
    window.showToast('Lỗi: Không tìm thấy nhóm để cập nhật.', 'error')
    return
  }
  const existingTasks = docSnap.data().tasks || []

  // 3. Tạo mảng task mới với thứ tự đã được cập nhật
  const newTasksArray = allTaskCardsInGroup
    .map((card, index) => {
      const originalOrder = parseInt(card.dataset.taskOrder, 10)
      const originalTaskData = existingTasks.find(t => t.order == originalOrder) // Dùng == để linh hoạt hơn

      if (!originalTaskData) {
        console.warn(
          `Không tìm thấy dữ liệu gốc cho task với order: ${originalOrder}. Task này sẽ bị bỏ qua.`
        )
        return null // Sẽ được lọc ra ở bước tiếp theo
      }

      return { ...originalTaskData, order: index + 1 } // Gán lại order mới và trả về
    })
    .filter(Boolean) // Lọc ra các giá trị null (những task không tìm thấy)

  // 4. Cập nhật lên Firestore
  try {
    await updateDoc(groupDocRef, { tasks: newTasksArray })
    window.showToast(
      `Đã cập nhật thứ tự task trong nhóm ${groupCode}.`,
      'success',
      2000
    )
    renderPage() // Render lại để đồng bộ hoàn toàn
  } catch (error) {
    console.error('Lỗi khi cập nhật thứ tự task:', error)
    window.showToast('Lỗi khi lưu thứ tự mới. Vui lòng thử lại.', 'error')
  }
}

/**
 * Hiển thị một popup bảng màu bên cạnh thẻ được nhấp.
 * @param {HTMLElement} targetCard - Thẻ code của nhóm được nhấp vào.
 */
function showColorPalette(targetCard, groupId) {
  // Xóa bất kỳ bảng màu nào đang tồn tại
  const existingPalette = document.getElementById('color-palette-popup')
  if (existingPalette) {
    existingPalette.remove()
  }

  if (!groupId) return

  // Tạo container cho bảng màu
  const palettePopup = document.createElement('div')
  palettePopup.id = 'color-palette-popup'
  palettePopup.className =
    'absolute z-20 bg-white border border-gray-300 rounded-lg shadow-xl p-2 grid grid-cols-5 gap-2'

  // Điền các ô màu vào bảng màu
  palettePopup.innerHTML = Object.values(colorPalette)
    .map(
      color => `
        <div class="w-6 h-6 rounded-full cursor-pointer border-2 hover:scale-110 transition-transform" style="background-color: ${color.bg}; border-color: ${color.border};"
             data-color-name="${color.name}" 
             title="${color.name}">
        </div>
    `
    )
    .join('')

  document.body.appendChild(palettePopup)

  // Định vị bảng màu
  const cardRect = targetCard.getBoundingClientRect()
  palettePopup.style.left = `${cardRect.right + 10}px`
  palettePopup.style.top = `${cardRect.top}px`

  // Thêm listener cho các ô màu
  palettePopup.addEventListener('click', e => {
    const colorSwatch = e.target.closest('[data-color-name]')
    if (colorSwatch) {
      const newColorName = colorSwatch.dataset.colorName
      updateGroupColor(groupId, newColorName)
      palettePopup.remove() // Đóng popup sau khi chọn
    }
  })

  // Thêm listener để đóng popup khi click ra ngoài
  setTimeout(() => {
    document.addEventListener(
      'click',
      e => {
        if (
          !palettePopup.contains(e.target) &&
          e.target !== targetCard &&
          !targetCard.contains(e.target)
        ) {
          palettePopup.remove()
        }
      },
      { once: true }
    )
  }, 0)
}

/**
 * Cập nhật màu cho một nhóm công việc cụ thể.
 * @param {string} groupId - ID của nhóm.
 * @param {string} newColorName - Tên màu mới từ bảng màu.
 */
async function updateGroupColor(groupId, newColorName) {
  const groupCodeCard = document.querySelector(
    `.group-code-card[data-group-id="${groupId}"]`
  )
  if (!groupCodeCard) return

  const newColorObject = colorPalette[newColorName] || colorPalette['slate']

  try {
    // Cập nhật trực tiếp vào Firestore
    const groupDocRef = doc(db, 'task_groups', groupId)
    await updateDoc(groupDocRef, {
      color: newColorObject, // Lưu toàn bộ object màu
    })

    // Cập nhật màu cho ô code trong DOM để phản hồi ngay lập tức
    Object.values(colorPalette).forEach(color => {
      groupCodeCard.classList.remove(color.tailwind_bg, color.tailwind_border)
    })
    groupCodeCard.classList.add(
      newColorObject.tailwind_bg,
      newColorObject.tailwind_border
    )

    window.showToast(
      `Đã đổi màu nhóm sang '${newColorObject.name}'`,
      'success',
      2000
    )
  } catch (error) {
    console.error('Lỗi khi cập nhật màu nhóm:', error)
    window.showToast('Không thể lưu thay đổi màu. Vui lòng thử lại.', 'error')
  }
}

/**
 * Xử lý việc xóa một task khỏi nhóm.
 * @param {string} groupCode Mã nhóm chứa task.
 * @param {number} taskOrder Thứ tự của task cần xóa.
 */
async function handleDeleteTask(groupCode, taskOrder) {
  try {
    // Bước 1: Lấy dữ liệu nhóm và tên task trước khi hỏi xác nhận
    const groupDocRef = doc(db, 'task_groups', groupCode)
    const docSnap = await getDoc(groupDocRef)

    if (!docSnap.exists()) {
      throw new Error(`Không tìm thấy nhóm với mã: ${groupCode}`)
    }

    let tasks = docSnap.data().tasks || []
    const taskToDelete = tasks.find(t => t.order === taskOrder)

    if (!taskToDelete) {
      throw new Error(
        `Không tìm thấy task với order ${taskOrder} trong nhóm ${groupCode}.`
      )
    }
    const taskName = taskToDelete.name

    // Bước 2: Hiển thị hộp thoại xác nhận với tên task
    const confirmed = await window.showConfirmation(
      `Bạn có chắc chắn muốn xóa task <strong>${taskName}</strong> khỏi nhóm <strong>${groupCode}</strong> không?`,
      'Xác nhận xóa Task',
      'Xóa',
      'Hủy'
    )

    if (!confirmed) return

    // Bước 3: Nếu xác nhận, tiến hành xóa và cập nhật
    const updatedTasks = tasks
      .filter(task => task.order !== taskOrder)
      .sort((a, b) => a.order - b.order) // Sắp xếp lại để đảm bảo thứ tự đúng
      .map((task, index) => ({ ...task, order: index + 1 })) // Gán lại order mới

    await updateDoc(groupDocRef, { tasks: updatedTasks })

    window.showToast(
      `Đã xóa task "${taskName}" khỏi nhóm ${groupCode}.`,
      'success'
    )
    renderPage() // Render lại toàn bộ trang để cập nhật giao diện
  } catch (error) {
    console.error('Lỗi khi xóa task:', error)
    window.showToast('Đã xảy ra lỗi khi xóa task. Vui lòng thử lại.', 'error')
  }
}

/**
 * Ẩn modal được chỉ định.
 * @param {string} modalId ID của modal cần ẩn.
 */
function hideModal(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) return

  modal.classList.remove('show')
  const onTransitionEnd = () => {
    modal.classList.add('hidden')
    modal.classList.remove('flex')
    const form = modal.querySelector('form')
    if (form) form.reset()
    modal.removeEventListener('transitionend', onTransitionEnd)
  }
  modal.addEventListener('transitionend', onTransitionEnd)
}

//#region ADD TASK MODAL
/**
 * Tạo và chèn modal thêm task vào DOM nếu chưa tồn tại.
 */
function injectAddTaskModal() {
  if (document.getElementById('add-task-to-group-modal')) return

  const modalHTML = `
        <div id="add-task-to-group-modal" class="modal-overlay hidden">
            <div class="modal-content max-w-md w-full">
                <form id="add-task-to-group-form">
                    <div class="modal-header">
                        <h3 class="modal-title">Thêm Task Mới vào Nhóm</h3>
                        <button type="button" class="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="add-task-group-code">Nhóm</label>
                            <input type="text" id="add-task-group-code" name="groupCode" readonly class="form-input bg-gray-100 cursor-not-allowed">
                        </div>
                        <div class="form-group">
                            <label for="add-task-name">Tên Task <span class="text-red-500">*</span></label>
                            <input type="text" id="add-task-name" name="name" required class="form-input" placeholder="Ví dụ: Lau sàn khu vực A">
                        </div>
                        <div class="form-group">
                            <label for="add-task-type">Loại Task <span class="text-red-500">*</span></label>
                            <select id="add-task-type" name="typeTask" required class="form-input">
                                <option value="Product">Product (P)</option>
                                <option value="Fixed">Fixed (F)</option>
                                <option value="CTM">CTM</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="add-task-order">Thứ tự (Order) <span class="text-red-500">*</span></label>
                            <input type="number" id="add-task-order" name="order" required class="form-input" min="1" placeholder="Ví dụ: 1, 2, 3...">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="add-task-frequency">Tần suất</label>
                                <select id="add-task-frequency" name="frequency" class="form-input">
                                    <option value="Daily" selected>Hàng ngày (Daily)</option>
                                    <option value="Weekly">Hàng tuần (Weekly)</option>
                                    <option value="Monthly">Hàng tháng (Monthly)</option>
                                    <option value="Yearly">Hàng năm (Yearly)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="add-task-manual-number">Số Manual</label>
                                <input type="text" id="add-task-manual-number" name="manual_number" class="form-input" placeholder="Ví dụ: 12345">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="add-task-manual-link">Link Manual</label>
                            <input type="text" id="add-task-manual-link" name="manual_link" class="form-input" placeholder="Dán link tài liệu hướng dẫn...">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close-btn">Hủy</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save mr-1"></i> Lưu Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `
  document.body.insertAdjacentHTML('beforeend', modalHTML)

  // Gắn listener cho modal vừa tạo
  const modal = document.getElementById('add-task-to-group-modal')
  modal.addEventListener('click', e => {
    if (
      e.target.classList.contains('modal-overlay') ||
      e.target.closest('.modal-close-btn')
    ) {
      hideModal('add-task-to-group-modal')
    }
  })

  document
    .getElementById('add-task-to-group-form')
    .addEventListener('submit', handleAddTaskSubmit)
}

/**
 * Hiển thị modal thêm task.
 * @param {string} groupCode Mã nhóm để thêm task vào.
 */
function showAddTaskModal(groupCode) {
  document.getElementById('add-task-group-code').value = groupCode

  const modal = document.getElementById('add-task-to-group-modal')
  modal.classList.remove('hidden')
  modal.classList.add('flex')
  setTimeout(() => modal.classList.add('show'), 10)
}

/**
 * Xử lý việc submit form thêm task mới.
 * @param {Event} e
 */
async function handleAddTaskSubmit(e) {
  e.preventDefault()
  const form = e.target
  const groupCode = form.elements.groupCode.value
  const taskName = form.elements.name.value.trim()
  const taskOrder = parseInt(form.elements.order.value, 10)
  const typeTask = form.elements.typeTask.value
  const frequency = form.elements.frequency.value
  const manualNumber = form.elements.manual_number.value.trim()
  const manualLink = form.elements.manual_link.value.trim()
  const submitButton = form.querySelector('button[type="submit"]')

  if (!groupCode || !taskName || isNaN(taskOrder)) {
    window.showToast('Vui lòng điền đầy đủ thông tin hợp lệ.', 'warning')
    return
  }

  const newTask = {
    name: taskName,
    order: taskOrder,
    typeTask: typeTask,
    frequency: frequency,
    manual_number: manualNumber || null,
    manual_link: manualLink || '',
  }

  submitButton.disabled = true
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin mr-1"></i> Đang lưu...'

  try {
    // Để xử lý việc chèn và cập nhật order, chúng ta cần đọc, sửa, rồi ghi lại.
    const groupDocRef = doc(db, 'task_groups', groupCode)
    const docSnap = await getDoc(groupDocRef)

    if (!docSnap.exists()) {
      throw new Error(`Không tìm thấy nhóm với mã: ${groupCode}`)
    }

    let tasks = docSnap.data().tasks || []

    // Kiểm tra xem order đã tồn tại chưa và cập nhật các order khác nếu cần
    const orderExists = tasks.some(task => task.order === taskOrder)
    if (orderExists) {
      tasks = tasks.map(task => {
        if (task.order >= taskOrder) {
          return { ...task, order: task.order + 1 }
        }
        return task
      })
    }

    tasks.push(newTask)

    await updateDoc(groupDocRef, {
      tasks: tasks,
    })
    window.showToast(
      `Đã thêm task "${taskName}" vào nhóm ${groupCode}.`,
      'success'
    )
    hideModal('add-task-to-group-modal')
    renderPage() // Render lại trang để cập nhật
  } catch (error) {
    console.error('Lỗi khi thêm task vào nhóm:', error)
    window.showToast('Đã xảy ra lỗi. Vui lòng thử lại.', 'error')
  } finally {
    submitButton.disabled = false
    submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu Task'
  }
}
//#endregion

//#region EDIT GROUP MODAL
/**
 * Tạo và chèn modal chỉnh sửa nhóm vào DOM nếu chưa tồn tại.
 */
function injectEditGroupModal() {
  if (document.getElementById('edit-group-modal')) return

  const modalHTML = `
        <div id="edit-group-modal" class="modal-overlay hidden">
            <div class="modal-content max-w-md w-full">
                <form id="edit-group-form">
                    <div class="modal-header">
                        <h3 class="modal-title">Chỉnh Sửa Nhóm Công Việc</h3>
                        <button type="button" class="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="edit-group-code">Mã Nhóm</label>
                            <input type="text" id="edit-group-code" name="groupCode" readonly class="form-input bg-gray-100 cursor-not-allowed">
                        </div>
                        <div class="form-group">
                            <label for="edit-group-name">Tên Nhóm <span class="text-red-500">*</span></label>
                            <input type="text" id="edit-group-name" name="groupName" required class="form-input" placeholder="Ví dụ: Vệ Sinh Chung">
                        </div>
                        <div class="form-group">
                            <label for="edit-group-order">Thứ tự (Order) <span class="text-red-500">*</span></label>
                            <input type="number" id="edit-group-order" name="groupOrder" required class="form-input" min="1" placeholder="Ví dụ: 1, 2, 3...">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close-btn">Hủy</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save mr-1"></i> Cập Nhật Nhóm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `
  document.body.insertAdjacentHTML('beforeend', modalHTML)

  // Gắn listener cho modal vừa tạo
  const modal = document.getElementById('edit-group-modal')
  modal.addEventListener('click', e => {
    if (
      e.target.classList.contains('modal-overlay') ||
      e.target.closest('.modal-close-btn')
    ) {
      hideModal('edit-group-modal')
    }
  })

  document
    .getElementById('edit-group-form')
    .addEventListener('submit', handleEditGroupSubmit)
}

/**
 * Hiển thị modal chỉnh sửa nhóm và điền dữ liệu hiện có.
 * @param {string} groupCode Mã nhóm cần chỉnh sửa.
 */
async function showEditGroupModal(groupCode) {
  try {
    const groupDocRef = doc(db, 'task_groups', groupCode)
    const docSnap = await getDoc(groupDocRef)

    if (docSnap.exists()) {
      const groupData = docSnap.data()
      document.getElementById('edit-group-code').value = groupCode
      document.getElementById('edit-group-name').value = groupData.name || ''
      document.getElementById('edit-group-order').value = groupData.order || 1

      const modal = document.getElementById('edit-group-modal')
      modal.classList.remove('hidden')
      modal.classList.add('flex')
      setTimeout(() => modal.classList.add('show'), 10)
    } else {
      window.showToast(
        `Không tìm thấy nhóm "${groupCode}" để chỉnh sửa.`,
        'error'
      )
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu nhóm để chỉnh sửa:', error)
    window.showToast('Đã xảy ra lỗi khi tải dữ liệu nhóm.', 'error')
  }
}

/**
 * Xử lý việc submit form chỉnh sửa nhóm.
 * @param {Event} e
 */
async function handleEditGroupSubmit(e) {
  e.preventDefault()
  const form = e.target
  const groupCode = form.elements.groupCode.value
  const groupName = form.elements.groupName.value.trim()
  const groupOrder = parseInt(form.elements.groupOrder.value, 10)

  if (!groupCode || !groupName || isNaN(groupOrder)) {
    window.showToast('Vui lòng điền đầy đủ thông tin hợp lệ.', 'warning')
    return
  }

  const submitButton = form.querySelector('button[type="submit"]')
  submitButton.disabled = true
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin mr-1"></i> Đang cập nhật...'

  try {
    const groupDocRef = doc(db, 'task_groups', groupCode)
    await updateDoc(groupDocRef, {
      name: groupName,
      order: groupOrder,
    })
    window.showToast(
      `Đã cập nhật nhóm "${groupName}" (${groupCode}).`,
      'success'
    )
    hideModal('edit-group-modal')
    renderPage() // Render lại trang để cập nhật
  } catch (error) {
    console.error('Lỗi khi cập nhật nhóm:', error)
    window.showToast(
      'Đã xảy ra lỗi khi cập nhật nhóm. Vui lòng thử lại.',
      'error'
    )
  } finally {
    submitButton.disabled = false
    submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Cập Nhật Nhóm'
  }
}
//#endregion

//#region EDIT TASK MODAL
/**
 * Tạo và chèn modal chỉnh sửa task vào DOM nếu chưa tồn tại.
 */
function injectEditTaskModal() {
  if (document.getElementById('edit-task-modal')) return

  const modalHTML = `
        <div id="edit-task-modal" class="modal-overlay hidden">
            <div class="modal-content max-w-md w-full">
                <form id="edit-task-form">
                    <div class="modal-header">
                        <h3 class="modal-title">Chỉnh Sửa Task</h3>
                        <button type="button" class="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="edit-task-group-code" name="groupCode">
                        <input type="hidden" id="edit-task-original-order" name="originalOrder">
                        <div class="form-group">
                            <label for="edit-task-name">Tên Task <span class="text-red-500">*</span></label>
                            <input type="text" id="edit-task-name" name="name" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="edit-task-type">Loại Task <span class="text-red-500">*</span></label>
                            <select id="edit-task-type" name="typeTask" required class="form-input">
                                <option value="">-- Chọn loại --</option>
                                <option value="Product">Product (P)</option>
                                <option value="Fixed">Fixed (F)</option>
                                <option value="CTM">CTM</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-task-order">Thứ tự (Order) <span class="text-red-500">*</span></label>
                            <input type="number" id="edit-task-order" name="order" required class="form-input" min="1">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="edit-task-frequency">Tần suất</label>
                                <select id="edit-task-frequency" name="frequency" class="form-input">
                                    <option value="Daily">Hàng ngày (Daily)</option>
                                    <option value="Weekly">Hàng tuần (Weekly)</option>
                                    <option value="Monthly">Hàng tháng (Monthly)</option>
                                    <option value="Yearly">Hàng năm (Yearly)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit-task-manual-number">Số Manual</label>
                                <input type="text" id="edit-task-manual-number" name="manual_number" class="form-input">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="edit-task-manual-link">Link Manual</label>
                            <input type="text" id="edit-task-manual-link" name="manual_link" class="form-input">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close-btn">Hủy</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save mr-1"></i> Lưu Thay Đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `
  document.body.insertAdjacentHTML('beforeend', modalHTML)

  const modal = document.getElementById('edit-task-modal')
  modal.addEventListener('click', e => {
    if (
      e.target.classList.contains('modal-overlay') ||
      e.target.closest('.modal-close-btn')
    ) {
      hideModal('edit-task-modal')
    }
  })

  document
    .getElementById('edit-task-form')
    .addEventListener('submit', handleEditTaskSubmit)
}

/**
 * Hiển thị modal chỉnh sửa task và điền dữ liệu.
 * @param {string} groupCode Mã nhóm chứa task.
 * @param {number} taskOrder Thứ tự của task cần sửa.
 */
async function showEditTaskModal(groupCode, taskOrder) {
  try {
    const groupDocRef = doc(db, 'task_groups', groupCode)
    const docSnap = await getDoc(groupDocRef)

    if (docSnap.exists()) {
      const tasks = docSnap.data().tasks || []
      // Sử dụng so sánh lỏng (==) để bỏ qua sự khác biệt giữa number và string.
      // Ví dụ: 1 == "1" là true, trong khi 1 === "1" là false.
      // Điều này giúp tìm thấy task ngay cả khi 'order' trong Firestore được lưu dưới dạng string.
      const taskToEdit = tasks.find(t => t.order == taskOrder)

      if (taskToEdit) {
        document.getElementById('edit-task-group-code').value = groupCode
        document.getElementById('edit-task-original-order').value =
          taskToEdit.order
        document.getElementById('edit-task-name').value = taskToEdit.name
        document.getElementById('edit-task-order').value = taskToEdit.order
        document.getElementById('edit-task-type').value =
          taskToEdit.typeTask || ''
        document.getElementById('edit-task-frequency').value =
          taskToEdit.frequency || 'Daily'
        document.getElementById('edit-task-manual-number').value =
          taskToEdit.manual_number || ''
        document.getElementById('edit-task-manual-link').value =
          taskToEdit.manual_link || ''
        const modal = document.getElementById('edit-task-modal')
        modal.classList.remove('hidden')
        modal.classList.add('flex')
        setTimeout(() => modal.classList.add('show'), 10)
      } else {
        console.error(
          `Không tìm thấy task với order ${taskOrder} trong nhóm ${groupCode}.`
        )
        window.showToast(
          `Không tìm thấy task với order ${taskOrder} trong nhóm ${groupCode}.`,
          'error'
        )
      }
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu task để sửa:', error)
    window.showToast('Đã xảy ra lỗi khi tải dữ liệu task.', 'error')
  }
}

/**
 * Xử lý việc submit form chỉnh sửa task.
 * @param {Event} e
 */
async function handleEditTaskSubmit(e) {
  e.preventDefault()
  const form = e.target
  const groupCode = form.elements.groupCode.value
  const originalOrder = parseInt(form.elements.originalOrder.value, 10)
  const newName = form.elements.name.value.trim()
  const newOrder = parseInt(form.elements.order.value, 10)
  const newTypeTask = form.elements.typeTask.value
  const newFrequency = form.elements.frequency.value
  const newManualNumber = form.elements.manual_number.value.trim()
  const newManualLink = form.elements.manual_link.value.trim()

  if (!groupCode || !newName || isNaN(newOrder)) {
    window.showToast('Vui lòng điền đầy đủ thông tin hợp lệ.', 'warning')
    return
  }

  const submitButton = form.querySelector('button[type="submit"]')
  submitButton.disabled = true
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin mr-1"></i> Đang lưu...'

  try {
    const groupDocRef = doc(db, 'task_groups', groupCode)
    const docSnap = await getDoc(groupDocRef)
    let tasks = docSnap.data().tasks || []

    // Tìm task gốc và lọc ra các task khác
    const taskToUpdate = tasks.find(t => t.order === originalOrder)
    const otherTasks = tasks.filter(t => t.order !== originalOrder)

    if (!taskToUpdate) {
      throw new Error(
        `Không tìm thấy task gốc với order ${originalOrder} để cập nhật.`
      )
    }

    // Nếu order mới đã tồn tại, đẩy các order khác lên
    // Chỉ thực hiện nếu order thực sự thay đổi
    if (
      originalOrder !== newOrder &&
      otherTasks.some(t => t.order === newOrder)
    ) {
      otherTasks.forEach(t => {
        if (t.order >= newOrder) t.order++
      })
    }

    // Tạo task đã cập nhật và thêm lại vào mảng
    // Kế thừa các thuộc tính cũ và ghi đè những thuộc tính mới
    const updatedTask = {
      ...taskToUpdate, // Kế thừa tất cả thuộc tính của task gốc
      name: newName,
      order: newOrder,
      typeTask: newTypeTask,
      frequency: newFrequency,
      manual_number: newManualNumber || null,
      manual_link: newManualLink || '',
    }
    const finalTasks = [...otherTasks, updatedTask]

    await updateDoc(groupDocRef, { tasks: finalTasks })

    window.showToast(`Đã cập nhật task "${newName}".`, 'success')
    hideModal('edit-task-modal')
    renderPage()
  } catch (error) {
    console.error('Lỗi khi cập nhật task:', error)
    window.showToast('Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.', 'error')
  } finally {
    submitButton.disabled = false
    submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu Thay Đổi'
  }
}
//#endregion

/**
 * Dọn dẹp tất cả các listener (sự kiện DOM, Firestore) của module này.
 * Được gọi bởi main.js trước khi chuyển sang trang khác.
 */
export function cleanup() {
  // Hủy tất cả các listener của Firestore
  activeListeners.forEach(unsubscribe => unsubscribe && unsubscribe())
  activeListeners = []
}

/**
 * Hàm khởi tạo, được gọi bởi main.js khi trang này được tải.
 */
export function init() {
  injectEditTaskModal()
  injectEditGroupModal()
  renderPage()
  injectAddTaskModal() // Chuyển xuống cuối để đảm bảo DOM sẵn sàng
}
