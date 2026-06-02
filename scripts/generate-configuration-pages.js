const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const configLinks = [
  { href: 'config-freelancer-account.html', text: 'Freelancer Account', slug: 'freelancer-account' },
  { href: 'config-foreigner-account.html', text: 'Foreigner Account', slug: 'foreigner-account' },
  { href: 'config-company-account.html', text: 'Company Account', slug: 'company-account' },
  { href: 'config-freelancer-keyword.html', text: 'Freelancer Keyword', slug: 'freelancer-keyword' },
  { href: 'config-foreigner-keyword.html', text: 'Foreigner Keyword', slug: 'foreigner-keyword' },
  { href: 'config-company-keyword.html', text: 'Company Keyword', slug: 'company-keyword' },
];

function renderConfigNav(activeSlug) {
  const linksHtml = configLinks
    .map((link) => {
      const fileSlug = link.href.replace('config-', '').replace('.html', '');
      const cls = fileSlug === activeSlug ? 'subnav-item active' : 'subnav-item';
      return `            <a href="${link.href}" class="${cls}">${link.text}</a>`;
    })
    .join('\n');

  return `          <!-- Configurations -->
          <a href="#" class="nav-item nav-has-children active nav-open" data-subnav-id="nav-configurations-sub" aria-expanded="true">
            <i class="bi bi-gear nav-item-icon" aria-hidden="true"></i>
            <span>Configurations</span>
            <button class="nav-expand-btn" type="button" aria-label="Toggle Configurations sub menu"><i class="bi bi-chevron-right"></i></button>
          </a>
          <div class="sidebar-subnav subnav-open" id="nav-configurations-sub">
${linksHtml}
          </div>`;
}

function replaceConfigNav(html, activeSlug) {
  const re =
    /          <!-- Configurations -->[\s\S]*?<div class="sidebar-subnav[^"]*" id="nav-configurations-sub">[\s\S]*?<\/div>/;
  return html.replace(re, renderConfigNav(activeSlug));
}

function deactivateOtherNav(html) {
  return html
    .replace(/class="nav-item nav-has-children active nav-open"/g, 'class="nav-item nav-has-children"')
    .replace(/class="sidebar-subnav subnav-open"/g, 'class="sidebar-subnav"')
    .replace(/(<a href="[^"]*\.html" class="subnav-item) active"/g, '$1"')
    .replace(/ aria-expanded="true"/g, '');
}

function tableToolbar(searchId) {
  return `
            <div class="cfg-table-toolbar">
              <div class="cfg-table-actions">
                <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-clipboard" aria-hidden="true"></i> Copy</button>
                <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-filetype-csv" aria-hidden="true"></i> CSV</button>
                <button type="button" class="beftn-btn beftn-btn-outline"><i class="bi bi-printer" aria-hidden="true"></i> Print</button>
              </div>
              <div class="cfg-table-search">
                <label for="${searchId}">Search</label>
                <input type="search" id="${searchId}" class="beftn-input" placeholder="Filter records…" aria-label="Search table">
              </div>
            </div>`;
}

function pagination(info) {
  return `
            <div class="cfg-pagination">
              <span class="cfg-pagination-info">${info}</span>
              <div class="cfg-pagination-nav" aria-label="Table pagination">
                <button type="button" class="cfg-page-btn" disabled>Previous</button>
                <button type="button" class="cfg-page-btn is-active">1</button>
                <button type="button" class="cfg-page-btn">2</button>
                <button type="button" class="cfg-page-btn">3</button>
                <button type="button" class="cfg-page-btn">Next</button>
              </div>
            </div>`;
}

function deleteBtn(label) {
  return `<button type="button" class="cfg-btn-delete" aria-label="${label}"><i class="bi bi-trash" aria-hidden="true"></i></button>`;
}

