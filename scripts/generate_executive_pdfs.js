const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const PDF_OUT_DIR = path.join(DOCS_DIR, 'pdf');
const PUBLIC_DOCS_DIR = path.join(ROOT_DIR, 'apps', 'bancactiu-nexus', 'public', 'docs');

if (!fs.existsSync(PDF_OUT_DIR)) fs.mkdirSync(PDF_OUT_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DOCS_DIR)) fs.mkdirSync(PUBLIC_DOCS_DIR, { recursive: true });

function markdownToSimpleHtml(title, mdContent, subtitle = "Generalitat de Catalunya · BancActiu 3.0") {
  // Simple markdown to HTML conversion with corporate glassmorphism styling
  const lines = mdContent.split('\n');
  let html = `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      font-size: 13px;
      margin: 0;
      padding: 0;
    }
    .header-banner {
      border-bottom: 3px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: bold;
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }
    h1 {
      font-size: 24px;
      color: #0f172a;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 8px;
    }
    h2 {
      font-size: 16px;
      color: #1e3a8a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 14px;
      color: #0f172a;
      margin-top: 16px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    blockquote {
      background: #f8fafc;
      border-left: 4px solid #38bdf8;
      margin: 12px 0;
      padding: 10px 14px;
      color: #334155;
      font-style: italic;
      border-radius: 0 8px 8px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 11px;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      background: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      color: #be185d;
    }
    ul, ol {
      margin: 8px 0 14px 20px;
      padding: 0;
    }
    li {
      margin-bottom: 4px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
    }
    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div>
      <div class="brand-title">Generalitat de Catalunya · Departament de Salut</div>
      <div class="brand-sub">${subtitle}</div>
    </div>
    <div class="badge">ENS NIVELL ALT CERTIFICAT</div>
  </div>
`;

  let inTable = false;
  let inList = false;

  for (let rawLine of lines) {
    let line = rawLine.trim();

    if (line.startsWith('# ')) {
      html += `<h1>${line.replace('# ', '')}</h1>\n`;
      continue;
    }
    if (line.startsWith('## ')) {
      html += `<h2>${line.replace('## ', '')}</h2>\n`;
      continue;
    }
    if (line.startsWith('### ')) {
      html += `<h3>${line.replace('### ', '')}</h3>\n`;
      continue;
    }
    if (line.startsWith('> ')) {
      html += `<blockquote>${line.replace('> ', '').replace(/&middot;/g, '·')}</blockquote>\n`;
      continue;
    }
    if (line.startsWith('---')) {
      html += `<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 18px 0;" />\n`;
      continue;
    }

    // Table detection
    if (line.startsWith('|')) {
      const cells = line.split('|').filter(c => c.trim() !== '');
      if (!inTable) {
        inTable = true;
        html += `<table><thead><tr>`;
        for (let cell of cells) {
          html += `<th>${cell.trim()}</th>`;
        }
        html += `</tr></thead><tbody>\n`;
      } else if (line.includes('---')) {
        // Separator line, ignore
        continue;
      } else {
        html += `<tr>`;
        for (let cell of cells) {
          let cHtml = cell.trim()
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
          html += `<td>${cHtml}</td>`;
        }
        html += `</tr>\n`;
      }
      continue;
    } else if (inTable) {
      inTable = false;
      html += `</tbody></table>\n`;
    }

    // List item
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        inList = true;
        html += `<ul>\n`;
      }
      let content = line.substring(2)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
      html += `<li>${content}</li>\n`;
      continue;
    } else if (inList && !line.startsWith('  * ') && !line.startsWith('  - ')) {
      inList = false;
      html += `</ul>\n`;
    }

    if (line.length > 0) {
      let pContent = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
      html += `<p>${pContent}</p>\n`;
    }
  }

  if (inTable) html += `</tbody></table>\n`;
  if (inList) html += `</ul>\n`;

  html += `
  <div class="footer">
    BancActiu 3.0 &middot; Ecosistema Descentralitzat de Salut i Benestar &middot; DNI SuperAdmin: 48956602Z (Marc Cachinero) &middot; Producció Oficial Vercel Cloud
  </div>
</body>
</html>`;

  return html;
}

const docsToCompile = [
  {
    src: 'MANUAL_SUPERADMIN_NEXUS.md',
    title: "Manual d'Operació del Superadministrador - BancActiu 3.0",
    outPdf: 'MANUAL_SUPERADMIN_NEXUS_2.0.pdf'
  },
  {
    src: 'MANUAL_SEGURETAT_AUTENTICACIO.md',
    title: "Manual de Ciberseguretat, Autenticació i Protecció de Dades - BancActiu 3.0",
    outPdf: 'MANUAL_SEGURETAT_ENS_2.0.pdf'
  },
  {
    src: 'MANUAL_ASSISTENT_KENZO.md',
    title: "Manual de l'Assistent Intel·ligent Kenzo/Kenza/Kenz Core - BancActiu 3.0",
    outPdf: 'MANUAL_ASSISTENT_KENZO_2.0.pdf'
  },
  {
    src: 'PRESENTACIO_OFICIAL_BANCACTIU_2.0.md',
    title: "Dossier de Presentació Oficial - BancActiu 3.0 Enterprise",
    outPdf: 'PRESENTACIO_OFICIAL_BANCACTIU_2.0.pdf'
  },
  {
    src: 'GUIONS_VIDEO_VEU_NEURAL.md',
    title: "Guions Oficials de Vídeo Corporatiu amb Veu Neural - BancActiu 3.0",
    outPdf: 'GUIONS_VIDEO_VEU_NEURAL_2.0.pdf'
  },
  {
    src: 'MANUAL_MULTI_TENANT_IP_CONTEXT.md',
    title: "Manual d'Arquitectura Multi-Tenant Contextual i White-Labeling - BancActiu 3.0",
    outPdf: 'MANUAL_MULTI_TENANT_IP_CONTEXT_2.0.pdf'
  }
];

async function main() {
  console.log("Iniciant generació corporativa de PDFs executius...");

  for (const doc of docsToCompile) {
    const srcPath = path.join(DOCS_DIR, doc.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Fitxer no trobat: ${srcPath}`);
      continue;
    }

    const mdContent = fs.readFileSync(srcPath, 'utf-8');
    const htmlContent = markdownToSimpleHtml(doc.title, mdContent);
    const tempHtmlPath = path.join(PDF_OUT_DIR, `${path.basename(doc.src, '.md')}.html`);
    fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

    const destPdfDocs = path.join(PDF_OUT_DIR, doc.outPdf);
    const destPdfPublic = path.join(PUBLIC_DOCS_DIR, doc.outPdf);

    console.log(`Renderitzant PDF per a: ${doc.src} -> ${doc.outPdf}`);
    try {
      execSync(`"${EDGE_PATH}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${destPdfDocs}" "${tempHtmlPath}"`, {
        stdio: 'inherit'
      });
      // Copiar a public/docs per a descàrrega directa des de l'app web
      fs.copyFileSync(destPdfDocs, destPdfPublic);
      console.log(`[OK] Creat: ${destPdfDocs} (${fs.statSync(destPdfDocs).size} bytes)`);
    } catch (err) {
      console.error(`Error generant PDF per a ${doc.src}:`, err.message);
    }
  }

  console.log("Generació de PDFs completada amb èxit!");
}

main();
