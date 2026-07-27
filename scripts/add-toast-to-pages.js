const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const cssLink = '    <link rel="stylesheet" href="assets/css/toast.css" />';
const jsScript = '    <script src="assets/js/toast.js"></script>';

const files = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('.html') && f !== 'login.html');

for (const file of files) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('dashboard-page') && !html.includes('dashboard-wrapper')) {
    continue;
  }

  let changed = false;

  if (!html.includes('toast.css')) {
    if (html.includes('action-modal.css')) {
      html = html.replace(
        /<link rel="stylesheet" href="assets\/css\/action-modal\.css" \/>/,
        cssLink + '\n    <link rel="stylesheet" href="assets/css/action-modal.css" />'
      );
    } else if (html.includes('assets/css/dashboard.css')) {
      html = html.replace(
        /<link rel="stylesheet" href="assets\/css\/dashboard\.css" \/>/,
        '<link rel="stylesheet" href="assets/css/dashboard.css" />\n' + cssLink
      );
    }
    changed = true;
  }

  if (!html.includes('toast.js')) {
    html = html.replace(
      /<script src="assets\/js\/main\.js"><\/script>/,
      '<script src="assets/js/main.js"></script>\n' + jsScript
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Updated:', file);
  }
}
