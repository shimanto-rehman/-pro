const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const reportLinks = [
  { href: 'reports-balance.html', text: 'Exchange House Balance', slug: 'balance' },
  { href: 'reports-principle.html', text: 'Principle & Incentive Report', slug: 'principle' },
  { href: 'reports-merge-statement.html', text: 'Merge Statement', slug: 'merge-statement' },
  { href: 'reports-remittance-certificate.html', text: 'Remittance Certificate', slug: 'remittance-certificate' },
  { href: 'reports-pending-transactions.html', text: 'Pending Transactions', slug: 'pending-transactions' },
  { href: 'reports-pending-for-funds.html', text: 'Pending for Funds', slug: 'pending-for-funds' },
];

const selectAll = '<option value="">— Select ALL —</option>';
const selectExHouse =
  '<option value="">— Select Ex House —</option><option>Western Union</option><option>MoneyGram</option><option>Ria Money Transfer</option>';

function renderReportsNav(activeSlug) {
  const linksHtml = reportLinks
    .map((link) => {
      const fileSlug = link.href.replace('reports-', '').replace('.html', '');
      const cls = fileSlug === activeSlug ? 'subnav-item active' : 'subnav-item';
      return `            <a href="${link.href}" class="${cls}">${link.text}</a>`;
    })
    .join('\n');

  return `          <!-- Reports & MIS -->
          <a href="#" class="nav-item nav-has-children active nav-open" data-subnav-id="nav-reports-mis-sub" aria-expanded="true">
            <i class="bi bi-bar-chart nav-item-icon" aria-hidden="true"></i>
            <span>Reports &amp; MIS</span>
            <button class="nav-expand-btn" type="button" aria-label="Toggle Reports and MIS sub menu"><i class="bi bi-chevron-right"></i></button>
          </a>
          <div class="sidebar-subnav subnav-open" id="nav-reports-mis-sub">
${linksHtml}
          </div>`;
}

function replaceReportsNav(html, activeSlug) {
  const re =
    /          <!-- Reports & MIS -->[\s\S]*?<div class="sidebar-subnav[^"]*" id="nav-reports-mis-sub">[\s\S]*?<\/div>/;
  return html.replace(re, renderReportsNav(activeSlug));
}

function deactivateOtherNav(html) {
  return html
    .replace(/class="nav-item nav-has-children active nav-open"/g, 'class="nav-item nav-has-children"')
    .replace(/class="sidebar-subnav subnav-open"/g, 'class="sidebar-subnav"')
    .replace(/(<a href="[^"]*\.html" class="subnav-item) active"/g, '$1"')
    .replace(/ aria-expanded="true"/g, '');
}

function tableEmpty(colspan, msg) {
  return `<tr><td colspan="${colspan}"><div class="beftn-empty"><i class="bi bi-inbox" aria-hidden="true"></i>${msg}</div></td></tr>`;
}

function buildPrincipleIncentiveFilters(prefix) {
  const payStatus = `${selectAll}<option>Released</option><option>Pending</option><option>Failed</option>`;
  return `
            <section class="beftn-module-card">
              <div class="beftn-filter-grid">
                <div class="beftn-field">
                  <label class="beftn-label-block" for="rpt${prefix}From">From Date</label>
                  <input type="date" id="rpt${prefix}From" class="beftn-input">
                </div>
                <div class="beftn-field">
                  <label class="beftn-label-block" for="rpt${prefix}To">To Date</label>
                  <input type="date" id="rpt${prefix}To" class="beftn-input">
                </div>
                <div class="beftn-field">
                  <label class="beftn-label-block" for="rpt${prefix}ExHouse">EX House</label>
                  <select id="rpt${prefix}ExHouse" class="beftn-select">${selectExHouse}</select>
                </div>
                <div class="beftn-field">
                  <label class="beftn-label-block" for="rpt${prefix}PayStatus">Payment Status</label>
                  <select id="rpt${prefix}PayStatus" class="beftn-select">${payStatus}</select>
                </div>
              </div>
              <div class="beftn-module-actions beftn-module-actions--center">
                <button type="button" class="beftn-btn beftn-btn-primary" data-no-confirm><i class="bi bi-download" aria-hidden="true"></i> Download</button>
                <button type="button" class="beftn-btn beftn-btn-outline" data-no-confirm data-rpt-clear><i class="bi bi-x-circle" aria-hidden="true"></i> Clear</button>
              </div>
            </section>`;
}

