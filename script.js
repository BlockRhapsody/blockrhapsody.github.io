// ============================================================
// 1. 渲染侧边栏（桌面端和移动端共用）
// ============================================================
function renderSidebar() {
    var desktopSidebar = document.getElementById('desktopSidebar');
    var mobileSidebar = document.getElementById('mobileSidebar');
    
    if (!desktopSidebar || !mobileSidebar) {
        console.warn('侧边栏容器未找到');
        return;
    }
    
    var html = '<nav class="sidebar-nav"><ul>';
    
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
    
    html += '</ul></nav>';
    
    desktopSidebar.innerHTML = html;
    mobileSidebar.innerHTML = html;
    
    initSidebarEvents();
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

    if (!hamburger || !sidebar || !overlay) return;

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

    hamburger.removeEventListener('click', toggleSidebar);
    hamburger.addEventListener('click', toggleSidebar);
    
    overlay.removeEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

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
        document.querySelectorAll('.sub-menu a, .card-list li').forEach(function(el) {
            el.classList.remove('active');
        });
    }
});

// ============================================================
// 5. DOM 就绪初始化
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // 确保 data.js 已加载
    if (typeof sidebarMenu !== 'undefined' && typeof getMenuItems === 'function') {
        renderSidebar();
    } else {
        console.warn('sidebarMenu 或 getMenuItems 未定义，请确保 data.js 已加载');
    }
    
    initHamburger();
});
