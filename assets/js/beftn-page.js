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

/* ---- Card expand / minimize toggle ---- */
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.beftn-toggle-btn');
    if (!btn) return;

    var targetId = btn.getAttribute('data-target');
    var body = document.getElementById(targetId);
    if (!body) return;

    var card = btn.closest('.beftn-module-card');
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    var collapsing = expanded;

    btn.setAttribute('aria-expanded', collapsing ? 'false' : 'true');
    btn.setAttribute('title', collapsing ? 'Expand' : 'Minimize');
    body.classList.toggle('is-collapsed', collapsing);
    if (card) card.classList.toggle('is-collapsed', collapsing);
  });
})();

/* ---- Searchable dropdown ---- */
(function () {
  function initSearchable(select) {
    if (select.dataset.searchableInit) return;
    select.dataset.searchableInit = 'true';

    var wrapper = document.createElement('div');
    wrapper.className = 'beftn-searchable';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    // Trigger button
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'beftn-searchable-trigger';
    trigger.setAttribute('data-no-confirm', '');
    trigger.innerHTML =
      '<span class="beftn-searchable-trigger-text is-placeholder">— Select —</span>' +
      '<i class="bi bi-chevron-down beftn-searchable-trigger-arrow" aria-hidden="true"></i>';
    wrapper.appendChild(trigger);

    // Dropdown panel
    var dropdown = document.createElement('div');
    dropdown.className = 'beftn-searchable-dropdown';
    dropdown.innerHTML =
      '<div class="beftn-searchable-search"><input type="text" placeholder="Search..." autocomplete="off"></div>' +
      '<div class="beftn-searchable-list"></div>';
    wrapper.appendChild(dropdown);

    var triggerText = trigger.querySelector('.beftn-searchable-trigger-text');
    var searchInput = dropdown.querySelector('input');
    var list = dropdown.querySelector('.beftn-searchable-list');

    // Build options
    var options = [];
    Array.from(select.options).forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'beftn-searchable-option';
      if (opt.value === '') btn.classList.add('is-placeholder-opt');
      btn.textContent = opt.textContent;
      btn.dataset.value = opt.value;
      if (opt.selected && opt.value !== '') {
        btn.classList.add('is-selected');
        triggerText.textContent = opt.textContent;
        triggerText.classList.remove('is-placeholder');
      }
      list.appendChild(btn);
      options.push({ el: btn, text: opt.textContent.toLowerCase(), value: opt.value });
    });

    function closeAll() {
      document.querySelectorAll('.beftn-searchable.is-open').forEach(function (w) {
        if (w !== wrapper) w.classList.remove('is-open');
      });
    }

    function openDropdown() {
      closeAll();
      wrapper.classList.add('is-open');
      searchInput.value = '';
      options.forEach(function (o) { o.el.classList.remove('is-hidden'); });
      setTimeout(function () { searchInput.focus(); }, 10);
    }

    function closeDropdown() {
      wrapper.classList.remove('is-open');
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (wrapper.classList.contains('is-open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Search filter
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.toLowerCase();
      var anyVisible = false;
      options.forEach(function (o) {
        var match = o.text.indexOf(q) !== -1;
        o.el.classList.toggle('is-hidden', !match);
        if (match) anyVisible = true;
      });
      var emptyMsg = list.querySelector('.beftn-searchable-empty');
      if (!anyVisible) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.className = 'beftn-searchable-empty';
          emptyMsg.textContent = 'No results found';
          list.appendChild(emptyMsg);
        }
      } else if (emptyMsg) {
        emptyMsg.remove();
      }
    });

    // Prevent dropdown close when typing
    searchInput.addEventListener('click', function (e) { e.stopPropagation(); });

    // Select option
    list.addEventListener('click', function (e) {
      var opt = e.target.closest('.beftn-searchable-option');
      if (!opt) return;
      var val = opt.dataset.value;
      select.value = val;
      options.forEach(function (o) { o.el.classList.remove('is-selected'); });
      opt.classList.add('is-selected');
      if (val === '') {
        triggerText.textContent = '— Select —';
        triggerText.classList.add('is-placeholder');
      } else {
        triggerText.textContent = opt.textContent;
        triggerText.classList.remove('is-placeholder');
      }
      closeDropdown();
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) closeDropdown();
    });
  }

  // Init all beftn-select elements
  document.querySelectorAll('.beftn-select').forEach(initSearchable);
})();
