const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const modules = [
  { key: 'npsb', label: 'NPSB', navId: 'nav-npsb-sub', icon: 'bi-credit-card', idPrefix: 'npsb' },
  { key: 'mtb-transfer', label: 'MTB A/C Transfer', navId: 'nav-mtb-transfer-sub', icon: 'bi-wallet2', idPrefix: 'mtbtransfer' },
  { key: 'wallet', label: 'Wallet', navId: 'nav-wallet-sub', icon: 'bi-phone', idPrefix: 'wallet' },
];

const pageTypes = [
  { slug: 'failed-release', beftn: 'beftn-failed-release.html' },
  { slug: 'callback-retry', beftn: 'beftn-callback-retry.html' },
  { slug: 'cancellation', beftn: 'beftn-cancellation.html' },
  { slug: 'status-change', beftn: 'beftn-status-change.html' },
];

const moduleNavBlocks = {
  beftn: {
    parent: 'nav-beftn-sub',
    label: 'BEFTN',
    icon: 'bi-bank',
    links: [
      { href: '#', text: 'Processing Queue' },
      { href: 'beftn-failed-release.html', text: 'Failed Release' },
      { href: 'beftn-callback-retry.html', text: 'Callback Retry' },
      { href: 'beftn-cancellation.html', text: 'Cancellation' },
      { href: 'beftn-status-change.html', text: 'Status Change' },
    ],
  },
  npsb: {
    parent: 'nav-npsb-sub',
    label: 'NPSB',
    icon: 'bi-credit-card',
    links: [
      { href: '#', text: 'Processing Queue' },
      { href: 'npsb-failed-release.html', text: 'Failed Release' },
      { href: 'npsb-callback-retry.html', text: 'Callback Retry' },
      { href: 'npsb-cancellation.html', text: 'Cancellation' },
      { href: 'npsb-status-change.html', text: 'Status Change' },
    ],
  },
  'mtb-transfer': {
    parent: 'nav-mtb-transfer-sub',
    label: 'MTB A/C Transfer',
    icon: 'bi-wallet2',
    links: [
      { href: '#', text: 'Processing Queue' },
      { href: 'mtb-transfer-failed-release.html', text: 'Failed Release' },
      { href: 'mtb-transfer-callback-retry.html', text: 'Callback Retry' },
      { href: 'mtb-transfer-cancellation.html', text: 'Cancellation' },
      { href: 'mtb-transfer-status-change.html', text: 'Status Change' },
    ],
  },
  wallet: {
    parent: 'nav-wallet-sub',
    label: 'Wallet',
    icon: 'bi-phone',
    links: [
      { href: '#', text: 'Processing Queue' },
      { href: 'wallet-failed-release.html', text: 'Failed Release' },
      { href: 'wallet-callback-retry.html', text: 'Callback Retry' },
      { href: 'wallet-cancellation.html', text: 'Cancellation' },
      { href: 'wallet-status-change.html', text: 'Status Change' },
    ],
  },
};

function renderModuleNav(moduleKey, activeSlug, currentModuleKey) {
  const cfg = moduleNavBlocks[moduleKey];
  const isModuleActive = moduleKey === currentModuleKey;
  const parentClass = isModuleActive
    ? 'nav-item nav-has-children active nav-open'
    : 'nav-item nav-has-children';
  const subClass = isModuleActive ? 'sidebar-subnav subnav-open' : 'sidebar-subnav';
  const aria = isModuleActive ? ' aria-expanded="true"' : '';

  const linksHtml = cfg.links
    .map((link) => {
      let isActiveLink = false;
      if (link.href.endsWith('.html')) {
        const fileSlug = link.href.replace(`${moduleKey}-`, '').replace('.html', '');
        isActiveLink = isModuleActive && fileSlug === activeSlug;
      }
      const cls = isActiveLink ? 'subnav-item active' : 'subnav-item';
      return `            <a href="${link.href}" class="${cls}">${link.text}</a>`;
    })
    .join('\n');

  return `          <!-- ${cfg.label} -->
          <a href="#" class="${parentClass}" data-subnav-id="${cfg.parent}"${aria}>
            <i class="bi ${cfg.icon} nav-item-icon" aria-hidden="true"></i>
            <span>${cfg.label}</span>
            <button class="nav-expand-btn" type="button" aria-label="Toggle ${cfg.label} sub menu"><i class="bi bi-chevron-right"></i></button>
          </a>
          <div class="${subClass}" id="${cfg.parent}">
${linksHtml}
          </div>`;
}

function fixNavSection(html, currentModuleKey, activeSlug) {
  const start = html.indexOf('          <!-- BEFTN -->');
  const end = html.indexOf('          <!-- Manual File -->');
  const before = html.slice(0, start);
  const after = html.slice(end);

  const navHtml = ['beftn', 'npsb', 'mtb-transfer', 'wallet']
    .map((key) => renderModuleNav(key, activeSlug, currentModuleKey))
    .join('\n\n');

  return before + navHtml + '\n\n' + after;
}

function prefixFormIds(html, idPrefix, slug) {
  const idRoots = {
    'failed-release': ['failedreleasepri', 'failedreleaseinc'],
    'callback-retry': ['callbackretrypri', 'callbackretryinc'],
    cancellation: ['cancellationpri', 'cancellationinc'],
    'status-change': ['statuschangepri', 'statuschangeinc'],
  };
  let out = html;
  for (const root of idRoots[slug]) {
    const re = new RegExp(`id="${root}`, 'g');
    out = out.replace(re, `id="${idPrefix}${root}`);
    const reFor = new RegExp(`for="${root}`, 'g');
    out = out.replace(reFor, `for="${idPrefix}${root}`);
  }
  return out;
}

for (const mod of modules) {
  for (const page of pageTypes) {
    const srcPath = path.join(root, page.beftn);
    let html = fs.readFileSync(srcPath, 'utf8');

    html = html.replace(/data-page="beftn-/g, `data-page="${mod.key}-`);
    html = html.replace(/<title>BEFTN /g, `<title>${mod.label} `);
    html = html.replace(/beftn-module-breadcrumb">BEFTN /g, `beftn-module-breadcrumb">${mod.label} `);
    html = html.replace(/beftn-module-title">BEFTN —/g, `beftn-module-title">${mod.label} —`);
    html = html.replace(/(beftn-module-desc">[^<]*?)BEFTN/g, `$1${mod.label}`);

    html = fixNavSection(html, mod.key, page.slug);
    html = prefixFormIds(html, mod.idPrefix, page.slug);

    const outFile = `${mod.key}-${page.slug}.html`;
    fs.writeFileSync(path.join(root, outFile), html, 'utf8');
    console.log('Wrote', outFile);
  }
}
