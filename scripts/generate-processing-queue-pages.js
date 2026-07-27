const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const modules = [
  { key: 'beftn', label: 'BEFTN', navId: 'nav-beftn-sub', icon: 'bi-bank', queueFile: 'beftn-processing-queue.html' },
  { key: 'npsb', label: 'NPSB', navId: 'nav-npsb-sub', icon: 'bi-credit-card', queueFile: 'npsb-processing-queue.html' },
  {
    key: 'mtb-transfer',
    label: 'MTB A/C Transfer',
    navId: 'nav-mtb-transfer-sub',
    icon: 'bi-wallet2',
    queueFile: 'mtb-transfer-processing-queue.html',
  },
  { key: 'wallet', label: 'Wallet', navId: 'nav-wallet-sub', icon: 'bi-phone', queueFile: 'wallet-processing-queue.html' },
];

const moduleSubnavLinks = {
  beftn: [
    { href: 'beftn-processing-queue.html', text: 'Processing Queue', slug: 'processing-queue' },
    { href: 'beftn-failed-release.html', text: 'Failed Release', slug: 'failed-release' },
    { href: 'beftn-callback-retry.html', text: 'Callback Retry', slug: 'callback-retry' },
    { href: 'beftn-cancellation.html', text: 'Cancellation', slug: 'cancellation' },
    { href: 'beftn-status-change.html', text: 'Status Change', slug: 'status-change' },
  ],
  npsb: [
    { href: 'npsb-processing-queue.html', text: 'Processing Queue', slug: 'processing-queue' },
    { href: 'npsb-failed-release.html', text: 'Failed Release', slug: 'failed-release' },
    { href: 'npsb-callback-retry.html', text: 'Callback Retry', slug: 'callback-retry' },
    { href: 'npsb-cancellation.html', text: 'Cancellation', slug: 'cancellation' },
    { href: 'npsb-status-change.html', text: 'Status Change', slug: 'status-change' },
  ],
  'mtb-transfer': [
    { href: 'mtb-transfer-processing-queue.html', text: 'Processing Queue', slug: 'processing-queue' },
    { href: 'mtb-transfer-failed-release.html', text: 'Failed Release', slug: 'failed-release' },
    { href: 'mtb-transfer-callback-retry.html', text: 'Callback Retry', slug: 'callback-retry' },
    { href: 'mtb-transfer-cancellation.html', text: 'Cancellation', slug: 'cancellation' },
    { href: 'mtb-transfer-status-change.html', text: 'Status Change', slug: 'status-change' },
  ],
  wallet: [
    { href: 'wallet-processing-queue.html', text: 'Processing Queue', slug: 'processing-queue' },
    { href: 'wallet-failed-release.html', text: 'Failed Release', slug: 'failed-release' },
    { href: 'wallet-callback-retry.html', text: 'Callback Retry', slug: 'callback-retry' },
    { href: 'wallet-cancellation.html', text: 'Cancellation', slug: 'cancellation' },
    { href: 'wallet-status-change.html', text: 'Status Change', slug: 'status-change' },
  ],
};

function renderModuleNav(moduleKey, activeSlug) {
  const mod = modules.find((m) => m.key === moduleKey);
  const links = moduleSubnavLinks[moduleKey];
  const linksHtml = links
    .map((link) => {
      const fileSlug = link.href.replace(`${moduleKey}-`, '').replace('.html', '');
      const cls = fileSlug === activeSlug ? 'subnav-item active' : 'subnav-item';
      return `            <a href="${link.href}" class="${cls}">${link.text}</a>`;
    })
    .join('\n');

  return `          <!-- ${mod.label} -->
          <a href="#" class="nav-item nav-has-children active nav-open" data-subnav-id="${mod.navId}" aria-expanded="true">
            <i class="bi ${mod.icon} nav-item-icon" aria-hidden="true"></i>
            <span>${mod.label}</span>
            <button class="nav-expand-btn" type="button" aria-label="Toggle ${mod.label} sub menu"><i class="bi bi-chevron-right"></i></button>
          </a>
          <div class="sidebar-subnav subnav-open" id="${mod.navId}">
${linksHtml}
          </div>`;
}

function replaceModuleNavBlock(html, moduleKey, navId, activeSlug) {
  const re = new RegExp(
    `          <!-- ${modules.find((m) => m.key === moduleKey).label} -->[\\s\\S]*?<div class="sidebar-subnav[^"]*" id="${navId}">[\\s\\S]*?<\\/div>`
  );
  return html.replace(re, renderModuleNav(moduleKey, activeSlug));
}

