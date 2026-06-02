const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const manualFileLinks = [
  { href: 'manual-file-upload.html', text: 'File Upload', slug: 'upload' },
  { href: 'manual-file-authorized.html', text: 'File Authorized', slug: 'authorized' },
  { href: 'manual-file-failed-process.html', text: 'Failed Process', slug: 'failed-process' },
  { href: 'manual-file-bkash-recon.html', text: 'Bkash Direct Reconciliation Process', slug: 'bkash-recon' },
  { href: 'manual-file-nagad-recon.html', text: 'Nagad Direct Reconciliation Process', slug: 'nagad-recon' },
];

const exHouseOptions = `
                    <option value="">— Select Ex_House —</option>
                    <option>Western Union</option>
                    <option>MoneyGram</option>
                    <option>Ria Money Transfer</option>
                    <option>Transfast</option>`;

function renderManualFileNav(activeSlug) {
  const linksHtml = manualFileLinks
    .map((link) => {
      const fileSlug = link.href.replace('manual-file-', '').replace('.html', '');
      const cls = fileSlug === activeSlug ? 'subnav-item active' : 'subnav-item';
      return `            <a href="${link.href}" class="${cls}">${link.text}</a>`;
    })
    .join('\n');

  return `          <!-- Manual File -->
          <a href="#" class="nav-item nav-has-children active nav-open" data-subnav-id="nav-manual-file-sub" aria-expanded="true">
            <i class="bi bi-file-earmark-arrow-up nav-item-icon" aria-hidden="true"></i>
            <span>Manual File</span>
            <button class="nav-expand-btn" type="button" aria-label="Toggle Manual File sub menu"><i class="bi bi-chevron-right"></i></button>
          </a>
          <div class="sidebar-subnav subnav-open" id="nav-manual-file-sub">
${linksHtml}
          </div>`;
}

function replaceManualFileNav(html, activeSlug) {
  const re =
    /          <!-- Manual File -->[\s\S]*?<div class="sidebar-subnav[^"]*" id="nav-manual-file-sub">[\s\S]*?<\/div>/;
  return html.replace(re, renderManualFileNav(activeSlug));
}

function deactivateOtherNav(html) {
  return html
    .replace(/class="nav-item nav-has-children active nav-open"/g, 'class="nav-item nav-has-children"')
    .replace(/class="sidebar-subnav subnav-open"/g, 'class="sidebar-subnav"')
    .replace(/(<a href="[^"]*\.html" class="subnav-item) active"/g, '$1"')
    .replace(/ aria-expanded="true"/g, '');
}

function tableEmpty(colspan, message) {
  return `<tr><td colspan="${colspan}"><div class="beftn-empty"><i class="bi bi-inbox" aria-hidden="true"></i>${message}</div></td></tr>`;
}

function buildUploadContent(id) {
  return `
        <div class="beftn-module-page mf-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Manual File <i class="bi bi-chevron-right" aria-hidden="true"></i> File Upload</p>
              <h1 class="beftn-module-title">Manual File — File Upload</h1>
              <p class="beftn-module-desc">Select an exchange house, load a file to preview records, then upload for processing.</p>
            </div>
          </header>

          <section class="beftn-module-card">
            <div class="mf-inline-row">
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}ExHouse">EX House</label>
                <select id="${id}ExHouse" class="beftn-select">${exHouseOptions}
                </select>
              </div>
            </div>
            <div class="mf-file-row">
              <input type="file" id="${id}File" class="mf-file-input" accept=".csv,.xls,.xlsx,.txt">
            </div>
            <div class="beftn-module-actions beftn-module-actions--center">
              <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-folder2-open" aria-hidden="true"></i> Load</button>
              <button type="button" class="beftn-btn beftn-btn-primary"><i class="bi bi-cloud-upload" aria-hidden="true"></i> Upload</button>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="mf-summary-grid">
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Total">Total</label>
                <input type="text" id="${id}Total" class="beftn-input" readonly placeholder="—">
              </div>
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Count">Count</label>
                <input type="text" id="${id}Count" class="beftn-input" readonly placeholder="—">
              </div>
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Status">Status</label>
                <input type="text" id="${id}Status" class="beftn-input" readonly placeholder="—">
              </div>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="beftn-module-card-head">
              <div>
                <h2 class="beftn-module-card-title">Upload preview</h2>
                <p class="beftn-module-card-sub">Records loaded from the selected file</p>
              </div>
              <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-download" aria-hidden="true"></i> Export</button>
            </div>
            <div class="beftn-table-wrap">
              <table class="beftn-table">
                <thead>
                  <tr>
                    <th class="beftn-check-col"><input type="checkbox" aria-label="Select all"></th>
                    <th>REFNo</th>
                    <th>Remitter Name</th>
                    <th>Remitter Address</th>
                    <th>Remitter Nationality</th>
                    <th>Beneficiary Name</th>
                    <th>Beneficiary Address</th>
                    <th>Beneficiary AC No</th>
                    <th>Beneficiary Bank AC Type</th>
                    <th>Beneficiary Bank Name</th>
                    <th>Beneficiary Bank Branch</th>
                    <th>Branch Routing Number</th>
                    <th>Amount</th>
                    <th>Payment Description</th>
                    <th>Sending Country</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableEmpty(15, 'No records loaded. Choose a file and click Load to preview.')}
                </tbody>
              </table>
            </div>
          </section>
        </div>`;
}

