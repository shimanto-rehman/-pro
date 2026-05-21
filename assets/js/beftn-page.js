(function () {
  var typeNav = document.querySelector('.beftn-type-nav');
  if (!typeNav) return;

  var buttons = typeNav.querySelectorAll('.beftn-type-nav-btn');
  var panels = document.querySelectorAll('.beftn-type-panel');

  function showType(type) {
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-beftn-type') === type;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach(function (panel) {
      var match = panel.getAttribute('data-beftn-panel') === type;
      panel.hidden = !match;
    });
  }

  typeNav.addEventListener('click', function (event) {
    var btn = event.target.closest('.beftn-type-nav-btn');
    if (!btn || !typeNav.contains(btn)) return;
    showType(btn.getAttribute('data-beftn-type'));
  });

  var initial = typeNav.querySelector('.beftn-type-nav-btn.is-active');
  if (initial) {
    showType(initial.getAttribute('data-beftn-type'));
  }
})();
