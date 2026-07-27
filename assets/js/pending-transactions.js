/**
 * Pending Transactions — table rendering, pagination, and API loading.
 */
(function () {
  var tableStates = {};
  var btnMain = document.getElementById('btnMain');
  var btnIncentive = document.getElementById('btnIncentive');

  if (!btnMain || !btnIncentive) return;

  var API_BASE = '/NRBTransaction/Report/GetPendingList';

  var TABLE_CONFIG = {
    dtMTBPendingList: {
      totalEl: 'grandTotal',
      totalColumnIndex: 5,
      modes: {
        main: { modeName: 'MTB', modeLabel: 'MTB' },
        incentive: { modeName: 'MTBIncentive', modeLabel: 'MTB Incentive' }
      },
      columns: [
        { data: null, defaultContent: '' },
        { data: 'procesS_DATE' },
        { data: 'partyid' },
        { data: 'rsD_STATUS_DESC_EXTERNAL' },
        { data: 'rsD_STATUS_DESC_INTERNAL' },
        { data: 'totaL_COUNT' }
      ]
    },
    dtBEFTNPendingList: {
      totalEl: 'grandTotalBEFTN',
      totalColumnIndex: 5,
      modes: {
        main: { modeName: 'BEFTN', modeLabel: 'BEFTN' },
        incentive: { modeName: 'BEFTNIncentive', modeLabel: 'BEFTN Incentive' }
      },
      columns: [
        { data: null, defaultContent: '' },
        { data: 'procesS_DATE' },
        { data: 'partyid' },
        { data: 'rsD_STATUS_DESC_EXTERNAL' },
        { data: 'rsD_STATUS_DESC_INTERNAL' },
        { data: 'totaL_COUNT' }
      ]
    },
    dtNPSBPendingList: {
      totalEl: 'grandTotalNPSB',
      totalColumnIndex: 5,
      modes: {
        main: { modeName: 'NPSB', modeLabel: 'NPSB' },
        incentive: { modeName: 'NPSBIncentive', modeLabel: 'NPSB Incentive' }
      },
      columns: [
        { data: null, defaultContent: '' },
        { data: 'procesS_DATE' },
        { data: 'partyid' },
        { data: 'rsD_STATUS_DESC_EXTERNAL' },
        { data: 'rsD_STATUS_DESC_INTERNAL' },
        { data: 'totaL_COUNT' }
      ]
    },
    dtWALLETPendingList: {
      totalEl: 'grandTotalWallet',
      totalColumnIndex: 6,
      modes: {
        main: { modeName: 'WALLET', modeLabel: 'Wallet' },
        incentive: { modeName: 'WALLETIncentive', modeLabel: 'WALLET Incentive' }
      },
      columns: [
        { data: null, defaultContent: '' },
        { data: 'procesS_DATE' },
        { data: 'partyid' },
        { data: 'wT_WALLET_PARTNER_ID' },
        { data: 'rsD_STATUS_DESC_EXTERNAL' },
        { data: 'rsD_STATUS_DESC_INTERNAL' },
        { data: 'totaL_COUNT' }
      ]
    }
  };

  function htmlEncode(value) {
    if (value === null || value === undefined) return '';
    var div = document.createElement('div');
    div.textContent = String(value);
    return div.innerHTML;
  }

  function getPagerId(tableId) {
    return tableId + '_customPager';
  }

  function buildPagination(table, state) {
    var totalPages = Math.ceil(state.data.length / state.pageLength) || 0;
    var current = state.currentPage;
    var startRecord = state.data.length === 0 ? 0 : (current - 1) * state.pageLength + 1;
    var endRecord = Math.min(current * state.pageLength, state.data.length);
    var pagerId = getPagerId(table.id);
    var pager = document.getElementById(pagerId);

    if (!pager) {
      pager = document.createElement('div');
      pager.id = pagerId;
      pager.className = 'ptxn-pagination';
      var wrap = table.closest('.beftn-table-wrap');
      if (wrap) wrap.insertAdjacentElement('afterend', pager);
    }

    var html = '<div class="ptxn-page-info">Showing ' + startRecord + ' - ' + endRecord + ' of ' + state.data.length + '</div>';
    html += '<div class="ptxn-page-buttons">';
    html += '<button type="button" class="ptxn-page-btn ptxn-prev" data-no-confirm' + (current <= 1 ? ' disabled' : '') + '>Previous</button>';

    var startPage = Math.max(1, current - 2);
    var endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    if (startPage > 1) {
      html += '<button type="button" class="ptxn-page-btn ptxn-number" data-page="1" data-no-confirm>1</button>';
      if (startPage > 2) html += '<span class="ptxn-ellipsis">...</span>';
    }

    for (var i = startPage; i <= endPage; i++) {
      html += '<button type="button" class="ptxn-page-btn ptxn-number' + (i === current ? ' is-active' : '') + '" data-page="' + i + '" data-no-confirm>' + i + '</button>';
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += '<span class="ptxn-ellipsis">...</span>';
      html += '<button type="button" class="ptxn-page-btn ptxn-number" data-page="' + totalPages + '" data-no-confirm>' + totalPages + '</button>';
    }

    html += '<button type="button" class="ptxn-page-btn ptxn-next" data-no-confirm' + (current >= totalPages || totalPages === 0 ? ' disabled' : '') + '>Next</button>';
    html += '</div>';

    pager.innerHTML = html;
  }

  function sumColumnValues(state, columnIndex) {
    return state.data.reduce(function (acc, row) {
      var col = state.columns[columnIndex];
      if (!col || col.data === null) return acc;
      return acc + (Number(row[col.data]) || 0);
    }, 0);
  }

  function updateTotal(tableId, state) {
    var config = TABLE_CONFIG[tableId];
    if (!config) return;

    var total = sumColumnValues(state, config.totalColumnIndex);
    var totalEl = document.getElementById(config.totalEl);
    if (totalEl) totalEl.textContent = total;
  }

  function renderTable(table, state) {
    var tbody = table.querySelector('tbody');
    var colSpan = table.querySelectorAll('thead th').length;
    tbody.innerHTML = '';

    if (!state.data || state.data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="' + colSpan + '"><div class="beftn-empty"><i class="bi bi-inbox" aria-hidden="true"></i>No Data Found</div></td></tr>';
      buildPagination(table, state);
      updateTotal(table.id, state);
      return;
    }

    var start = (state.currentPage - 1) * state.pageLength;
    var end = Math.min(start + state.pageLength, state.data.length);

    for (var r = start; r < end; r++) {
      var row = state.data[r];
      var tr = document.createElement('tr');

      state.columns.forEach(function (col) {
        var td = document.createElement('td');
        var value = col.data === null ? col.defaultContent || '' : row[col.data];
        td.innerHTML = htmlEncode(value);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    }

    buildPagination(table, state);
    updateTotal(table.id, state);
  }

  function destroyTable(tableId) {
    var table = document.getElementById(tableId);
    if (!table) return;

    tableStates[tableId] = null;
    var colSpan = table.querySelectorAll('thead th').length;
    table.querySelector('tbody').innerHTML =
      '<tr><td colspan="' + colSpan + '"><div class="beftn-empty"><i class="bi bi-inbox" aria-hidden="true"></i>No Data Found</div></td></tr>';

    var pager = document.getElementById(getPagerId(tableId));
    if (pager) pager.remove();

    var config = TABLE_CONFIG[tableId];
    if (config) {
      var totalEl = document.getElementById(config.totalEl);
      if (totalEl) totalEl.textContent = '0';
    }
  }

  document.querySelector('.ptxn-page').addEventListener('click', function (event) {
    var btn = event.target.closest('.ptxn-page-btn');
    if (!btn || btn.disabled) return;

    var pager = btn.closest('.ptxn-pagination');
    if (!pager) return;

    var tableId = pager.id.replace('_customPager', '');
    var state = tableStates[tableId];
    var table = document.getElementById(tableId);
    if (!state || !table) return;

    if (btn.classList.contains('ptxn-number')) {
      state.currentPage = parseInt(btn.getAttribute('data-page'), 10);
    } else if (btn.classList.contains('ptxn-prev') && state.currentPage > 1) {
      state.currentPage--;
    } else if (btn.classList.contains('ptxn-next')) {
      var totalPages = Math.ceil(state.data.length / state.pageLength);
      if (state.currentPage < totalPages) state.currentPage++;
    } else {
      return;
    }

    renderTable(table, state);
  });

  function initTable(tableId, data, columns, modeLabel) {
    var table = document.getElementById(tableId);
    if (!table) return;

    var columnsWithMode = columns.map(function (col, index) {
      if (index === 0 && col.data === null) {
        return { data: null, defaultContent: modeLabel };
      }
      return col;
    });

    var state = {
      data: data || [],
      columns: columnsWithMode,
      pageLength: 5,
      currentPage: 1
    };

    tableStates[tableId] = state;
    renderTable(table, state);
  }

  function fetchPendingList(tableId, modeName, modeLabel) {
    var config = TABLE_CONFIG[tableId];
    if (!config) return Promise.resolve();

    return fetch(API_BASE + '?modeName=' + encodeURIComponent(modeName), {
      method: 'GET',
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        destroyTable(tableId);
        if (result && result.success) {
          initTable(tableId, result.data, config.columns, modeLabel);
        }
      })
      .catch(function (err) {
        destroyTable(tableId);
        if (window.RmsToast) {
          RmsToast.error(err.message || 'Unable to load pending list.');
        }
      });
  }

  function loadMain() {
    setActiveType('main');
    return Promise.all([
      fetchPendingList('dtMTBPendingList', 'MTB', 'MTB'),
      fetchPendingList('dtBEFTNPendingList', 'BEFTN', 'BEFTN'),
      fetchPendingList('dtNPSBPendingList', 'NPSB', 'NPSB'),
      fetchPendingList('dtWALLETPendingList', 'WALLET', 'Wallet')
    ]);
  }

  function loadIncentive() {
    setActiveType('incentive');
    return Promise.all([
      fetchPendingList('dtMTBPendingList', 'MTBIncentive', 'MTB Incentive'),
      fetchPendingList('dtBEFTNPendingList', 'BEFTNIncentive', 'BEFTN Incentive'),
      fetchPendingList('dtNPSBPendingList', 'NPSBIncentive', 'NPSB Incentive'),
      fetchPendingList('dtWALLETPendingList', 'WALLETIncentive', 'WALLET Incentive')
    ]);
  }

  function setActiveType(type) {
    btnMain.classList.toggle('is-active', type === 'main');
    btnIncentive.classList.toggle('is-active', type === 'incentive');
    btnMain.setAttribute('aria-selected', type === 'main' ? 'true' : 'false');
    btnIncentive.setAttribute('aria-selected', type === 'incentive' ? 'true' : 'false');
  }

  btnMain.addEventListener('click', function (event) {
    event.preventDefault();
    loadMain();
  });

  btnIncentive.addEventListener('click', function (event) {
    event.preventDefault();
    loadIncentive();
  });

  loadMain();
})();