function buildAccountPage(cfg) {
  const rows = cfg.sampleRows
    .map(
      (r) => `
                    <tr>
                      <td>${r.id}</td>
                      <td>${r.account}</td>
                      <td>${r.addedBy || '—'}</td>
                      <td>${r.date}</td>
                      <td>${deleteBtn('Delete account ' + r.id)}</td>
                    </tr>`
    )
    .join('');

  return `
        <div class="beftn-module-page cfg-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Configurations <i class="bi bi-chevron-right" aria-hidden="true"></i> ${cfg.title}</p>
              <h1 class="beftn-module-title">${cfg.title}</h1>
              <p class="beftn-module-desc">${cfg.desc}</p>
            </div>
          </header>

          <section class="beftn-module-card cfg-entry-card">
            <label class="beftn-label-block" for="${cfg.id}Input">${cfg.inputLabel}</label>
            <div class="cfg-entry-row">
              <textarea id="${cfg.id}Input" class="beftn-textarea cfg-bulk-input" placeholder="${cfg.placeholder}"></textarea>
              <button type="button" class="beftn-btn beftn-btn-primary"><i class="bi bi-save" aria-hidden="true"></i> ${cfg.saveLabel}</button>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="beftn-module-card-head">
              <div>
                <h2 class="beftn-module-card-title">Registered accounts</h2>
                <p class="beftn-module-card-sub">Manage saved account numbers</p>
              </div>
            </div>
${tableToolbar(cfg.id + 'Search')}
            <div class="beftn-table-wrap">
              <table class="beftn-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account No</th>
                    <th>Added By</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>${rows}
                </tbody>
              </table>
            </div>
${pagination(cfg.paginationInfo)}
          </section>
        </div>`;
}

function buildKeywordPage(cfg) {
  const hasMeta = cfg.withMeta !== false;
  const headers = hasMeta
    ? `<th>ID</th><th>${cfg.valueColumn}</th><th>Added By</th><th>Date</th><th>Action</th>`
    : `<th>ID</th><th>${cfg.valueColumn}</th><th>Action</th>`;

  const rows = cfg.sampleRows
    .map((r) => {
      if (hasMeta) {
        return `
                    <tr>
                      <td>${r.id}</td>
                      <td>${r.value}</td>
                      <td>${r.addedBy || '—'}</td>
                      <td>${r.date || '—'}</td>
                      <td>${deleteBtn('Delete keyword ' + r.id)}</td>
                    </tr>`;
      }
      return `
                    <tr>
                      <td>${r.id}</td>
                      <td>${r.value}</td>
                      <td>${deleteBtn('Delete keyword ' + r.id)}</td>
                    </tr>`;
    })
    .join('');

  const colspan = hasMeta ? 5 : 3;

  return `
        <div class="beftn-module-page cfg-page">
          <header class="beftn-module-hero">
            <div>
              <p class="beftn-module-breadcrumb">Configurations <i class="bi bi-chevron-right" aria-hidden="true"></i> ${cfg.title}</p>
              <h1 class="beftn-module-title">${cfg.title}</h1>
              <p class="beftn-module-desc">${cfg.desc}</p>
            </div>
          </header>

          <section class="beftn-module-card cfg-entry-card">
            <label class="beftn-label-block" for="${cfg.id}Input">${cfg.inputLabel}</label>
            <div class="cfg-entry-row">
              <textarea id="${cfg.id}Input" class="beftn-textarea cfg-bulk-input" placeholder="${cfg.placeholder}"></textarea>
              <button type="button" class="beftn-btn beftn-btn-primary"><i class="bi bi-save" aria-hidden="true"></i> Save</button>
            </div>
          </section>

          <section class="beftn-module-card">
            <div class="beftn-module-card-head">
              <div>
                <h2 class="beftn-module-card-title">Keyword list</h2>
                <p class="beftn-module-card-sub">Existing keywords configured in the system</p>
              </div>
            </div>
${tableToolbar(cfg.id + 'Search')}
            <div class="beftn-table-wrap">
              <table class="beftn-table">
                <thead>
                  <tr>${headers}</tr>
                </thead>
                <tbody>${rows}
                </tbody>
              </table>
            </div>
${pagination(cfg.paginationInfo)}
          </section>
        </div>`;
}

