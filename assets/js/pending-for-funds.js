/**
 * Pending for Funds — generate results table from Party / Mode filters.
 */
(function () {
  var SAMPLE_ROWS = [
    {
      sender: 'John Carter',
      beneficiary: 'Karim Ahmed',
      account: '1501203456789',
      amount: '25,000.00',
      date: '2026-07-20',
      status: 'Pending for Funds'
    },
    {
      sender: 'Sarah Lee',
      beneficiary: 'Nusrat Jahan',
      account: '1501987654321',
      amount: '12,500.00',
      date: '2026-07-21',
      status: 'Pending for Funds'
    },
    {
      sender: 'Michael Brown',
      beneficiary: 'Rafiqul Islam',
      account: '2054789632145',
      amount: '48,750.00',
      date: '2026-07-22',
      status: 'Pending for Funds'
    },
    {
      sender: 'Emily Watson',
      beneficiary: 'Fatema Begum',
      account: '2054123654789',
      amount: '9,800.00',
      date: '2026-07-23',
      status: 'Pending for Funds'
    },
    {
      sender: 'David Kim',
      beneficiary: 'Shafiq Rahman',
      account: '1501654987321',
      amount: '33,200.00',
      date: '2026-07-24',
      status: 'Pending for Funds'
    }
  ];

  var PANEL_IDS = {
    principle: { party: 'pffPriParty', mode: 'pffPriMode' },
    incentive: { party: 'pffIncParty', mode: 'pffIncMode' }
  };

  function htmlEncode(value) {
    if (value === null || value === undefined) return '';
    var div = document.createElement('div');
    div.textContent = String(value);
    return div.innerHTML;
  }

  function renderRows(table, party, mode, typeLabel) {
    var tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    SAMPLE_ROWS.forEach(function (row, index) {
      var tr = document.createElement('tr');
      var pinPrefix = party === 'Moneygram' ? 'MG' : 'RM';
      var typeCode = typeLabel === 'Incentive' ? 'I' : 'P';
      var pin = pinPrefix + typeCode + '-' + String(980000 + index * 137).slice(-6);
      var cells = [
        party,
        mode,
        pin,
        row.sender,
        row.beneficiary,
        row.account,
        row.amount,
        row.date,
        row.status
      ];

      cells.forEach(function (value) {
        var td = document.createElement('td');
        td.innerHTML = htmlEncode(value);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  document.querySelectorAll('.pff-search-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panelName = btn.getAttribute('data-panel');
      var ids = PANEL_IDS[panelName];
      if (!ids) return;

      var panel = document.querySelector('.beftn-type-panel[data-beftn-panel="' + panelName + '"]');
      var partyEl = document.getElementById(ids.party);
      var modeEl = document.getElementById(ids.mode);
      if (!panel || !partyEl || !modeEl) return;

      var party = partyEl.value;
      var mode = modeEl.value;

      if (!party || !mode) {
        if (window.RmsToast) {
          RmsToast.error('Please select both Party and Mode.');
        }
        return;
      }

      var typeLabel = panelName === 'incentive' ? 'Incentive' : 'Principle';
      var resultsSub = panel.querySelector('.pff-results-sub');
      var table = panel.querySelector('.pff-results-table');
      if (!table) return;

      if (resultsSub) {
        resultsSub.textContent =
          'Pending for Funds results for ' + typeLabel + ' — ' + party + ' — ' + mode;
      }

      renderRows(table, party, mode, typeLabel);

      if (window.RmsToast) {
        RmsToast.success(typeLabel + ' Pending for Funds list generated successfully.');
      }
    });
  });
})();
