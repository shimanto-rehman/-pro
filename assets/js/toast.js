/**
 * RMS toast notifications — success (green) and error (red) feedback for actions.
 */
(function () {
  var stackEl = null;
  var DEFAULT_DURATION = 4500;

  function ensureStack() {
    if (stackEl) return stackEl;
    stackEl = document.createElement('div');
    stackEl.className = 'rms-toast-stack';
    stackEl.setAttribute('aria-live', 'polite');
    stackEl.setAttribute('aria-atomic', 'false');
    document.body.appendChild(stackEl);
    return stackEl;
  }

  function normalizeMessage(message) {
    if (message === null || message === undefined) return '';
    if (typeof message === 'object') {
      return (
        message.message ||
        message.error ||
        message.statusText ||
        message.title ||
        JSON.stringify(message)
      );
    }
    return String(message).trim();
  }

  function show(type, message, options) {
    options = options || {};
    var text = normalizeMessage(message);
    if (!text) {
      text = type === 'success' ? 'Operation completed successfully.' : 'An error occurred.';
    }

    var stack = ensureStack();
    var toast = document.createElement('div');
    toast.className = 'rms-toast rms-toast--' + type;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    var iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill';
    var title = type === 'success' ? 'Success' : 'Error';

    toast.innerHTML =
      '<i class="bi ' + iconClass + ' rms-toast-icon" aria-hidden="true"></i>' +
      '<div class="rms-toast-body">' +
      '  <p class="rms-toast-title">' + title + '</p>' +
      '  <p class="rms-toast-message"></p>' +
      '</div>' +
      '<button type="button" class="rms-toast-close" aria-label="Dismiss"><i class="bi bi-x-lg" aria-hidden="true"></i></button>';

    toast.querySelector('.rms-toast-message').textContent = text;
    stack.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });

    function removeToast() {
      if (!toast.parentNode) return;
      toast.classList.remove('is-visible');
      toast.classList.add('is-leaving');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    }

    toast.querySelector('.rms-toast-close').addEventListener('click', removeToast);
    setTimeout(removeToast, options.duration || DEFAULT_DURATION);

    return toast;
  }

  function success(message, options) {
    return show('success', message, options);
  }

  function error(message, options) {
    return show('error', message, options);
  }

  function handleResult(result, successMessage) {
    if (result && result.success) {
      success(successMessage || result.message || 'Operation completed successfully.');
      return true;
    }
    error((result && result.message) || 'Operation failed.');
    return false;
  }

  function getButtonLabel(btn) {
    var clone = btn.cloneNode(true);
    clone.querySelectorAll('i, svg').forEach(function (el) {
      el.remove();
    });
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  function isPassiveActionLabel(label) {
    return /^(search|clear|download|export|copy|csv|print|load|check|filter|mark all read|view all|previous|next)$/i.test(
      label
    );
  }

  function isInActionScope(btn) {
    if (btn.closest('.dashboard-sidebar, .dashboard-header, .dropdown-menu')) {
      return false;
    }
    return !!btn.closest(
      '.beftn-module-page, .rms-txn-page, .dashboard-content, .cfg-page, .mf-page, .rpt-page, .ptxn-page'
    );
  }

  function shouldToastPassiveAction(btn) {
    if (!btn || btn.disabled || btn.hasAttribute('data-no-toast')) return false;
    if (!isInActionScope(btn)) return false;
    var label = getButtonLabel(btn);
    if (!label || isPassiveActionLabel(label)) return false;
    if (btn.hasAttribute('data-action-confirm') || btn.classList.contains('cfg-btn-delete')) {
      return true;
    }
    if (btn.classList.contains('beftn-btn-accent') || btn.classList.contains('rms-txn-btn-accent')) {
      return true;
    }
    if (
      (btn.classList.contains('beftn-btn-primary') || btn.classList.contains('rms-txn-btn-primary')) &&
      /upload|process|save|generate|submit/i.test(label)
    ) {
      return true;
    }
    return /release|process|retry|cancel|upload|save|generate|delete|update status|submit|authorize|confirm|refresh/i.test(
      label
    );
  }

  function patchFetch() {
    if (!window.fetch || window.fetch.__rmsToastPatched) return;
    var originalFetch = window.fetch.bind(window);

    window.fetch = function () {
      return originalFetch.apply(window, arguments).then(function (response) {
        var clone = response.clone();
        var contentType = (response.headers.get('content-type') || '').toLowerCase();

        if (contentType.indexOf('application/json') !== -1) {
          return clone
            .json()
            .then(function (data) {
              if (data && typeof data.success === 'boolean') {
                if (data.success) {
                  if (data.message) success(data.message);
                } else {
                  error(data.message || response.statusText || 'Request failed.');
                }
              } else if (!response.ok) {
                error((data && data.message) || response.statusText || 'Request failed.');
              }
              return response;
            })
            .catch(function () {
              if (!response.ok) {
                error(response.statusText || 'Request failed.');
              }
              return response;
            });
        }

        if (!response.ok) {
          error(response.statusText || 'Request failed.');
        }
        return response;
      });
    };

    window.fetch.__rmsToastPatched = true;
  }

  window.RmsToast = {
    show: show,
    success: success,
    error: error,
    handleResult: handleResult
  };

  document.addEventListener('rms:action-success', function (event) {
    var detail = event.detail || {};
    success(detail.message || 'Operation completed successfully.');
  });

  document.addEventListener('rms:action-error', function (event) {
    var detail = event.detail || {};
    error(detail.message || 'Operation failed.');
  });

  document.addEventListener(
    'click',
    function (event) {
      var btn = event.target.closest('button');
      if (!btn || btn.hasAttribute('data-async-action')) return;

      if (btn.dataset.rmsActionToast === '1') {
        delete btn.dataset.rmsActionToast;
        if (!btn.hasAttribute('data-no-toast') && shouldToastPassiveAction(btn)) {
          var label = getButtonLabel(btn);
          success(label + ' completed successfully.');
        }
        return;
      }

      if (btn.hasAttribute('data-no-confirm') && shouldToastPassiveAction(btn)) {
        btn.dataset.rmsActionToast = '1';
      }
    },
    true
  );

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchFetch);
  } else {
    patchFetch();
  }
})();
