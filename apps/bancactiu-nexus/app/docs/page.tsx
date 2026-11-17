'use client';

import React from 'react';
import Link from 'next/link';
import {
  RadialAuraBackground,
  GlassCard,
  GlassButton,
  GlassBadge,
  GlassHeader
} from '@bancactiu/ui-glass';
import {
  FileText,
  Download,
  ShieldCheck,
  Bot,
  Presentation,
  Video,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { KenzoAssistant } from '@/components/kenzo/KenzoAssistant';

const documents = [
  {
    id: 'superadmin',
    title: "Manual d'Operació del Superadministrador",
    badge: 'Nexus 3.0 · Governança',
    badgeVariant: 'purple' as const,
    icon: <ShieldCheck className="w-7 h-7 text-purple-400" />,
    gradient: 'from-purple-600/30 to-indigo-600/30',
    border: 'border-purple-500/30',
    desc: "Guia completa de control d'infraestructura, alta jeràrquica descentralitzada de centres sanitaris i educatius de Catalunya (IETI), gestió d'usuaris vinculada a Marc Cachinero Baranda (DNI 48956602Z) i Administrador, i execució de simulacions de càrrega massiva.",
    pdfUrl: '/docs/MANUAL_SUPERADMIN_NEXUS_2.0.pdf',
    size: '196 KB',
    version: 'v3.0-PROD',
    highlights: [
      'Vinculació oficial SuperAdmin DNI 48956602Z (Marc Cachinero Baranda)',
      'Protocol d’activació de contrasenya obligatòria docent (Administrador)',
      'Alta descentralitzada de centres i CAPS (Institut Esteve Terrades i Illa)',
      'Laboratori de càrrega GAPIC & IETI (1-3 anys)'
    ]
  },
  {
    id: 'seguretat',
    title: 'Manual de Ciberseguretat, Autenticació i ENS',
    badge: 'ENS Nivell Alt · Zero-Trust',
    badgeVariant: 'blue' as const,
    icon: <ShieldCheck className="w-7 h-7 text-cyan-400" />,
    gradient: 'from-blue-600/30 to-cyan-600/30',
    border: 'border-cyan-500/30',
    desc: 'Arquitectura de seguretat militar, compliment rigorós de l’Esquema Nacional de Seguretat (RD 311/2022), traçabilitat forense immutable, xifrat AES-256-GCM i rutes d’enllaç híbrides segures.',
    pdfUrl: '/docs/MANUAL_SEGURETAT_ENS_2.0.pdf',
    size: '202 KB',
    version: 'v3.0-PROD',
    highlights: [
      'Compliment ENS Nivell Alt i RGPD Art. 9',
      'Xifratge AES-256-GCM i canals TLS 1.3 mTLS',
      'Tokenització de CIP sanitari i DNI',
      'Enrutament híbrid Local vs Vercel Cloud'
    ]
  },
  {
    id: 'kenzo',
    title: 'Manual de l’Assistent Intel·ligent Kenzo',
    badge: 'IA Cognitiva · Avatar Adaptatiu',
    badgeVariant: 'emerald' as const,
    icon: <Bot className="w-7 h-7 text-emerald-400" />,
    gradient: 'from-emerald-600/30 to-teal-600/30',
    border: 'border-emerald-500/30',
    desc: 'Operació de l’assistent cognitiu institucional amb selector interactiu de tres avatars (Kenzo, Kenza, Kenz Core), persistència de preferències de sessió i assistència activa al Superadministrador.',
    pdfUrl: '/docs/MANUAL_ASSISTENT_KENZO_2.0.pdf',
    size: '165 KB',
    version: 'v3.0-PROD',
    highlights: [
      'Selector interactiu Kenzo / Kenza / Kenz Core',
      'Persistència a localStorage i perfil Superadmin',
      'Assistent de gestió de recursos sanitaris',
      'Interfície mòbil i d’escriptori glassmorphism'
    ]
  },
  {
    id: 'presentacio',
    title: 'Dossier Institucional de Presentació Oficial',
    badge: 'Slide Deck · Institucional',
    badgeVariant: 'amber' as const,
    icon: <Presentation className="w-7 h-7 text-amber-400" />,
    gradient: 'from-amber-600/30 to-orange-600/30',
    border: 'border-amber-500/30',
    desc: 'Dossier executiu de 10 diapositives d’alt impacte per a reunions institucionals davant la Generalitat de Catalunya, CatSalut, Ajuntament de Cornellà i Creu Roja.',
    pdfUrl: '/docs/PRESENTACIO_OFICIAL_BANCACTIU_2.0.pdf',
    size: '199 KB',
    version: 'v3.0-PROD',
    highlights: [
      '10 diapositives d’estructura executiva',
      'Mètriques d’impacte i escalabilitat a Catalunya',
      'Interoperabilitat sanitària i social',
      'Model d’implantació i retorn social de la inversió'
    ]
  },
  {
    id: 'video',
    title: 'Guions de Vídeo Corporatiu amb Veu Neural',
    badge: 'Veu Neural · 120s Audiovisual',
    badgeVariant: 'purple' as const,
    icon: <Video className="w-7 h-7 text-pink-400" />,
    gradient: 'from-pink-600/30 to-purple-600/30',
    border: 'border-pink-500/30',
    desc: 'Guions oficials de producció audiovisual de 2 minuts (120 segons) amb instruccions tècniques de realització, pauses SSML i versions completes en Català i Castellà.',
    pdfUrl: '/docs/GUIONS_VIDEO_VEU_NEURAL_2.0.pdf',
    size: '175 KB',
    version: 'v3.0-PROD',
    highlights: [
      'Temporització precisa per blocs de 0 a 120s',
      'Marcadors d’entonació i pauses SSML per a TTS',
      'Descripció visual pla a pla (Motion Graphics)',
      'Bilingüe: Versió en Català i Castellà'
    ]
  },
  {
    id: 'multi-tenant',
    title: 'Manual de Multi-Tenant Dinàmic i White-Labeling',
    badge: 'Context IP & Host · Edge',
    badgeVariant: 'blue' as const,
    icon: <Sparkles className="w-7 h-7 text-cyan-400" />,
    gradient: 'from-blue-600/30 to-indigo-600/30',
    border: 'border-blue-500/30',
    desc: 'Arquitectura d’adaptació automàtica de marca i context per IP corporativa i subdomini HTTP, eliminació de hardcoding institucional i compliment Zero-Trust d’auditoria.',
    pdfUrl: '/docs/MANUAL_MULTI_TENANT_IP_CONTEXT_2.0.pdf',
    size: '180 KB',
    version: 'v3.0-PROD',
    highlights: [
      'Detecció automàtica de rangs CIDR a Edge Middleware',
      'White-Labeling contextual sense referències hardcoded',
      'Cookie segura bancactiu_tenant i capçaleres x-tenant-*',
      'Compatibilitat amb sandbox de seguretat i paràmetre ?tenant='
    ]
  }
];

export default function DocsPage() {
  return (
    <RadialAuraBackground variant="nexus">
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
        {/* Capçalera */}
        <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link href="/">
              <GlassButton variant="secondary" size="sm" icon={<ArrowLeft size={16} />}>
                Tornar al Nexus
              </GlassButton>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Centre de Documentació Oficial i PDFs Executius
                </h1>
                <GlassBadge variant="blue">Release 3.0</GlassBadge>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                BancActiu 3.0 Enterprise · Generalitat de Catalunya & Salut / Benestar
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GlassBadge variant="purple">Superadmin DNI: 48956602Z</GlassBadge>
            <GlassBadge variant="emerald">ENS Nivell Alt</GlassBadge>
          </div>
        </header>

        {/* Banner Informatiu Glassmorphism */}
        <div className="mb-8">
          <GlassCard variant="glow" glowColor="cyan" className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">
                    Descàrrega d'Expedients i Manuals en Format PDF Corporatiu Vectorial (A4)
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Tots els documents estan degudament maquetats sota els estàndards visuals corporatius de la Generalitat de Catalunya i BancActiu 3.0, amb disseny glassmorphism d’alta fidelitat i preparats per a impressió oficial o revisió d’auditoria.
                </p>
              </div>
              <a
                href="/docs/MANUAL_SUPERADMIN_NEXUS_2.0.pdf"
                download
                className="shrink-0"
              >
                <GlassButton variant="primary" icon={<Download size={16} />}>
                  Descarregar Manual SuperAdmin
                </GlassButton>
              </a>
            </div>
          </GlassCard>
        </div>

        {/* Llistat de Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {documents.map((doc) => (
            <GlassCard
              key={doc.id}
              variant="interactive"
              className={`p-6 flex flex-col justify-between border ${doc.border} bg-gradient-to-br ${doc.gradient}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/15 shadow-xl">
                    {doc.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <GlassBadge variant={doc.badgeVariant}>{doc.badge}</GlassBadge>
                    <span className="text-[11px] text-slate-400 font-mono">{doc.version} · {doc.size}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                  {doc.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {doc.desc}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 mb-6 bg-slate-950/40 p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                    Aspectes Clau
                  </span>
                  {doc.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botons d'acció */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>Obrir al navegador</span>
                </a>
                <a
                  href={doc.pdfUrl}
                  download
                >
                  <GlassButton variant="primary" size="sm" icon={<Download size={14} />}>
                    Descarregar PDF
                  </GlassButton>
                </a>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-6 border-t border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div>
            © 2026 BancActiu 2.0 Enterprise · Departament de Salut & Drets Socials
          </div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <span className="text-emerald-400 font-medium">ENS Nivell Alt Verificat</span>
            <span>·</span>
            <span className="text-purple-400 font-medium">SuperAdmin Marc Cachinero (48956602Z)</span>
          </div>
        </footer>
      </div>

      {/* Assistent Flotant Kenzo */}
      <KenzoAssistant />
    </RadialAuraBackground>
  );
}
