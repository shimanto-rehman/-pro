/**
 * Confirmation modal for state-changing actions across RMS dashboard pages.
 * Skips passive actions: Search, Clear, Download, Export, Copy, Print, Load, Check, navigation.
 */
(function () {
  var SKIP_TEXT =
    /^(search|clear|download|export|copy|csv|print|load|check|filter|mark all read|view all|previous|next)$/i;
  var CONFIRM_TEXT =
    /release|process|retry|cancel|upload|save|generate|delete|update status|submit|authorize|confirm|refresh/i;

  var pendingCallback = null;
  var pendingBtn = null;
  var modalEl = null;
  var bsModal = null;
  var titleEl = null;
  var messageEl = null;
  var remarksWrap = null;
  var remarksInput = null;
  var confirmBtn = null;
  var iconEl = null;

  function initModal() {
    if (modalEl) return;

    var html =
      '<div class="modal fade rms-action-modal" id="rmsActionModal" tabindex="-1" aria-labelledby="rmsActionModalTitle" aria-hidden="true">' +
      '  <div class="modal-dialog modal-dialog-centered">' +
      '    <div class="modal-content">' +
      '      <div class="modal-header">' +
      '        <h5 class="modal-title" id="rmsActionModalTitle"><i class="bi bi-question-circle" aria-hidden="true"></i><span>Confirm action</span></h5>' +
      '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '      </div>' +
      '      <div class="modal-body" id="rmsActionModalBody">' +
      '        <p class="rms-action-modal-message" id="rmsActionModalMessage">Are you sure you want to continue?</p>' +
      '        <div class="rms-action-modal-remarks" id="rmsActionModalRemarks" hidden>' +
      '          <label class="rms-action-modal-remarks-label" for="rmsActionModalRemarksInput">Remarks</label>' +
      '          <input type="text" id="rmsActionModalRemarksInput" class="rms-action-modal-remarks-input" placeholder="Enter remarks">' +
      '        </div>' +
      '      </div>' +
      '      <div class="modal-footer">' +
      '        <button type="button" class="btn-rms-cancel" data-bs-dismiss="modal">Cancel</button>' +
      '        <button type="button" class="btn-rms-confirm" id="rmsActionModalConfirm">Confirm</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', html);
    modalEl = document.getElementById('rmsActionModal');
    titleEl = modalEl.querySelector('.modal-title span');
    messageEl = document.getElementById('rmsActionModalMessage');
    remarksWrap = document.getElementById('rmsActionModalRemarks');
    remarksInput = document.getElementById('rmsActionModalRemarksInput');
    confirmBtn = document.getElementById('rmsActionModalConfirm');
    iconEl = modalEl.querySelector('.modal-title i');

    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      bsModal = new bootstrap.Modal(modalEl);
    }

    confirmBtn.addEventListener('click', function () {
      if (pendingBtn && remarksWrap && !remarksWrap.hidden && remarksInput) {
        pendingBtn.dataset.actionRemarks = remarksInput.value.trim();
      }
      if (bsModal) {
        bsModal.hide();
      }
      if (typeof pendingCallback === 'function') {
        var fn = pendingCallback;
        pendingCallback = null;
        pendingBtn = null;
        fn();
      }
    });

    modalEl.addEventListener('hidden.bs.modal', function () {
      pendingCallback = null;
      pendingBtn = null;
      if (remarksWrap) remarksWrap.hidden = true;
      if (remarksInput) remarksInput.value = '';
    });
  }

  function getButtonLabel(btn) {
    var clone = btn.cloneNode(true);
    clone.querySelectorAll('i, svg').forEach(function (el) {
      el.remove();
    });
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  function isInActionScope(btn) {
    if (btn.closest('.dashboard-sidebar, .dashboard-header, .dropdown-menu')) {
      return false;
    }
    return !!btn.closest(
      '.beftn-module-page, .rms-txn-page, .dashboard-content, .cfg-page, .mf-page, .rpt-page'
    );
  }

  function shouldConfirm(btn) {
    if (!btn || btn.type === 'submit' || btn.disabled) {
      return false;
    }
    if (btn.hasAttribute('data-no-confirm') || btn.getAttribute('data-bs-dismiss') === 'modal') {
      return false;
    }
    if (btn.hasAttribute('data-action-confirm') || btn.classList.contains('cfg-btn-delete')) {
      return true;
    }
    if (!isInActionScope(btn)) {
      return false;
    }
    if (
      btn.classList.contains('nav-expand-btn') ||
      btn.classList.contains('sidebar-expand-toggle') ||
      btn.classList.contains('btn-hamburger') ||
      btn.classList.contains('btn-notification') ||
      btn.classList.contains('btn-quick-menu') ||
      btn.classList.contains('cfg-page-btn')
    ) {
      return false;
    }

    var label = getButtonLabel(btn);
    if (!label) {
      return btn.classList.contains('cfg-btn-delete');
    }
    if (SKIP_TEXT.test(label)) {
      return false;
    }
    if (btn.classList.contains('beftn-btn-accent')) {
      return true;
    }
    if (btn.classList.contains('cfg-btn-delete')) {
      return true;
    }
    if (CONFIRM_TEXT.test(label)) {
      return true;
    }
    if (
      (btn.classList.contains('beftn-btn-primary') || btn.classList.contains('rms-txn-btn-primary')) &&
      /upload|process|save|generate|submit/i.test(label)
    ) {
      return true;
    }
    if (btn.classList.contains('rms-txn-btn-accent')) {
      return true;
    }
    return false;
  }

  function isDestructive(label) {
    return /cancel|delete|remove|fail/i.test(label);
  }

  function openModal(btn, onConfirm) {
    initModal();
    if (!modalEl || !bsModal) {
      onConfirm();
      return;
    }

    var label = getButtonLabel(btn) || 'this action';
    var destructive = isDestructive(label) || btn.classList.contains('cfg-btn-delete');
    var askRemarks = btn.hasAttribute('data-ask-remarks');

    modalEl.classList.toggle('rms-action-modal--danger', destructive);
    iconEl.className = destructive
      ? 'bi bi-exclamation-triangle'
      : 'bi bi-check-circle';

    if (askRemarks && /^release$/i.test(label)) {
      titleEl.textContent = 'Release Confirmation';
    } else {
      titleEl.textContent = destructive ? 'Confirm ' + label : 'Confirm action';
    }

    messageEl.textContent =
      'Are you sure you want to "' +
      label +
      '"? This action may update transaction or configuration data.';
    confirmBtn.textContent = destructive ? label : 'Confirm';

    if (remarksWrap && remarksInput) {
      remarksWrap.hidden = !askRemarks;
      remarksInput.value = '';
    }

    pendingBtn = btn;
    pendingCallback = onConfirm;
    bsModal.show();

    if (askRemarks && remarksInput) {
      modalEl.addEventListener(
        'shown.bs.modal',
        function focusRemarks() {
          remarksInput.focus();
          modalEl.removeEventListener('shown.bs.modal', focusRemarks);
        },
        { once: true }
      );
    }
  }

  document.addEventListener(
    'click',
    function (event) {
      var btn = event.target.closest('button');
      if (!btn) return;

      if (btn.dataset.rmsConfirmed === '1') {
        delete btn.dataset.rmsConfirmed;
        if (!btn.hasAttribute('data-async-action')) {
          btn.dataset.rmsActionToast = '1';
        }
        return;
      }

      if (!shouldConfirm(btn)) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      openModal(btn, function () {
        btn.dataset.rmsConfirmed = '1';
        btn.click();
      });
    },
    true
  );
})();
