document.addEventListener('DOMContentLoaded', () => {
    const workPositions = [
        { "id": "LEADER", "name": "Leader" },
        { "id": "POS", "name": "POS" },
        { "id": "MMD", "name": "MMD" },
        { "id": "MERCHANDISE", "name": "Ngành hàng" },
        { "id": "CAFE", "name": "Aeon Cafe" }
    ];

    const openPopupBtn = document.getElementById('openPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const modalOverlay = document.getElementById('positionModal');
    const positionList = document.getElementById('positionList');

    // Đổ dữ liệu vào danh sách
    workPositions.forEach(position => {
        const listItem = document.createElement('li');
        listItem.className = 'position-item';
        listItem.textContent = position.name;
        listItem.dataset.id = position.id;
        positionList.appendChild(listItem);
    });

    function showPopup() {
        modalOverlay.classList.add('visible');
    }

    function hidePopup() {
        modalOverlay.classList.remove('visible');
    }

    openPopupBtn.addEventListener('click', showPopup);
    closePopupBtn.addEventListener('click', hidePopup);

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            hidePopup();
        }
    });

    positionList.addEventListener('click', (event) => {
        if (event.target.classList.contains('position-item')) {
            console.log(`Đã chọn: ${event.target.textContent} (ID: ${event.target.dataset.id})`);
            hidePopup();
        }
    });
});