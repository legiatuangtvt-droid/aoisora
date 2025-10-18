import { db } from '../firebase.js';
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

// --- Firestore Logic (Thay thế cho check_lists.php) ---

/**
 * Lấy tất cả các checklist từ Firestore.
 * Tương đương với: GET /check_lists.php
 * @returns {Promise<Array>} Một mảng các đối tượng checklist.
 */
async function getChecklists() {
  const checklistsCol = collection(db, 'check_lists');
  const checklistSnapshot = await getDocs(checklistsCol);
  const checklistList = checklistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return checklistList;
}

/**
 * Thêm một hoặc nhiều checklist, đảm bảo không trùng lặp tên.
 * Tương đương với: POST /check_lists.php
 * @param {string[]} names - Một mảng các tên checklist cần thêm.
 * @returns {Promise<string[]>} Một mảng các ID của checklist (cả mới và đã tồn tại).
 */
async function addOrGetChecklists(names) {
    const finalIds = [];
    const checklistsRef = collection(db, "check_lists");

    for (const name of names) {
        const trimmedName = name.trim();
        if (!trimmedName) continue;

        // 1. Tìm kiếm item đã tồn tại
        const q = query(checklistsRef, where("check_list_name", "==", trimmedName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // 2a. Nếu đã tồn tại, sử dụng ID của nó
            finalIds.push(querySnapshot.docs[0].id);
        } else {
            // 2b. Nếu chưa tồn tại, tạo mới và lấy ID
            const docRef = await addDoc(checklistsRef, {
                check_list_name: trimmedName,
                created_at: new Date() // Lưu timestamp khi tạo
            });
            finalIds.push(docRef.id);
        }
    }
    return finalIds;
}

// --- Giao diện người dùng (UI Logic) ---

const modal = document.getElementById('modal');
const title = document.getElementById('modal-title');
const body = document.getElementById('modal-body');
const close = document.getElementById('close');
const ok = document.getElementById('ok');

function openModal(name){
  title.textContent = 'Feature under development';
  body.textContent = (name || 'This') + ': This feature is under development. Please check back later.';
  modal.setAttribute('aria-hidden','false');
}
function hide(){ modal.setAttribute('aria-hidden','true') }

// POP for tiles without links
document.querySelectorAll('.tile.pop').forEach(t => {
  t.addEventListener('click', () => openModal(t.dataset.name));
  t.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openModal(t.dataset.name); }
  });
});
[close, ok, modal].forEach(el => el.addEventListener('click', (e)=>{
  if(e.target === el) hide();
}));
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') hide() });

// Strong pulse only when clicking Training
const trainingTile = document.getElementById('training-tile');
const trainingBadge = document.getElementById('training-badge');
if (trainingTile) {
  trainingTile.addEventListener('click', () => {
    trainingTile.classList.remove('pulse-active');
    trainingBadge.classList.remove('burst');
    // force reflow to restart animation
    void trainingTile.offsetWidth;
    void trainingBadge.offsetWidth;
    trainingTile.classList.add('pulse-active');
    trainingBadge.classList.add('burst');
  });
  trainingTile.addEventListener('animationend', () => trainingTile.classList.remove('pulse-active'));
}