const fs = require('fs');
const path = require('path');

function copyDirFiles(srcDir, destDir, extFilter) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const files = fs.readdirSync(srcDir);
  for (const f of files) {
    if (!extFilter || f.endsWith(extFilter)) {
      const srcFile = path.join(srcDir, f);
      const destFile = path.join(destDir, f);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }
}

const rootDir = 'C:\\Users\\Bart\\Desktop\\PROJECTE_ADMINISTRATIU_SANITARI\\Projecte_amb_IA_avançada\\BancActiu_2.0_Separacion_Entidades';
const usbDir = 'C:\\Users\\Bart\\Desktop\\Bancactiu 2.0 version USB auditoria seguretat';

// 1. Copiar PDFs a public/docs/ i usb docs_audit/pdf/
copyDirFiles(path.join(rootDir, 'docs', 'pdf'), path.join(rootDir, 'apps', 'bancactiu-nexus', 'public', 'docs'), '.pdf');
copyDirFiles(path.join(rootDir, 'docs', 'pdf'), path.join(usbDir, 'docs_audit', 'pdf'), '.pdf');

// 2. Copiar Markdown a usb docs_audit/
copyDirFiles(path.join(rootDir, 'docs'), path.join(usbDir, 'docs_audit'), '.md');

console.log('Synchronized all PDFs and Markdown docs cleanly.');