function buildSearchProcessContent(id, title, breadcrumb, desc, withSummary) {
  const summary = withSummary
    ? `
          <section class="beftn-module-card">
            <div class="mf-summary-grid">
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Total">Total</label>
                <input type="text" id="${id}Total" class="beftn-input" readonly placeholder="—">
              </div>
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Count">Count</label>
                <input type="text" id="${id}Count" class="beftn-input" readonly placeholder="—">
              </div>
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Status">Status</label>
                <input type="text" id="${id}Status" class="beftn-input" readonly placeholder="—">
              </div>
            </div>
          </section>`
    : '';

  return `
        <div class="beftn-module-page mf-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Manual File <i class="bi bi-chevron-right" aria-hidden="true"></i> ${breadcrumb}</p>
              <h1 class="beftn-module-title">Manual File — ${title}</h1>
              <p class="beftn-module-desc">${desc}</p>
            </div>
          </header>

          <section class="beftn-module-card">
            <div class="mf-inline-row">
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}FromDate">From Date</label>
                <input type="date" id="${id}FromDate" class="beftn-input">
              </div>
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}ToDate">To Date</label>
                <input type="date" id="${id}ToDate" class="beftn-input">
              </div>
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}ExHouse">EX House</label>
                <select id="${id}ExHouse" class="beftn-select">${exHouseOptions}
                </select>
              </div>
            </div>
            <div class="beftn-module-actions beftn-module-actions--center">
              <button type="button" class="beftn-btn beftn-btn-primary"><i class="bi bi-search" aria-hidden="true"></i> Search</button>
              <button type="button" class="beftn-btn beftn-btn-accent"><i class="bi bi-play-circle" aria-hidden="true"></i> Process</button>
            </div>
          </section>
${summary}
          <section class="beftn-module-card">
            <div class="beftn-module-card-head">
              <div>
                <h2 class="beftn-module-card-title">Results</h2>
                <p class="beftn-module-card-sub">${breadcrumb} transaction records</p>
              </div>
              <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-download" aria-hidden="true"></i> Export</button>
            </div>
            <div class="beftn-table-wrap">
              <table class="beftn-table">
                <thead>
                  <tr>
                    <th class="beftn-check-col"><input type="checkbox" aria-label="Select all"></th>
                    <th>Entity ID</th>
                    <th>Exchange House Name</th>
                    <th>Reference Number</th>
                    <th>Payment Mode</th>
                    <th>Beneficiary Name</th>
                    <th>Beneficiary Acc</th>
                    <th>Bank Name</th>
                    <th>Routing No</th>
                    <th>Amount</th>
                    <th>User Name</th>
                    <th>Upload Time</th>
                    <th>Is Success</th>
                    <th>Branch Name</th>
                    <th>Party ID</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableEmpty(15, 'No records found. Run a search to view results.')}
                </tbody>
              </table>
            </div>
          </section>
        </div>`;
}