const pages = [
  {
    slug: 'freelancer-account',
    file: 'config-freelancer-account.html',
    dataPage: 'config-freelancer-account',
    title: 'Freelancer Account - RMS',
    content: () =>
      buildAccountPage({
        id: 'cfgFreelancerAcct',
        title: 'Freelancer Account',
        desc: 'Add and manage freelancer account numbers used for remittance validation.',
        inputLabel: 'Account No',
        placeholder: 'Enter one or more account numbers (one per line)',
        saveLabel: 'Save Account No',
        paginationInfo: 'Showing 1 to 10 of 48 entries',
        sampleRows: [
          { id: 412, account: '0062112000003587', addedBy: '', date: '9/28/2022 11:38:51 AM' },
          { id: 413, account: '0062112000003588', addedBy: '', date: '9/28/2022 11:39:02 AM' },
          { id: 414, account: '0062112000003589', addedBy: '', date: '10/1/2022 3:15:20 PM' },
        ],
      }),
  },
  {
    slug: 'foreigner-account',
    file: 'config-foreigner-account.html',
    dataPage: 'config-foreigner-account',
    title: 'Foreigner Account - RMS',
    content: () =>
      buildAccountPage({
        id: 'cfgForeignerAcct',
        title: 'Foreigner Account',
        desc: 'Add and manage foreigner account numbers for compliance and routing checks.',
        inputLabel: 'Foreigner Account No',
        placeholder: 'Enter one or more foreigner account numbers (one per line)',
        saveLabel: 'Save Foreigner Account No',
        paginationInfo: 'Showing 1 to 10 of 32 entries',
        sampleRows: [
          { id: 201, account: '0062112000004101', addedBy: '', date: '11/8/2022 9:44:20 AM' },
          { id: 202, account: '0062112000004102', addedBy: '', date: '11/8/2022 9:45:11 AM' },
          { id: 203, account: '0062112000004103', addedBy: '', date: '11/9/2022 2:22:05 PM' },
        ],
      }),
  },
  {
    slug: 'company-account',
    file: 'config-company-account.html',
    dataPage: 'config-company-account',
    title: 'Company Account - RMS',
    content: () =>
      buildAccountPage({
        id: 'cfgCompanyAcct',
        title: 'Company Account',
        desc: 'Add and manage company account numbers for corporate remittance processing.',
        inputLabel: 'Company Account No',
        placeholder: 'Enter one or more company account numbers (one per line)',
        saveLabel: 'Save Company Account No',
        paginationInfo: 'Showing 1 to 10 of 420 entries',
        sampleRows: [
          { id: 420, account: '0062112000003587', addedBy: '', date: '10/24/2022 6:20:41 PM' },
          { id: 421, account: '0062112000003588', addedBy: '', date: '10/24/2022 6:21:02 PM' },
          { id: 422, account: '0062112000003589', addedBy: '', date: '10/25/2022 10:05:18 AM' },
        ],
      }),
  },
  {
    slug: 'freelancer-keyword',
    file: 'config-freelancer-keyword.html',
    dataPage: 'config-freelancer-keyword',
    title: 'Freelancer Keyword - RMS',
    content: () =>
      buildKeywordPage({
        id: 'cfgFreelancerKw',
        title: 'Freelancer Keyword',
        desc: 'Configure keywords used to identify freelancer remittance transactions.',
        inputLabel: 'Freelancer Keywords',
        valueColumn: 'Freelancer Keywords',
        placeholder: 'Enter one or more keywords (one per line)',
        paginationInfo: 'Showing 1 to 10 of 72 entries',
        sampleRows: [
          { id: 67, value: 'FREELANCING', addedBy: '', date: '8/21/2022 12:32:34 AM' },
          { id: 68, value: 'FREELANCER', addedBy: '', date: '8/21/2022 12:33:01 AM' },
          { id: 69, value: 'OUTSOURCING', addedBy: '', date: '8/22/2022 9:10:15 AM' },
          { id: 70, value: 'FIVERR', addedBy: '', date: '8/22/2022 9:11:42 AM' },
          { id: 71, value: 'UPWORK', addedBy: '', date: '8/23/2022 4:05:00 PM' },
        ],
      }),
  },
  {
    slug: 'foreigner-keyword',
    file: 'config-foreigner-keyword.html',
    dataPage: 'config-foreigner-keyword',
    title: 'Foreigner Keyword - RMS',
    content: () =>
      buildKeywordPage({
        id: 'cfgForeignerKw',
        title: 'Foreigner Keyword',
        desc: 'Configure keywords used to identify foreigner remittance transactions.',
        inputLabel: 'Foreigner Keywords',
        valueColumn: 'Foreigner Keywords',
        placeholder: 'Enter one or more keywords (one per line)',
        paginationInfo: 'Showing 1 to 10 of 54 entries',
        sampleRows: [
          { id: 41, value: 'FOREIGN INCOME', addedBy: '', date: '7/14/2022 11:20:00 AM' },
          { id: 42, value: 'EXPATRIATE', addedBy: '', date: '7/15/2022 2:45:30 PM' },
          { id: 43, value: 'NON-RESIDENT', addedBy: '', date: '7/16/2022 8:00:12 AM' },
        ],
      }),
  },
  {
    slug: 'company-keyword',
    file: 'config-company-keyword.html',
    dataPage: 'config-company-keyword',
    title: 'Company Keyword - RMS',
    content: () =>
      buildKeywordPage({
        id: 'cfgCompanyKw',
        title: 'Company Keyword',
        desc: 'Configure keywords used to identify company and corporate remittance transactions.',
        inputLabel: 'Company Keywords',
        valueColumn: 'Company Keywords',
        placeholder: 'Enter one or more keywords (one per line)',
        withMeta: false,
        paginationInfo: 'Showing 1 to 50 of 687 entries',
        sampleRows: [
          { id: 1, value: 'CONSULTING FIRM' },
          { id: 2, value: 'ALUMINIUM' },
          { id: 3, value: 'ASSOCIATES' },
          { id: 4, value: 'AUTO' },
          { id: 5, value: 'TRADING' },
          { id: 6, value: 'ENTERPRISE' },
        ],
      }),
  },
];

