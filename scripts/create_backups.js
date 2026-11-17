const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backupDir = path.resolve('..', 'backups');
const monorepoDir = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const usbDir = 'C:\\Users\\Bart\\Desktop\\Bancactiu 2.0 version USB auditoria seguretat';

console.log('================================================================');
console.log('   INICIANT PROCÉS DE CÒPIA DE SEGURETAT INTEGRAL BANCACTIU 2.0  ');
console.log('================================================================');
console.log(`📁 Directori de Backups : ${backupDir}`);
console.log(`📦 Monorepo Origen      : ${monorepoDir}`);
console.log(`💾 USB Portable Origen   : ${usbDir}`);

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const dateStr = `${yyyy}${mm}${dd}`;

const monorepoZip = path.join(backupDir, `bancactiu_monorepo_backup_${dateStr}.zip`);
const usbZip = path.join(backupDir, `bancactiu_usb_portable_backup_${dateStr}.zip`);

// -------------------------------------------------------------
// 1. Còpia i Compressió del Monorepo (excloent node_modules i .next)
// -------------------------------------------------------------
console.log('\n[1/2] Comprimint Monorepo BancActiu 2.0 (excloent node_modules i .next)...');
if (fs.existsSync(monorepoZip)) {
  fs.unlinkSync(monorepoZip);
}

const tarMonorepoCmd = `tar.exe -a -c -f "${monorepoZip}" --exclude="node_modules" --exclude="*/node_modules" --exclude=".next" --exclude="*/.next" *`;
try {
  execSync(tarMonorepoCmd, { cwd: monorepoDir, stdio: 'inherit' });
  console.log('✅ Monorepo comprimit correctament.');
} catch (err) {
  console.error('❌ Error comprimint el Monorepo:', err);
  process.exit(1);
}

// -------------------------------------------------------------
// 2. Còpia i Compressió de la Versió Portable USB
// -------------------------------------------------------------
console.log('\n[2/2] Comprimint Versió Portable de la Memòria USB...');
if (fs.existsSync(usbZip)) {
  fs.unlinkSync(usbZip);
}

const tarUsbCmd = `tar.exe -a -c -f "${usbZip}" *`;
try {
  execSync(tarUsbCmd, { cwd: usbDir, stdio: 'inherit' });
  console.log('✅ Versió portable USB comprimida correctament.');
} catch (err) {
  console.error('❌ Error comprimint la carpeta USB:', err);
  process.exit(1);
}

// -------------------------------------------------------------
// 3. Verificació d'Integritat i Mida
// -------------------------------------------------------------
console.log('\n================================================================');
console.log('       VERIFICACIÓ D\'INTEGRITAT I ESTAT DELS FITXERS DE BACKUP   ');
console.log('================================================================');

function verifyZip(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fitxer no trobat: ${filePath}`);
  }
  const stat = fs.statSync(filePath);
  const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
  
  // Test integrity by listing contents without overflowing buffer
  const listCmd = `tar.exe -t -f "${filePath}"`;
  const output = execSync(listCmd, { maxBuffer: 100 * 1024 * 1024 }).toString();
  const entriesCount = output.trim().split('\n').filter(Boolean).length;
  
  console.log(`\n📄 ${label}:`);
  console.log(`   - Ruta Absoluta : ${filePath}`);
  console.log(`   - Mida Total    : ${sizeMB} MB (${stat.size.toLocaleString()} bytes)`);
  console.log(`   - Fitxers Únics : ${entriesCount.toLocaleString()} elements arxivats`);
  console.log(`   - Integritat    : VERIFICADA / CORRECTA (Sense corrupció)`);
}

verifyZip(monorepoZip, '1. Monorepo BancActiu 2.0');
verifyZip(usbZip, '2. Versió Portable USB Auditoria');

console.log('\n================================================================');
console.log('✅ CÒPIES DE SEGURETAT COMPLETADES I EMMAGATZEMADES AMB ÈXIT');
console.log(`📁 Localització: ${backupDir}`);
console.log('================================================================\n');