function buildPrincipleIncentiveReport() {
  return `
        <div class="beftn-module-page rpt-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Reports &amp; MIS <i class="bi bi-chevron-right" aria-hidden="true"></i> Principle &amp; Incentive Report</p>
            </div>
          </header>

          <div class="beftn-type-nav-wrap">
            <p class="beftn-type-nav-label">Select transaction type</p>
            <nav class="beftn-type-nav" aria-label="Transaction type">
              <button type="button" class="beftn-type-nav-btn is-active" data-beftn-type="principle" aria-selected="true">Principle</button>
              <button type="button" class="beftn-type-nav-btn" data-beftn-type="incentive" aria-selected="false">Incentive</button>
            </nav>
          </div>

          <div class="beftn-type-panel" data-beftn-panel="principle">
${buildPrincipleIncentiveFilters('Pri')}
          </div>

          <div class="beftn-type-panel" data-beftn-panel="incentive" hidden>
${buildPrincipleIncentiveFilters('Inc')}
          </div>
        </div>`;
}

function buildMergeStatement() {
  return `
        <div class="beftn-module-page rpt-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Reports &amp; MIS <i class="bi bi-chevron-right" aria-hidden="true"></i> Merge Statement</p>
              <h1 class="beftn-module-title">Merge Statement</h1>
              <p class="beftn-module-desc">Generate a merged account statement for two accounts over a date range.</p>
            </div>
          </header>

          <section class="beftn-module-card">
            <div class="rpt-filter-grid rpt-filter-grid--two-col">
              <div class="rpt-account-row">
                <div class="rpt-inline-field">
                  <label class="beftn-label-block" for="rptMergeAcct1">Account No 1</label>
                  <input type="text" id="rptMergeAcct1" class="beftn-input" placeholder="Enter account number">
                </div>
                <button type="button" class="beftn-btn beftn-btn-outline" data-no-confirm><i class="bi bi-check2" aria-hidden="true"></i> Check</button>
              </div>
              <div class="rpt-account-row">
                <div class="rpt-inline-field">
                  <label class="beftn-label-block" for="rptMergeAcct2">Account No 2</label>
                  <input type="text" id="rptMergeAcct2" class="beftn-input" placeholder="Enter account number">
                </div>
                <button type="button" class="beftn-btn beftn-btn-outline" data-no-confirm><i class="bi bi-check2" aria-hidden="true"></i> Check</button>
              </div>
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="rptMergeFrom">From Date</label>
                <input type="date" id="rptMergeFrom" class="beftn-input">
              </div>
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="rptMergeTo">To Date</label>
                <input type="date" id="rptMergeTo" class="beftn-input">
              </div>
            </div>
            <div class="beftn-module-actions beftn-module-actions--center">
              <button type="button" class="beftn-btn beftn-btn-primary"><i class="bi bi-file-earmark-text" aria-hidden="true"></i> Generate</button>
            </div>
          </section>
        </div>`;
}

function buildRemittanceCertificate() {
  return `
        <div class="beftn-module-page rpt-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Reports &amp; MIS <i class="bi bi-chevron-right" aria-hidden="true"></i> Remittance Certificate</p>
              <h1 class="beftn-module-title">Remittance Certificate</h1>
              <p class="beftn-module-desc">Generate remittance certificates by payment type, report type, and date range.</p>
            </div>
          </header>

          <section class="beftn-module-card">
            <div class="rpt-cert-grid">
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="rptCertPayType">Payment Type</label>
                <select id="rptCertPayType" class="beftn-select">
                  <option>Other Bank</option>
                  <option>MTB Account</option>
                  <option>Wallet</option>
                </select>
              </div>
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="rptCertReportType">Report Type</label>
                <select id="rptCertReportType" class="beftn-select">
                  <option>Certificate</option>
                  <option>Statement</option>
                </select>
              </div>
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="rptCertFrom">From Date</label>
                <input type="date" id="rptCertFrom" class="beftn-input">
              </div>
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="rptCertTo">To Date</label>
                <input type="date" id="rptCertTo" class="beftn-input">
              </div>
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="rptCertAcct">Account / Mobile No</label>
                <input type="text" id="rptCertAcct" class="beftn-input" placeholder="Account or mobile number">
              </div>
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="rptCertRef">Certificate Ref No</label>
                <input type="text" id="rptCertRef" class="beftn-input" placeholder="Certificate reference">
              </div>
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="rptCertRemitType">Remittance Type</label>
                <select id="rptCertRemitType" class="beftn-select">
                  <option>Wage</option>
                  <option>Principle</option>
                  <option>Incentive</option>
                </select>
              </div>
            </div>
            <div class="beftn-module-actions beftn-module-actions--end" style="justify-content: flex-end;">
              <button type="button" class="beftn-btn beftn-btn-primary"><i class="bi bi-file-earmark-pdf" aria-hidden="true"></i> Generate</button>
            </div>
          </section>
        </div>`;
}