function replaceAllModuleNavs(html, activeModuleKey) {
  let out = html;
  for (const mod of modules) {
    const activeSlug = mod.key === activeModuleKey ? 'processing-queue' : null;
    if (activeSlug) {
      out = replaceModuleNavBlock(out, mod.key, mod.navId, activeSlug);
    } else {
      const linksHtml = moduleSubnavLinks[mod.key]
        .map((link) => `            <a href="${link.href}" class="subnav-item">${link.text}</a>`)
        .join('\n');
      const inactive = `          <!-- ${mod.label} -->
          <a href="#" class="nav-item nav-has-children" data-subnav-id="${mod.navId}">
            <i class="bi ${mod.icon} nav-item-icon" aria-hidden="true"></i>
            <span>${mod.label}</span>
            <button class="nav-expand-btn" type="button" aria-label="Toggle ${mod.label} sub menu"><i class="bi bi-chevron-right"></i></button>
          </a>
          <div class="sidebar-subnav" id="${mod.navId}">
${linksHtml}
          </div>`;
      const re = new RegExp(
        `          <!-- ${mod.label} -->[\\s\\S]*?<div class="sidebar-subnav[^"]*" id="${mod.navId}">[\\s\\S]*?<\\/div>`
      );
      out = out.replace(re, inactive);
    }
  }
  return out;
}

function deactivateOtherNav(html) {
  return html
    .replace(/class="nav-item nav-has-children active nav-open"/g, 'class="nav-item nav-has-children"')
    .replace(/class="sidebar-subnav subnav-open"/g, 'class="sidebar-subnav"')
    .replace(/(<a href="[^"]*\.html" class="subnav-item) active"/g, '$1"')
    .replace(/ aria-expanded="true"/g, '');
}

function miniToolbar(searchId) {
  return `
              <div class="pq-mini-toolbar">
                <div class="pq-mini-actions">
                  <button type="button" class="beftn-btn beftn-btn-outline" data-no-confirm><i class="bi bi-clipboard" aria-hidden="true"></i> Copy</button>
                  <button type="button" class="beftn-btn beftn-btn-outline" data-no-confirm><i class="bi bi-filetype-csv" aria-hidden="true"></i> CSV</button>
                  <button type="button" class="beftn-btn beftn-btn-outline" data-no-confirm><i class="bi bi-printer" aria-hidden="true"></i> Print</button>
                </div>
                <div class="pq-mini-search">
                  <label for="${searchId}">Search</label>
                  <input type="search" id="${searchId}" class="beftn-input" aria-label="Search">
                </div>
              </div>`;
}

function miniPagination(info) {
  return `
              <div class="pq-pagination">
                <span>${info}</span>
                <div class="pq-pagination-nav" aria-label="Pagination">
                  <button type="button" class="pq-page-btn" disabled>Previous</button>
                  <button type="button" class="pq-page-btn is-active">1</button>
                  <button type="button" class="pq-page-btn">2</button>
                  <button type="button" class="pq-page-btn">Next</button>
                </div>
              </div>`;
}

