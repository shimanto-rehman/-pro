// Sidebar: mobile toggle, debounced hover expand, pin via toggle button, sub-navigation
(function () {
  var HOVER_ENTER_MS = 240;
  var HOVER_LEAVE_MS = 420;
  var hamburgerBtn = document.querySelector('.btn-hamburger');
  var sidebar = document.querySelector('.dashboard-sidebar');
  var overlay = document.querySelector('.sidebar-overlay');
  var expandToggle = document.getElementById('sidebarExpandToggle');
  var hoverEnterTimer = null;
  var hoverLeaveTimer = null;
  var manualExpandLock = false;

  var mq = window.matchMedia('(min-width: 769px)');

  function isDesktop() {
    return mq.matches;
  }

  function clearHoverTimers() {
    if (hoverEnterTimer) {
      clearTimeout(hoverEnterTimer);
      hoverEnterTimer = null;
    }
    if (hoverLeaveTimer) {
      clearTimeout(hoverLeaveTimer);
      hoverLeaveTimer = null;
    }
  }

  function closeAllSubnavs() {
    if (!sidebar) return;
    sidebar.querySelectorAll('.nav-item.nav-open').forEach(function (item) {
      item.classList.remove('nav-open');
    });
    sidebar.querySelectorAll('.sidebar-subnav.subnav-open').forEach(function (sub) {
      sub.classList.remove('subnav-open');
    });
  }

  function openActiveSubmenu() {
    if (!sidebar) return;
    var activeNavItem = sidebar.querySelector('.nav-item.active.nav-has-children');
    if (activeNavItem) {
      var subId = activeNavItem.getAttribute('data-subnav-id');
      if (subId) {
        var subNav = document.getElementById(subId);
        if (subNav) {
          activeNavItem.classList.add('nav-open');
          subNav.classList.add('subnav-open');
        }
      }
    }
  }

  function updateToggleUi() {
    if (!expandToggle || !sidebar) return;
    var expanded = sidebar.classList.contains('sidebar-expanded');
    expandToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    expandToggle.setAttribute('title', expanded ? 'Collapse sidebar' : 'Expand sidebar');
  }

  function onDesktopBreakpointChange() {
    if (!isDesktop()) {
      clearHoverTimers();
      manualExpandLock = false;
      updateToggleUi();
    }
  }

  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', onDesktopBreakpointChange);
  } else if (typeof mq.addListener === 'function') {
    mq.addListener(onDesktopBreakpointChange);
  }

  if (hamburgerBtn && sidebar && overlay) {
    hamburgerBtn.addEventListener('click', function () {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');

      var isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        if (sidebar.classList.contains('show')) {
          sidebar.classList.add('sidebar-expanded');
        } else {
          sidebar.classList.remove('sidebar-expanded');
        }
      }
    });

    overlay.addEventListener('click', function () {
      sidebar.classList.remove('show');
      sidebar.classList.remove('sidebar-expanded');
      overlay.classList.remove('show');
    });
  }

  if (expandToggle && sidebar) {
    expandToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!isDesktop()) return;
      clearHoverTimers();
      var expanded = sidebar.classList.contains('sidebar-expanded');
      if (!expanded) {
        manualExpandLock = true;
        sidebar.classList.add('sidebar-expanded');
        setTimeout(openActiveSubmenu, 100);
      } else {
        manualExpandLock = false;
        sidebar.classList.remove('sidebar-expanded');
        closeAllSubnavs();
      }
      updateToggleUi();
    });
  }

  if (sidebar) {
    sidebar.addEventListener('mouseenter', function () {
      if (!isDesktop()) return;
      if (manualExpandLock) return;
      clearTimeout(hoverLeaveTimer);
      hoverLeaveTimer = null;
      hoverEnterTimer = setTimeout(function () {
        hoverEnterTimer = null;
        if (manualExpandLock) return;
        sidebar.classList.add('sidebar-expanded');
        setTimeout(openActiveSubmenu, 100);
        updateToggleUi();
      }, HOVER_ENTER_MS);
    });

    sidebar.addEventListener('mouseleave', function () {
      if (!isDesktop()) return;
      if (manualExpandLock) return;
      clearTimeout(hoverEnterTimer);
      hoverEnterTimer = null;
      hoverLeaveTimer = setTimeout(function () {
        hoverLeaveTimer = null;
        if (manualExpandLock) return;
        sidebar.classList.remove('sidebar-expanded');
        closeAllSubnavs();
        updateToggleUi();
      }, HOVER_LEAVE_MS);
    });

    sidebar.addEventListener('click', function (event) {
      var btn = event.target.closest('.nav-expand-btn');
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();

      var navItem = btn.closest('.nav-item');
      var subId = navItem ? navItem.getAttribute('data-subnav-id') : null;
      if (!subId) return;

      var subNav = document.getElementById(subId);
      if (!subNav) return;

      if (!isDesktop() && sidebar.classList.contains('show')) {
        sidebar.classList.add('sidebar-expanded');
      }

      var isOpen = navItem.classList.contains('nav-open');
      if (isOpen) {
        navItem.classList.remove('nav-open');
        subNav.classList.remove('subnav-open');
      } else {
        navItem.classList.add('nav-open');
        subNav.classList.add('subnav-open');
      }
    });
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