function buildBalancePage() {
  const rows = [
    {
      id: 1007,
      user: 'm-f-e',
      entity: 'AL ANSARI EXCHANGE',
      mtbAcct: '0062112000003587',
      mtbBal: '125,430.50',
      holdAcct: '0062112000003590',
      holdBal: '12,500.00',
      acuAcct: 'ACU-1007-01',
      acuBal: '98,200.00',
      specialAcct: 'SP-1007',
      specialBal: '5,000.00',
      marginAcct: 'MRG-1007',
      updated: '2026-06-02 09:15:22',
    },
    {
      id: 1008,
      user: 'ln-f-e',
      entity: 'WALL STREET EXCHANGE',
      mtbAcct: '0062112000004102',
      mtbBal: '89,120.75',
      holdAcct: '0',
      holdBal: '0',
      acuAcct: 'ACU-1008-01',
      acuBal: '76,400.00',
      specialAcct: 'SP-1008',
      specialBal: '2,150.00',
      marginAcct: 'MRG-1008',
      updated: '2026-06-02 09:12:08',
    },
    {
      id: 1009,
      user: 'wise-eh',
      entity: 'WISE PAYMENTS LTD.',
      mtbAcct: '0062112000005123',
      mtbBal: '2,571,185.12',
      holdAcct: '0062112000005124',
      holdBal: '64,474.12',
      acuAcct: 'ACU-1009-01',
      acuBal: '2,506,711.00',
      specialAcct: '0',
      specialBal: '0',
      marginAcct: 'MRG-1009',
      updated: '2026-06-02 09:10:45',
    },
  ];

  const tbody = rows
    .map(
      (r) => `
                    <tr>
                      <td>${r.id}</td>
                      <td>${r.user}</td>
                      <td>${r.entity}</td>
                      <td>${r.mtbAcct}</td>
                      <td class="bal-num">${r.mtbBal}</td>
                      <td>${r.holdAcct}</td>
                      <td class="bal-num">${r.holdBal}</td>
                      <td>${r.acuAcct}</td>
                      <td class="bal-num">${r.acuBal}</td>
                      <td>${r.specialAcct}</td>
                      <td class="bal-num">${r.specialBal}</td>
                      <td>${r.marginAcct}</td>
                      <td>${r.updated}</td>
                    </tr>`
    )
    .join('');

  return `
        <div class="beftn-module-page rpt-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Reports &amp; MIS <i class="bi bi-chevron-right" aria-hidden="true"></i> Exchange House Balance</p>
              <h1 class="beftn-module-title">Exchange House Balance</h1>
              <p class="beftn-module-desc">View MTB, exchange house, and margin balances by partner and account.</p>
            </div>
          </header>

          <div class="beftn-module-actions" style="margin-bottom: 1rem;">
            <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Refresh</button>
          </div>

          <section class="beftn-module-card bal-summary-card">
            <div class="beftn-module-card-head">
              <h2 class="beftn-module-card-title">Balance summary</h2>
            </div>
            <div class="bal-summary-rows">
              <div class="bal-summary-row">
                <span class="bal-summary-label">MTB Balance</span>
                <span class="bal-summary-value">2,571,185.12</span>
              </div>
              <div class="bal-summary-row">
                <span class="bal-summary-label">Exchange House Balance</span>
                <span class="bal-summary-value">2,506,711.00</span>
              </div>
              <div class="bal-summary-row">
                <span class="bal-summary-label">Margin Balance</span>
                <span class="bal-summary-value">64,474.12</span>
              </div>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="bal-table-toolbar">
              <div class="bal-table-toolbar-left">
                <div class="bal-entries-select">
                  <label for="balEntries">Show</label>
                  <select id="balEntries" class="beftn-select">
                    <option>10</option>
                    <option selected>25</option>
                    <option>50</option>
                    <option>80</option>
                  </select>
                  <span>entries</span>
                </div>
                <button type="button" class="beftn-btn beftn-btn-primary" data-no-confirm><i class="bi bi-download" aria-hidden="true"></i> Download</button>
              </div>
              <div class="cfg-table-search">
                <label for="balSearch">Search</label>
                <input type="search" id="balSearch" class="beftn-input" placeholder="Filter partners…" aria-label="Search balance table">
              </div>
            </div>
            <div class="beftn-table-wrap">
              <table class="beftn-table">
                <thead>
                  <tr>
                    <th>Partner ID</th>
                    <th>User ID</th>
                    <th>Entity Name</th>
                    <th>MTB Account</th>
                    <th>MTB Balance</th>
                    <th>MTB Hold A/C</th>
                    <th>MTB Hold Balance</th>
                    <th>ACU Account</th>
                    <th>ACU Balance</th>
                    <th>Special Account</th>
                    <th>Special Balance</th>
                    <th>Margin Account</th>
                    <th>Update Time</th>
                  </tr>
                </thead>
                <tbody>${tbody}
                </tbody>
              </table>
            </div>
            <div class="cfg-pagination" style="margin-top: 1rem;">
              <span class="cfg-pagination-info">Showing 1 to 80 of 80 entries</span>
              <div class="cfg-pagination-nav" aria-label="Balance table pagination">
                <button type="button" class="cfg-page-btn" disabled>Previous</button>
                <button type="button" class="cfg-page-btn is-active">1</button>
                <button type="button" class="cfg-page-btn">2</button>
                <button type="button" class="cfg-page-btn">Next</button>
              </div>
            </div>
          </section>
        </div>`;
}