function buildQueueContent(mod) {
  const id = 'pq' + mod.key.replace(/-/g, '');
  return `
        <div class="beftn-module-page pq-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">${mod.label} <i class="bi bi-chevron-right" aria-hidden="true"></i> Processing Queue</p>
              <h1 class="beftn-module-title">${mod.label} — Processing Queue</h1>
              <p class="beftn-module-desc">Monitor queued ${mod.label} transactions, exchange house summaries, and processing status.</p>
            </div>
          </header>

          <div class="pq-top-actions">
            <button type="button" class="beftn-btn beftn-btn-primary" data-no-confirm><i class="bi bi-download" aria-hidden="true"></i> Download</button>
          </div>

          <div class="pq-summary-grid">
            <section class="beftn-module-card pq-summary-card">
              <div class="beftn-module-card-head">
                <h2 class="beftn-module-card-title">Exchange house summary</h2>
              </div>
${miniToolbar(id + 'SumSearch')}
              <div class="beftn-table-wrap">
                <table class="beftn-table">
                  <thead>
                    <tr>
                      <th>Party ID</th>
                      <th>EX House</th>
                      <th>Count</th>
                      <th>Txn Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>10001</td><td>WISE PAYMENTS LTD.</td><td>245</td><td>INC TXN</td></tr>
                    <tr><td>10002</td><td>DIGITAL WALLET CORPORATION</td><td>128</td><td>PRI TXN</td></tr>
                    <tr><td>10003</td><td>AL ANSARI EXCHANGE</td><td>89</td><td>INC TXN</td></tr>
                  </tbody>
                </table>
              </div>
${miniPagination('Showing 1 to 3 of 12 entries')}
            </section>

            <section class="beftn-module-card pq-summary-card">
              <div class="beftn-module-card-head">
                <h2 class="beftn-module-card-title">Recent queue items</h2>
              </div>
${miniToolbar(id + 'RecentSearch')}
              <div class="beftn-table-wrap">
                <table class="beftn-table">
                  <thead>
                    <tr>
                      <th>EX House</th>
                      <th>Ref No</th>
                      <th>Amount</th>
                      <th>Request Time</th>
                      <th>Txn Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>DIGITAL WALLET CORPORATION</td><td>MTB44582883884535</td><td>669.38</td><td>8/2/2023 1:32:22 PM</td><td>INC TXN</td></tr>
                    <tr><td>WISE PAYMENTS LTD.</td><td>MTB44582883884536</td><td>1,250.00</td><td>8/2/2023 1:28:10 PM</td><td>PRI TXN</td></tr>
                    <tr><td>AL ANSARI EXCHANGE</td><td>MTB44582883884537</td><td>420.15</td><td>8/2/2023 1:15:05 PM</td><td>INC TXN</td></tr>
                  </tbody>
                </table>
              </div>
${miniPagination('Showing 1 to 3 of 48 entries')}
            </section>
          </div>

          <section class="beftn-module-card">
            <div class="rpt-filter-grid rpt-filter-grid--two-col">
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="${id}From">From Date</label>
                <input type="date" id="${id}From" class="beftn-input">
              </div>
              <div class="rpt-inline-field">
                <label class="beftn-label-block" for="${id}To">To Date</label>
                <input type="date" id="${id}To" class="beftn-input">
              </div>
            </div>
            <div class="beftn-module-actions beftn-module-actions--center">
              <button type="button" class="beftn-btn beftn-btn-primary" data-no-confirm><i class="bi bi-search" aria-hidden="true"></i> Search</button>
              <button type="button" class="beftn-btn beftn-btn-outline" data-no-confirm><i class="bi bi-x-circle" aria-hidden="true"></i> Clear</button>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="beftn-module-card-head">
              <div>
                <h2 class="beftn-module-card-title">Processing queue</h2>
                <p class="beftn-module-card-sub">Detailed ${mod.label} transaction queue</p>
              </div>
            </div>
            <div class="beftn-table-wrap">
              <table class="beftn-table pq-queue-table">
                <thead>
                  <tr>
                    <th>Party ID</th>
                    <th>Ref No</th>
                    <th>EX House</th>
                    <th>Amount</th>
                    <th>Create Time</th>
                    <th>Processing Time</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Txn Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="9">
                      <div class="beftn-empty"><i class="bi bi-inbox" aria-hidden="true"></i>No queue records found. Adjust dates and search to view ${mod.label} processing items.</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>`;
}

const shellPath = path.join(path.join(root), 'reports-principle.html');
let shell = fs.readFileSync(shellPath, 'utf8');

const reportsNavInactive = `          <!-- Reports & MIS -->
          <a href="#" class="nav-item nav-has-children" data-subnav-id="nav-reports-mis-sub">
            <i class="bi bi-bar-chart nav-item-icon" aria-hidden="true"></i>
            <span>Reports &amp; MIS</span>
            <button class="nav-expand-btn" type="button" aria-label="Toggle Reports and MIS sub menu"><i class="bi bi-chevron-right"></i></button>
          </a>
          <div class="sidebar-subnav" id="nav-reports-mis-sub">
            <a href="reports-balance.html" class="subnav-item">Exchange House Balance</a>
            <a href="reports-principle.html" class="subnav-item">Principle & Incentive Report</a>
            <a href="reports-merge-statement.html" class="subnav-item">Merge Statement</a>
            <a href="reports-remittance-certificate.html" class="subnav-item">Remittance Certificate</a>
          </div>`;

for (const mod of modules) {
  let html = shell;

  html = html.replace(/<title>[^<]+<\/title>/, `<title>${mod.label} Processing Queue - RMS</title>`);
  html = html.replace(/data-page="[^"]+"/, `data-page="${mod.key}-processing-queue"`);

  if (!html.includes('processing-queue.css')) {
    html = html.replace(
      /<link rel="stylesheet" href="assets\/css\/reports\.css" \/>/,
      '<link rel="stylesheet" href="assets/css/reports.css" />\n    <link rel="stylesheet" href="assets/css/processing-queue.css" />'
    );
  }

  html = deactivateOtherNav(html);
  html = replaceAllModuleNavs(html, mod.key);
  html = html.replace(
    /          <!-- Reports & MIS -->[\s\S]*?<div class="sidebar-subnav[^"]*" id="nav-reports-mis-sub">[\s\S]*?<\/div>/,
    reportsNavInactive
  );

  const contentRe = /\s*<div class="beftn-module-page[^"]*">[\s\S]*?<\/div>\s*\n\s*<\/main>/;
  html = html.replace(contentRe, `\n${buildQueueContent(mod)}\n\n      </main>`);

  fs.writeFileSync(path.join(root, mod.queueFile), html, 'utf8');
  console.log('Wrote', mod.queueFile);
}
