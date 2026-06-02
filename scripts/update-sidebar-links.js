const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const manualFileSubnav = `
            <a href="manual-file-upload.html" class="subnav-item">File Upload</a>
            <a href="manual-file-authorized.html" class="subnav-item">File Authorized</a>
            <a href="manual-file-failed-process.html" class="subnav-item">Failed Process</a>
            <a href="manual-file-bkash-recon.html" class="subnav-item">Bkash Direct Reconciliation Process</a>
            <a href="manual-file-nagad-recon.html" class="subnav-item">Nagad Direct Reconciliation Process</a>`;

const subnavUpdates = [
  {
    id: 'nav-npsb-sub',
    inner: `
            <a href="#" class="subnav-item">Processing Queue</a>
            <a href="npsb-failed-release.html" class="subnav-item">Failed Release</a>
            <a href="npsb-callback-retry.html" class="subnav-item">Callback Retry</a>
            <a href="npsb-cancellation.html" class="subnav-item">Cancellation</a>
            <a href="npsb-status-change.html" class="subnav-item">Status Change</a>`,
  },
  {
    id: 'nav-mtb-transfer-sub',
    inner: `
            <a href="#" class="subnav-item">Processing Queue</a>
            <a href="mtb-transfer-failed-release.html" class="subnav-item">Failed Release</a>
            <a href="mtb-transfer-callback-retry.html" class="subnav-item">Callback Retry</a>
            <a href="mtb-transfer-cancellation.html" class="subnav-item">Cancellation</a>
            <a href="mtb-transfer-status-change.html" class="subnav-item">Status Change</a>`,
  },
  {
    id: 'nav-wallet-sub',
    inner: `
            <a href="#" class="subnav-item">Processing Queue</a>
            <a href="wallet-failed-release.html" class="subnav-item">Failed Release</a>
            <a href="wallet-callback-retry.html" class="subnav-item">Callback Retry</a>
            <a href="wallet-cancellation.html" class="subnav-item">Cancellation</a>
            <a href="wallet-status-change.html" class="subnav-item">Status Change</a>`,
  },
  {
    id: 'nav-manual-file-sub',
    inner: manualFileSubnav,
  },
];

function updateSubnav(html, id, inner) {
  const re = new RegExp(
    `(<div class="sidebar-subnav[^"]*" id="${id}">)[\\s\\S]*?(</div>)`,
    'm'
  );
  return html.replace(re, `$1${inner}\n          $2`);
}

const files = fs.readdirSync(root).filter((f) => f.endsWith('.html') && f !== 'login.html');

for (const file of files) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('nav-npsb-sub')) continue;

  let updated = html;
  for (const { id, inner } of subnavUpdates) {
    updated = updateSubnav(updated, id, inner);
  }

  if (updated !== html) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Updated:', file);
  }
}
