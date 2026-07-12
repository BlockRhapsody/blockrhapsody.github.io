// ========================================
// 1. 侧边栏展开/折叠
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    const toggles = document.querySelectorAll('.category-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const parentLi = this.closest('.category');
            const subMenu = parentLi.querySelector('.sub-menu');
            if (subMenu) {
                subMenu.classList.toggle('open');
            }
        });
    });

    // ========================================
    // 2. 房间号显示逻辑（模拟）
    // ========================================
    const banner = document.getElementById('roomBanner');
    const roomNumberDisplay = document.getElementById('roomNumberDisplay');

    /**
     * 更新房间号横幅
     * @param {string|null} roomNumber - 房间号，传 null 或空字符串则隐藏横幅
     */
    function updateRoomDisplay(roomNumber) {
        if (roomNumber && roomNumber.trim() !== '') {
            roomNumberDisplay.textContent = roomNumber.trim();
            banner.style.display = 'block';
        } else {
            banner.style.display = 'none';
        }
    }

    // --- 模拟数据 ---
    // 默认展示“未开房”，由后端控制
    // 这里演示两种状态，你可以根据需要切换

    // 状态1：未开房（隐藏横幅）
    updateRoomDisplay(null);

    // 状态2：开房（显示横幅）
    // 如需测试开房效果，取消下面这行注释，并注释掉上面的 updateRoomDisplay(null)
    // updateRoomDisplay('BR-2026-0712');

    // --- 正式对接后端 API 示例 ---
    // fetch('/api/room-status')
    //     .then(response => response.json())
    //     .then(data => updateRoomDisplay(data.roomNumber))
    //     .catch(() => updateRoomDisplay(null));

    // ========================================
    // 3. 侧边栏高亮当前页面
    // ========================================
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.sub-menu a');

    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.style.backgroundColor = '#2a2a4a';
            link.style.color = '#ffffff';
            // 自动展开父级菜单
            const parentSub = link.closest('.sub-menu');
            if (parentSub) {
                parentSub.classList.add('open');
            }
        }
    });
});