function buildBkashContent(id) {
  return `
        <div class="beftn-module-page mf-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Manual File <i class="bi bi-chevron-right" aria-hidden="true"></i> Bkash Direct Reconciliation</p>
              <h1 class="beftn-module-title">Bkash Direct Reconciliation Process</h1>
              <p class="beftn-module-desc">Load and upload Bkash direct reconciliation files by MTO and wallet service type.</p>
            </div>
          </header>

          <section class="beftn-module-card">
            <div class="mf-inline-row">
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Mto">MTO Name</label>
                <select id="${id}Mto" class="beftn-select">
                  <option value="">— Select ALL —</option>
                  <option>Bkash MTO 1</option>
                  <option>Bkash MTO 2</option>
                </select>
              </div>
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Wallet">Wallet</label>
                <select id="${id}Wallet" class="beftn-select">
                  <option value="">— Select Service Type —</option>
                  <option>Bkash</option>
                  <option>Cash In</option>
                  <option>Cash Out</option>
                </select>
              </div>
            </div>
            <div class="mf-file-row">
              <input type="file" id="${id}File" class="mf-file-input" accept=".csv,.xls,.xlsx,.txt">
            </div>
            <div class="beftn-module-actions beftn-module-actions--center">
              <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-folder2-open" aria-hidden="true"></i> Load</button>
              <button type="button" class="beftn-btn beftn-btn-primary"><i class="bi bi-cloud-upload" aria-hidden="true"></i> Upload</button>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="mf-summary-grid">
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}TotalCount">Total Count</label>
                <input type="text" id="${id}TotalCount" class="beftn-input" readonly placeholder="—">
              </div>
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Mismatch">Miss Match Count</label>
                <input type="text" id="${id}Mismatch" class="beftn-input" readonly placeholder="—">
              </div>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="beftn-module-card-head">
              <div>
                <h2 class="beftn-module-card-title">Reconciliation results</h2>
                <p class="beftn-module-card-sub">Bkash direct reconciliation output</p>
              </div>
              <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-download" aria-hidden="true"></i> Export</button>
            </div>
            <div class="beftn-table-wrap">
              <table class="beftn-table">
                <thead>
                  <tr>
                    <th class="beftn-check-col"><input type="checkbox" aria-label="Select all"></th>
                    <th>Reference No</th>
                    <th>MTO Name</th>
                    <th>Wallet</th>
                    <th>Beneficiary Name</th>
                    <th>Beneficiary Mobile</th>
                    <th>Amount</th>
                    <th>Transaction Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableEmpty(10, 'No reconciliation data. Load or upload a file to view results.')}
                </tbody>
              </table>
            </div>
          </section>
        </div>`;
}

function buildNagadContent(id) {
  return `
        <div class="beftn-module-page mf-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Manual File <i class="bi bi-chevron-right" aria-hidden="true"></i> Nagad Direct Reconciliation</p>
              <h1 class="beftn-module-title">Nagad Direct Reconciliation Process</h1>
              <p class="beftn-module-desc">Upload and process Nagad direct reconciliation CSV files by MTO, wallet, and date range.</p>
            </div>
          </header>

          <section class="beftn-module-card">
            <div class="mf-inline-row">
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Mto">MTO Name</label>
                <select id="${id}Mto" class="beftn-select">
                  <option value="">— Select ALL —</option>
                  <option>Nagad MTO 1</option>
                  <option>Nagad MTO 2</option>
                </select>
              </div>
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}NagadMto">NAGAD MTO Name</label>
                <select id="${id}NagadMto" class="beftn-select">
                  <option value="">— Select MTO Name —</option>
                  <option>Nagad Partner A</option>
                  <option>Nagad Partner B</option>
                </select>
              </div>
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Wallet">Wallet</label>
                <select id="${id}Wallet" class="beftn-select">
                  <option value="">— Select Service Type —</option>
                  <option>Nagad</option>
                  <option>Cash In</option>
                  <option>Cash Out</option>
                </select>
              </div>
            </div>
            <div class="mf-inline-row" style="margin-top: 1rem;">
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}FromDate">From Date</label>
                <input type="date" id="${id}FromDate" class="beftn-input">
              </div>
              <div class="mf-inline-field">
                <label class="beftn-label-block mf-inline-label" for="${id}ToDate">To Date</label>
                <input type="date" id="${id}ToDate" class="beftn-input">
              </div>
            </div>
            <div class="mf-file-row">
              <input type="file" id="${id}File" class="mf-file-input" accept=".csv,.xls,.xlsx,.txt">
            </div>
            <div class="mf-actions-stack">
              <button type="button" class="beftn-btn beftn-btn-primary"><i class="bi bi-cloud-upload" aria-hidden="true"></i> Upload and Process CSV</button>
              <button type="button" class="beftn-btn beftn-btn-accent"><i class="bi bi-play-circle" aria-hidden="true"></i> Process Data</button>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="mf-summary-grid">
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}TotalCount">Total Count</label>
                <input type="text" id="${id}TotalCount" class="beftn-input" readonly placeholder="—">
              </div>
              <div class="mf-inline-field mf-summary-field">
                <label class="beftn-label-block mf-inline-label" for="${id}Mismatch">Miss Match Count</label>
                <input type="text" id="${id}Mismatch" class="beftn-input" readonly placeholder="—">
              </div>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="beftn-module-card-head">
              <div>
                <h2 class="beftn-module-card-title">Reconciliation results</h2>
                <p class="beftn-module-card-sub">Nagad direct reconciliation output</p>
              </div>
              <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-download" aria-hidden="true"></i> Export</button>
            </div>
            <div class="beftn-table-wrap">
              <table class="beftn-table">
                <thead>
                  <tr>
                    <th class="beftn-check-col"><input type="checkbox" aria-label="Select all"></th>
                    <th>Reference No</th>
                    <th>MTO Name</th>
                    <th>NAGAD MTO</th>
                    <th>Wallet</th>
                    <th>Beneficiary Name</th>
                    <th>Beneficiary Mobile</th>
                    <th>Amount</th>
                    <th>Transaction Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableEmpty(11, 'No reconciliation data. Upload a CSV or process data to view results.')}
                </tbody>
              </table>
            </div>
          </section>
        </div>`;
}

