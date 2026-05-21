// Sidebar: click-to-expand + submenu toggle, mobile drawer, collapse toggle
(function () {
  var hamburgerBtn = document.querySelector('.btn-hamburger');
  var sidebar = document.querySelector('.dashboard-sidebar');
  var overlay = document.querySelector('.sidebar-overlay');
  var expandToggle = document.getElementById('sidebarExpandToggle');
  var mainContent = document.querySelector('.dashboard-content');
  var mq = window.matchMedia('(min-width: 769px)');

  var txnNavItem = sidebar ? sidebar.querySelector('[data-subnav-id="nav-transaction-search-sub"]') : null;
  var txnSubNav = document.getElementById('nav-transaction-search-sub');
  var beftnNavItem = sidebar ? sidebar.querySelector('[data-subnav-id="nav-beftn-sub"]') : null;
  var beftnSubNav = document.getElementById('nav-beftn-sub');

  function getEventElement(event) {
    var target = event.target;
    if (target && target.nodeType === 1) {
      return target;
    }
    return target && target.parentElement ? target.parentElement : null;
  }

  function isDesktop() {
    return mq.matches;
  }

  function isDashboardPage() {
    var page = document.body.getAttribute('data-page');
    return !page || page === 'dashboard';
  }

  function isTxnSearchPage() {
    var page = document.body.getAttribute('data-page') || '';
    return page.indexOf('transaction-search') === 0;
  }

  function isBeftnPage() {
    var page = document.body.getAttribute('data-page') || '';
    return page.indexOf('beftn-') === 0;
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

  function openTxnSubnav() {
    if (!txnNavItem || !txnSubNav) return;
    txnNavItem.classList.add('active');
    txnNavItem.classList.add('nav-open');
    txnNavItem.setAttribute('aria-expanded', 'true');
    txnSubNav.classList.add('subnav-open');
  }

  function openBeftnSubnav() {
    if (!beftnNavItem || !beftnSubNav) return;
    beftnNavItem.classList.add('active');
    beftnNavItem.classList.add('nav-open');
    beftnNavItem.setAttribute('aria-expanded', 'true');
    beftnSubNav.classList.add('subnav-open');
  }

  function isModuleSubnavPage() {
    return isTxnSearchPage() || isBeftnPage();
  }

  function openCurrentModuleSubnav() {
    if (isTxnSearchPage()) {
      openTxnSubnav();
    } else if (isBeftnPage()) {
      openBeftnSubnav();
    }
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
    sidebar.querySelectorAll('.subnav-item.active').forEach(function (item) {
      item.classList.remove('active');
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
    } else if (isDashboardPage()) {
      setDashboardActive();
    } else if (isModuleSubnavPage()) {
      openCurrentModuleSubnav();
    }
  }

  function closeMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('show');
    sidebar.classList.remove('sidebar-expanded');
    if (overlay) overlay.classList.remove('show');
    if (isDashboardPage()) {
      closeAllSubnavs();
    }
  }

  function openMobileSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.add('show');
    sidebar.classList.add('sidebar-expanded');
    overlay.classList.add('show');
    if (isModuleSubnavPage()) {
      openCurrentModuleSubnav();
    }
  }

  function handleOutsideSidebarClick(event) {
    if (!sidebar) return;

    var target = getEventElement(event);
    if (target) {
      if (hamburgerBtn && hamburgerBtn.contains(target)) return;
      if (target.closest('.dashboard-header')) return;
    }

    if (isDesktop()) {
      if (sidebar.classList.contains('sidebar-expanded')) {
        collapseSidebar();
        if (isModuleSubnavPage()) {
          openCurrentModuleSubnav();
        }
      }
      return;
    }

    if (sidebar.classList.contains('show')) {
      closeMobileSidebar();
    }
  }

  function initModulePageNav() {
    if (!isModuleSubnavPage() || !sidebar) return;

    if (isDesktop()) {
      expandSidebar();
      openCurrentModuleSubnav();
      return;
    }

    sidebar.classList.remove('sidebar-expanded');
    updateToggleUi();
  }

  if (hamburgerBtn && sidebar && overlay) {
    hamburgerBtn.addEventListener('click', function (event) {
      event.stopPropagation();

      if (sidebar.classList.contains('show')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
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
        if (isModuleSubnavPage()) {
          openCurrentModuleSubnav();
        }
      } else {
        expandSidebar();
      }
    });
  }

  if (sidebar) {
    sidebar.addEventListener('click', function (event) {
      var target = getEventElement(event);
      if (!target) return;

      if (target.closest('.subnav-item')) {
        return;
      }

      var dashboardLink = target.closest('.nav-item-link');
      if (dashboardLink && sidebar.contains(dashboardLink)) {
        closeAllSubnavs();
        return;
      }

      var navItem = target.closest('.nav-item.nav-has-children');
      if (!navItem || !sidebar.contains(navItem)) return;

      event.preventDefault();
      toggleNavItem(navItem);
    });

    if (isDashboardPage()) {
      var hasMenuActive = sidebar.querySelector('.nav-item.nav-has-children.active');
      if (!hasMenuActive) {
        setDashboardActive();
      }
    } else {
      initModulePageNav();
    }
  }

  if (mainContent && sidebar) {
    mainContent.addEventListener('click', handleOutsideSidebarClick);
  }

  mq.addEventListener('change', function () {
    if (isDesktop()) {
      sidebar.classList.remove('show');
      if (overlay) overlay.classList.remove('show');
      if (isModuleSubnavPage()) {
        initModulePageNav();
      }
    } else if (isModuleSubnavPage()) {
      sidebar.classList.remove('sidebar-expanded');
      sidebar.classList.remove('show');
      if (overlay) overlay.classList.remove('show');
      openCurrentModuleSubnav();
      updateToggleUi();
    }
  });

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