const pages = [
  {
    slug: 'balance',
    file: 'reports-balance.html',
    dataPage: 'reports-balance',
    title: 'Exchange House Balance - RMS',
    content: buildBalancePage,
  },
  {
    slug: 'principle',
    file: 'reports-principle.html',
    dataPage: 'reports-principle',
    title: 'Principle & Incentive Report - RMS',
    content: buildPrincipleIncentiveReport,
  },
  {
    slug: 'merge-statement',
    file: 'reports-merge-statement.html',
    dataPage: 'reports-merge-statement',
    title: 'Merge Statement - RMS',
    content: buildMergeStatement,
  },
  {
    slug: 'remittance-certificate',
    file: 'reports-remittance-certificate.html',
    dataPage: 'reports-remittance-certificate',
    title: 'Remittance Certificate - RMS',
    content: buildRemittanceCertificate,
  },
];

const shellPath = path.join(root, 'config-freelancer-account.html');
let shell = fs.readFileSync(shellPath, 'utf8');

const configNavInactive = `          <!-- Configurations -->
          <a href="#" class="nav-item nav-has-children" data-subnav-id="nav-configurations-sub">
            <i class="bi bi-gear nav-item-icon" aria-hidden="true"></i>
            <span>Configurations</span>
            <button class="nav-expand-btn" type="button" aria-label="Toggle Configurations sub menu"><i class="bi bi-chevron-right"></i></button>
          </a>
          <div class="sidebar-subnav" id="nav-configurations-sub">
            <a href="config-freelancer-account.html" class="subnav-item">Freelancer Account</a>
            <a href="config-foreigner-account.html" class="subnav-item">Foreigner Account</a>
            <a href="config-company-account.html" class="subnav-item">Company Account</a>
            <a href="config-freelancer-keyword.html" class="subnav-item">Freelancer Keyword</a>
            <a href="config-foreigner-keyword.html" class="subnav-item">Foreigner Keyword</a>
            <a href="config-company-keyword.html" class="subnav-item">Company Keyword</a>
          </div>`;

for (const page of pages) {
  let html = shell;

  html = html.replace(/<title>[^<]+<\/title>/, `<title>${page.title}</title>`);
  html = html.replace(/data-page="[^"]+"/, `data-page="${page.dataPage}"`);
  html = html.replace(
    /<link rel="stylesheet" href="assets\/css\/configuration\.css" \/>/,
    '<link rel="stylesheet" href="assets/css/configuration.css" />\n    <link rel="stylesheet" href="assets/css/reports.css" />\n    <link rel="stylesheet" href="assets/css/action-modal.css" />'
  );

  html = deactivateOtherNav(html);
  html = replaceReportsNav(html, page.slug);
  html = html.replace(
    /          <!-- Configurations -->[\s\S]*?<div class="sidebar-subnav[^"]*" id="nav-configurations-sub">[\s\S]*?<\/div>/,
    configNavInactive
  );

  const contentRe = /\s*<div class="beftn-module-page[^"]*">[\s\S]*?<\/div>\s*\n\s*<\/main>/;
  html = html.replace(contentRe, `\n${page.content()}\n\n      </main>`);

  if (!html.includes('action-modal.js')) {
    html = html.replace(
      /<script src="assets\/js\/main\.js"><\/script>/,
      '<script src="assets/js/main.js"></script>\n    <script src="assets/js/action-modal.js"></script>'
    );
  }

  if (page.slug === 'principle' && !html.includes('beftn-page.js')) {
    html = html.replace(
      /<script src="assets\/js\/action-modal\.js"><\/script>/,
      '<script src="assets/js/action-modal.js"></script>\n    <script src="assets/js/beftn-page.js"></script>'
    );
  }

  fs.writeFileSync(path.join(root, page.file), html, 'utf8');
  console.log('Wrote', page.file);
}
