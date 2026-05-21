// Sidebar: click-to-expand + submenu toggle, mobile drawer, collapse toggle
(function () {
  var hamburgerBtn = document.querySelector('.btn-hamburger');
  var sidebar = document.querySelector('.dashboard-sidebar');
  var overlay = document.querySelector('.sidebar-overlay');
  var expandToggle = document.getElementById('sidebarExpandToggle');
  var mq = window.matchMedia('(min-width: 769px)');

  function isDesktop() {
    return mq.matches;
  }

  function closeAllSubnavs() {
    if (!sidebar) return;
    sidebar.querySelectorAll('.nav-item.nav-open').forEach(function (item) {
      item.classList.remove('nav-open');
      item.setAttribute('aria-expanded', 'false');
    });
    sidebar.querySelectorAll('.sidebar-subnav.subnav-open').forEach(function (sub) {
      sub.classList.remove('subnav-open');
    });
  }

  function updateToggleUi() {
    if (!expandToggle || !sidebar) return;
    var expanded = sidebar.classList.contains('sidebar-expanded');
    expandToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    expandToggle.setAttribute('title', expanded ? 'Collapse sidebar' : 'Expand sidebar');
  }

  function expandSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('sidebar-expanded');
    updateToggleUi();
  }

  function setDashboardActive() {
    if (!sidebar) return;
    var dashboardLink = sidebar.querySelector('.nav-item-link');
    if (!dashboardLink) return;
    sidebar.querySelectorAll('.nav-item.active').forEach(function (item) {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    });
    dashboardLink.classList.add('active');
    dashboardLink.setAttribute('aria-current', 'page');
  }

  function collapseSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('sidebar-expanded');
    closeAllSubnavs();
    updateToggleUi();
  }

  function toggleNavItem(navItem) {
    if (!sidebar || !navItem) return;

    var subId = navItem.getAttribute('data-subnav-id');
    if (!subId) return;

    var subNav = document.getElementById(subId);
    if (!subNav) return;

    expandSidebar();

    if (!isDesktop() && sidebar.classList.contains('show')) {
      sidebar.classList.add('sidebar-expanded');
    }

    var isOpen = navItem.classList.contains('nav-open');

    closeAllSubnavs();
    sidebar.querySelectorAll('.nav-item.active').forEach(function (item) {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    });

    if (!isOpen) {
      navItem.classList.add('nav-open');
      navItem.classList.add('active');
      navItem.setAttribute('aria-expanded', 'true');
      subNav.classList.add('subnav-open');
    } else {
      setDashboardActive();
    }
  }

  function closeMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('show');
    sidebar.classList.remove('sidebar-expanded');
    if (overlay) overlay.classList.remove('show');
    closeAllSubnavs();
  }

  function handleOutsideSidebarClick(event) {
    if (!sidebar || sidebar.contains(event.target)) return;
    if (hamburgerBtn && hamburgerBtn.contains(event.target)) return;

    if (isDesktop()) {
      if (sidebar.classList.contains('sidebar-expanded')) {
        collapseSidebar();
      }
      return;
    }

    if (sidebar.classList.contains('show')) {
      closeMobileSidebar();
    }
  }

  if (hamburgerBtn && sidebar && overlay) {
    hamburgerBtn.addEventListener('click', function () {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');

      if (window.matchMedia('(max-width: 768px)').matches) {
        if (sidebar.classList.contains('show')) {
          sidebar.classList.add('sidebar-expanded');
        } else {
          sidebar.classList.remove('sidebar-expanded');
          closeAllSubnavs();
        }
      }
    });

    overlay.addEventListener('click', function () {
      closeMobileSidebar();
    });
  }

  if (expandToggle && sidebar) {
    expandToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!isDesktop()) return;

      if (sidebar.classList.contains('sidebar-expanded')) {
        collapseSidebar();
      } else {
        expandSidebar();
      }
    });
  }

  if (sidebar) {
    sidebar.addEventListener('click', function (event) {
      var dashboardLink = event.target.closest('.nav-item-link');
      if (dashboardLink && sidebar.contains(dashboardLink)) {
        closeAllSubnavs();
        setDashboardActive();
        var onDashboard = window.location.pathname.endsWith('index.html') ||
          window.location.pathname.endsWith('/') ||
          window.location.pathname.endsWith('\\');
        if (onDashboard) {
          event.preventDefault();
        }
        return;
      }

      var navItem = event.target.closest('.nav-item.nav-has-children');
      if (!navItem || !sidebar.contains(navItem)) return;

      event.preventDefault();
      toggleNavItem(navItem);
    });

    var hasMenuActive = sidebar.querySelector('.nav-item.nav-has-children.active');
    if (!hasMenuActive) {
      setDashboardActive();
    }

    document.addEventListener('click', handleOutsideSidebarClick);
  }

  updateToggleUi();
})();

/* Header: mark all notifications read (demo) */
(function () {
  document.querySelectorAll('.btn-notification-mark-read').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var panel = btn.closest('.notification-panel');
      if (!panel) return;
      panel.querySelectorAll('.notification-item.unread').forEach(function (el) {
        el.classList.remove('unread');
      });
      var badge = document.querySelector('.notification-dropdown .notification-badge');
      if (badge) {
        badge.textContent = '0';
        badge.classList.add('notification-badge-hidden');
      }
    });
  });
})();