const shellPath = path.join(root, 'manual-file-upload.html');
let shell = fs.readFileSync(shellPath, 'utf8');

for (const page of pages) {
  let html = shell;

  html = html.replace(/<title>[^<]+<\/title>/, `<title>${page.title}</title>`);
  html = html.replace(/data-page="[^"]+"/, `data-page="${page.dataPage}"`);
  html = html.replace(
    /<link rel="stylesheet" href="assets\/css\/manual-file\.css" \/>/,
    '<link rel="stylesheet" href="assets/css/manual-file.css" />\n    <link rel="stylesheet" href="assets/css/configuration.css" />'
  );

  html = deactivateOtherNav(html);
  html = replaceConfigNav(html, page.slug);

  const manualFileNavInactive = `          <!-- Manual File -->
          <a href="#" class="nav-item nav-has-children" data-subnav-id="nav-manual-file-sub">
            <i class="bi bi-file-earmark-arrow-up nav-item-icon" aria-hidden="true"></i>
            <span>Manual File</span>
            <button class="nav-expand-btn" type="button" aria-label="Toggle Manual File sub menu"><i class="bi bi-chevron-right"></i></button>
          </a>
          <div class="sidebar-subnav" id="nav-manual-file-sub">
            <a href="manual-file-upload.html" class="subnav-item">File Upload</a>
            <a href="manual-file-authorized.html" class="subnav-item">File Authorized</a>
            <a href="manual-file-failed-process.html" class="subnav-item">Failed Process</a>
            <a href="manual-file-bkash-recon.html" class="subnav-item">Bkash Direct Reconciliation Process</a>
            <a href="manual-file-nagad-recon.html" class="subnav-item">Nagad Direct Reconciliation Process</a>
          </div>`;
  html = html.replace(
    /          <!-- Manual File -->[\s\S]*?<div class="sidebar-subnav[^"]*" id="nav-manual-file-sub">[\s\S]*?<\/div>/,
    manualFileNavInactive
  );

  const contentRe = /\s*<div class="beftn-module-page[^"]*">[\s\S]*?<\/div>\s*\n\s*<\/main>/;
  html = html.replace(contentRe, `\n${page.content()}\n\n      </main>`);
  html = html.replace(/\s*<script src="assets\/js\/beftn-page\.js"><\/script>/, '');

  fs.writeFileSync(path.join(root, page.file), html, 'utf8');
  console.log('Wrote', page.file);
}
