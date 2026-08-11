// ============================================================
// 1. 渲染侧边栏（桌面端和移动端共用）
// ============================================================
function renderSidebar() {
    var desktopSidebar = document.getElementById('desktopSidebar');
    var mobileMenuList = document.getElementById('mobileMenuList');

    if (!desktopSidebar || !mobileMenuList) {
        console.warn('侧边栏容器未找到');
        return;
    }

    var html = '';
    sidebarMenu.forEach(function(category) {
        var items = getMenuItems(category);
        html += '<li class="category">';
        html += '<span class="category-toggle"><i class="fas ' + category.icon + '"></i> ' + category.title + '</span>';
        html += '<ul class="sub-menu">';
        items.forEach(function(item) {
            var displayName = item.display || displayNames[item.name] || item.name;
            var indent = item.indent || 0;
            var style = indent > 0 ? 'padding-left:' + (1.2 + (indent - 1) * 0.8) + 'rem;font-size:clamp(0.8rem, 0.9vw, 0.9rem);color:var(--text-muted);' : '';
            html += '<li style="' + style + '"><a href="#page-' + item.name + '">' + displayName + '</a></li>';
        });
        html += '</ul></li>';
    });

    // 桌面端渲染
    desktopSidebar.innerHTML = '<nav class="sidebar-nav"><ul>' + html + '</ul></nav>';

    // 移动端渲染（只渲染菜单，品牌和登录由 HTML 结构提供）
    mobileMenuList.innerHTML = html;

    // 重新绑定事件
    initSidebarEvents();
    // 恢复高亮状态
    initHashHighlight();
}

// ============================================================
// 2. 侧边栏展开/折叠事件
// ============================================================
function initSidebarEvents() {
    document.querySelectorAll('.category-toggle').forEach(function(toggle) {
        toggle.removeEventListener('click', handleToggle);
        toggle.addEventListener('click', handleToggle);
    });

    document.querySelectorAll('.sub-menu a').forEach(function(link) {
        link.removeEventListener('click', handleLinkClick);
        link.addEventListener('click', handleLinkClick);
    });
}

function handleToggle(e) {
    e.stopPropagation();
    var parent = this.closest('.category');
    var sub = parent.querySelector('.sub-menu');
    if (sub) {
        sub.classList.toggle('open');
        this.classList.toggle('open');
    }
}

function handleLinkClick(e) {
    var href = this.getAttribute('href');
    if (href && href.startsWith('#page-')) {
        e.preventDefault();
        if (typeof window.loadPage === 'function') {
            window.loadPage(href.replace('#page-', ''));
        }
        // 移动端点击后自动关闭侧边栏
        closeSidebarIfMobile();
    }
}