const pages = [
  {
    slug: 'upload',
    file: 'manual-file-upload.html',
    dataPage: 'manual-file-upload',
    title: 'File Upload - RMS',
    content: () => buildUploadContent('mfUpload'),
  },
  {
    slug: 'authorized',
    file: 'manual-file-authorized.html',
    dataPage: 'manual-file-authorized',
    title: 'File Authorized - RMS',
    content: () =>
      buildSearchProcessContent(
        'mfAuth',
        'File Authorized',
        'File Authorized',
        'Search uploaded manual files pending authorization and process approved batches.',
        true
      ),
  },
  {
    slug: 'failed-process',
    file: 'manual-file-failed-process.html',
    dataPage: 'manual-file-failed-process',
    title: 'Failed Process - RMS',
    content: () =>
      buildSearchProcessContent(
        'mfFailed',
        'Failed Process',
        'Failed Process',
        'Review and reprocess manual file transactions that failed during processing.',
        false
      ),
  },
  {
    slug: 'bkash-recon',
    file: 'manual-file-bkash-recon.html',
    dataPage: 'manual-file-bkash-recon',
    title: 'Bkash Direct Reconciliation - RMS',
    content: () => buildBkashContent('mfBkash'),
  },
  {
    slug: 'nagad-recon',
    file: 'manual-file-nagad-recon.html',
    dataPage: 'manual-file-nagad-recon',
    title: 'Nagad Direct Reconciliation - RMS',
    content: () => buildNagadContent('mfNagad'),
  },
];

const shellPath = path.join(root, 'npsb-failed-release.html');
let shell = fs.readFileSync(shellPath, 'utf8');

for (const page of pages) {
  let html = shell;

  html = html.replace(/<title>[^<]+<\/title>/, `<title>${page.title}</title>`);
  html = html.replace(/data-page="[^"]+"/, `data-page="${page.dataPage}"`);
  html = html.replace(
    /<link rel="stylesheet" href="assets\/css\/beftn\.css" \/>/,
    '<link rel="stylesheet" href="assets/css/beftn.css" />\n    <link rel="stylesheet" href="assets/css/manual-file.css" />'
  );

  html = deactivateOtherNav(html);
  html = replaceManualFileNav(html, page.slug);

  const contentRe = /\s*<div class="beftn-module-page">[\s\S]*?<\/div>\s*\n\s*<\/main>/;
  html = html.replace(contentRe, `\n${page.content()}\n\n      </main>`);
  html = html.replace(/\s*<script src="assets\/js\/beftn-page\.js"><\/script>/, '');

  fs.writeFileSync(path.join(root, page.file), html, 'utf8');
  console.log('Wrote', page.file);
}