// ============================================================
// 3. 移动端侧边栏控制（汉堡菜单）
// ============================================================
function closeSidebarIfMobile() {
    if (window.innerWidth < 769) {
        var sidebar = document.getElementById('mobileSidebar');
        var hamburger = document.getElementById('hamburgerBtn');
        var overlay = document.getElementById('mobileOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initHamburger() {
    var hamburger = document.getElementById('hamburgerBtn');
    var sidebar = document.getElementById('mobileSidebar');
    var overlay = document.getElementById('mobileOverlay');

    if (!hamburger || !sidebar || !overlay) {
        console.warn('汉堡菜单元素未找到');
        return;
    }

    function toggleSidebar(e) {
        e.stopPropagation();
        var isOpen = sidebar.classList.toggle('open');
        hamburger.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        hamburger.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 移除旧监听器避免重复绑定
    hamburger.removeEventListener('click', toggleSidebar);
    hamburger.addEventListener('click', toggleSidebar);

    overlay.removeEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // 窗口大小变化时自动关闭移动端侧边栏
    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
}

function handleResize() {
    if (window.innerWidth >= 769) {
        var sidebar = document.getElementById('mobileSidebar');
        var hamburger = document.getElementById('hamburgerBtn');
        var overlay = document.getElementById('mobileOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================================
// 4. URL 哈希与侧边栏高亮同步
// ============================================================
function initHashHighlight() {
    var hash = window.location.hash;
    if (hash && hash.startsWith('#page-')) {
        var pageId = decodeURIComponent(hash.replace('#page-', ''));
        updateActiveState(pageId);
    }
}

function updateActiveState(pageId) {
    document.querySelectorAll('.sub-menu a, .card-list li').forEach(function(el) {
        el.classList.remove('active');
    });
    document.querySelectorAll('.sub-menu a[href="#page-' + pageId + '"]').forEach(function(el) {
        el.classList.add('active');
        // 自动展开父级菜单
        var parentSub = el.closest('.sub-menu');
        if (parentSub) {
            parentSub.classList.add('open');
            var parentToggle = parentSub.closest('.category').querySelector('.category-toggle');
            if (parentToggle) {
                parentToggle.classList.add('open');
            }
        }
    });
    document.querySelectorAll('.card-list li[data-page="' + pageId + '"]').forEach(function(el) {
        el.classList.add('active');
    });
}

// 监听 hashchange 保持高亮同步
window.addEventListener('hashchange', function() {
    var hash = window.location.hash;
    if (hash && hash.startsWith('#page-')) {
        var pageId = decodeURIComponent(hash.replace('#page-', ''));
        updateActiveState(pageId);
    } else {
        // 回到首页时清除高亮
        document.querySelectorAll('.sub-menu a, .card-list li').forEach(function(el) {
            el.classList.remove('active');
        });
    }
});

// ============================================================
// 5. 登录状态同步（顶部栏 + 侧边栏）
// ============================================================
function updateAuthUI() {
    var token = localStorage.getItem('token');
    var username = localStorage.getItem('username');

    // 顶部导航栏
    var loginBtn = document.getElementById('loginBtn');
    var logoutBtn = document.getElementById('logoutBtn');
    var userDisplay = document.getElementById('userDisplay');
    var usernameDisplay = document.getElementById('usernameDisplay');

    // 侧边栏
    var sidebarUser = document.getElementById('sidebarUser');
    var sidebarUsername = document.getElementById('sidebarUsername');
    var sidebarLoginBtn = document.getElementById('sidebarLoginBtn');
    var sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');

    if (token && username) {
        // 顶部栏
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-flex';
        }
        if (userDisplay) {
            userDisplay.style.display = 'inline-block';
        }
        if (usernameDisplay) usernameDisplay.textContent = username;

        // 侧边栏
        if (sidebarUser) sidebarUser.style.display = 'flex';
        if (sidebarUsername) sidebarUsername.textContent = username;
        if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'none';
        if (sidebarLogoutBtn) sidebarLogoutBtn.style.display = 'inline';
    } else {
        // 顶部栏
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userDisplay) userDisplay.style.display = 'none';

        // 侧边栏
        if (sidebarUser) sidebarUser.style.display = 'none';
        if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'inline';
        if (sidebarLogoutBtn) sidebarLogoutBtn.style.display = 'none';
    }
}

// ============================================================
// 6. 房间号显示逻辑
// ============================================================
function initRoomStatus() {
    var banner = document.getElementById('roomBanner');
    var roomNumberDisplay = document.getElementById('roomNumberDisplay');

    if (!banner || !roomNumberDisplay) {
        console.warn('房间号元素未找到');
        return;
    }

    fetch('/room_number.txt?' + Date.now())
        .then(function(response) {
            if (!response.ok) throw new Error('文件不存在');
            return response.text();
        })
        .then(function(text) {
            var match = text.match(/setroomnumber:"([^"]+)"/);
            if (match && match[1]) {
                roomNumberDisplay.textContent = match[1];
                banner.classList.add('show');
            } else {
                banner.classList.remove('show');
                console.log('[MCC Wiki] room_number.txt 格式错误，未找到有效房间号');
            }
        })
        .catch(function() {
            banner.classList.remove('show');
            console.log('[MCC Wiki] room_number.txt 未找到，房间号横幅已隐藏');
        });
}

// ============================================================
// 7. DOM 就绪初始化
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // 先渲染侧边栏
    if (typeof sidebarMenu !== 'undefined' && typeof getMenuItems === 'function') {
        renderSidebar();
    } else {
        console.warn('sidebarMenu 或 getMenuItems 未定义，请确保 data.js 已加载');
    }

    // 初始化汉堡菜单
    initHamburger();

    // 初始化房间号
    initRoomStatus();

    // 初始化登录状态
    updateAuthUI();
});
