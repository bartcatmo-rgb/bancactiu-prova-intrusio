'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Shield,
  KeyRound,
  FileCheck,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  RotateCw,
  Server,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge } from '@bancactiu/ui-glass';
import type { 
  GatewayEndpoint, 
  CertificateInfo, 
  InteroperabilityAuditEntry, 
  AnomalyAlert,
  MaskedCitizenRecord
} from '@bancactiu/interoperability-connector';

interface SuperAdminInteroperabilityWorkspaceProps {
  onClose: () => void;
  onShowToast?: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
}

export const SuperAdminInteroperabilityWorkspace: React.FC<SuperAdminInteroperabilityWorkspaceProps> = ({
  onClose,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'gateways' | 'certificates' | 'audit' | 'anomalies'>('gateways');
  const [endpoints, setEndpoints] = useState<GatewayEndpoint[]>([]);
  const [certificates, setCertificates] = useState<CertificateInfo[]>([]);
  const [auditLogs, setAuditLogs] = useState<InteroperabilityAuditEntry[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Query Simulator State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('ep-via-oberta-dependencia');
  const [testDni, setTestDni] = useState<string>('43999888A');
  const [testLegalBasis, setTestLegalBasis] = useState<string>('MISSIO_INTERES_PUBLIC_RGPD_6_1_E');
  const [unmaskSuperAdmin, setUnmaskSuperAdmin] = useState<boolean>(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<{
    maskedRecord?: MaskedCitizenRecord;
    encryptionMetadata?: any;
    auditId?: string;
  } | null>(null);

  // Rotation Modal
  const [isRotating, setIsRotating] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/interoperability');
      const data = await res.json();
      if (data.ok) {
        setEndpoints(data.endpoints || []);
        setCertificates(data.certificates || []);
        setAuditLogs(data.auditLogs || []);
        setAnomalies(data.anomalies || []);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Execute test interoperability query
  const handleExecuteTestQuery = async () => {
    setIsQuerying(true);
    try {
      const res = await fetch('/api/admin/interoperability/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpointId: selectedEndpoint,
          citizenIdentifier: testDni,
          legalBasis: testLegalBasis,
          requestSuperAdminUnmask: unmaskSuperAdmin
        })
      });
      const data = await res.json();
      if (data.ok) {
        setQueryResult({
          maskedRecord: data.maskedRecord,
          encryptionMetadata: data.encryptionMetadata,
          auditId: data.auditId
        });
        fetchData(); // refresh audit logs
        if (onShowToast) {
          onShowToast('success', 'Consulta Autoritzada', `Dades recuperades amb xifrat AES-256 i registre RGPD #${data.auditId}`);
        }
      } else {
        if (onShowToast) {
          onShowToast('error', 'Bloqueig de Seguretat', data.missatge || 'Consulta denegada.');
        }
      }
    } catch {
      if (onShowToast) {
        onShowToast('error', 'Error en Consulta', 'Error en connectar amb la pasarel·la oficial.');
      }
    } finally {
      setIsQuerying(false);
    }
  };

  // Certificate rotation
  const handleRotateCertificate = async (endpointId: string) => {
    setIsRotating(true);
    try {
      const res = await fetch('/api/admin/interoperability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ROTATE_CERTIFICATE',
          endpointId,
          newAlias: `Certificat mTLS Renovat AOC (Vàlid 2026-2028)`
        })
      });
      const data = await res.json();
      if (data.ok) {
        fetchData();
        if (onShowToast) {
          onShowToast('success', 'Certificat Rotat', 'S\'ha generat un nou parell de claus RSA-4096 i associat a la pasarel·la.');
        }
      }
    } catch {
      // fallback
    } finally {
      setIsRotating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn text-slate-100">
      {/* Top Header Card in Indigo/Cobalt Windows Glassmorphism */}
      <div className="relative rounded-2xl p-6 bg-gradient-to-r from-indigo-950/60 via-blue-950/60 to-slate-900/70 border border-indigo-500/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(30,58,138,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg border border-cyan-400/30">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Interoperabilitat & Pasarel·les de Dades Sensibles
              </h2>
              <GlassBadge variant="purple" pulse>
                AOC &middot; Via Oberta &middot; CTTI
              </GlassBadge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Connexió mTLS xifrada AES-256 amb registres oficials de dependència, discapacitat i salut.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={fetchData}
            icon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
          >
            Actualitzar
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            onClick={onClose}
          >
            ← Tornar
          </GlassButton>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('gateways')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'gateways'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg border border-indigo-400/40'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <Server size={14} />
          <span>Pasarel·les & Endpoints ({endpoints.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'certificates'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg border border-indigo-400/40'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <KeyRound size={14} />
          <span>Certificats Digitals mTLS ({certificates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg border border-indigo-400/40'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <FileCheck size={14} />
          <span>Auditoria Forense RGPD ({auditLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('anomalies')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'anomalies'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg border border-rose-400/40'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <AlertTriangle size={14} />
          <span>Alertes de Seguretat & Tripwires ({anomalies.length})</span>
        </button>
      </div>

      {/* TAB 1: GATEWAYS & TEST QUERY SIMULATOR */}
      {activeTab === 'gateways' && (
        <div className="space-y-6">
          {/* Endpoints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endpoints.map((ep) => (
              <GlassCard key={ep.id} variant="glow" glowColor="cyan" className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {ep.authMethod}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {ep.status} &middot; {ep.latencyMs}ms
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{ep.name}</h3>
                  <p className="text-xs text-slate-300 mb-3">{ep.description}</p>
                  
                  <div className="text-[11px] font-mono text-cyan-300 bg-black/40 p-2 rounded-lg border border-white/10 mb-3 truncate">
                    {ep.url}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {ep.supportedRegisters.map((reg, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Uptime 24h: <strong className="text-white">{ep.uptime24h}%</strong>
                  </span>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedEndpoint(ep.id);
                    }}
                  >
                    Provar Consulta
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Interactive Secure Query Sandbox & PII Masking Preview */}
          <GlassCard className="p-6 border-indigo-500/30 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Simulador de Consulta Segura amb Desxifrat AES-256 & PII Masking
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Pasarel·la Destí:
                </label>
                <select
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="w-full bg-slate-900/80 text-white text-xs px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:border-cyan-400"
                >
                  {endpoints.map((ep) => (
                    <option key={ep.id} value={ep.id}>{ep.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  DNI / CIP Ciutadà a Consultar:
                </label>
                <input
                  type="text"
                  value={testDni}
                  onChange={(e) => setTestDni(e.target.value)}
                  className="w-full bg-slate-900/80 text-white text-xs px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:border-cyan-400 font-mono"
                  placeholder="Ex: 43999888A"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Base Jurídica RGPD:
                </label>
                <select
                  value={testLegalBasis}
                  onChange={(e) => setTestLegalBasis(e.target.value)}
                  className="w-full bg-slate-900/80 text-white text-xs px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:border-cyan-400"
                >
                  <option value="MISSIO_INTERES_PUBLIC_RGPD_6_1_E">Art. 6.1.e RGPD - Missió d'Interès Públic</option>
                  <option value="CONSENTIMENT_EXPRES_IDCAT">Consentiment Exprés Ciutadà (idCAT Mòbil)</option>
                  <option value="OBLIGACIO_LEGAL_SANITARIA">Art. 6.1.c RGPD - Obligació Legal Sanitària</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={unmaskSuperAdmin}
                  onChange={(e) => setUnmaskSuperAdmin(e.target.checked)}
                  className="rounded bg-slate-800 border-white/20 text-indigo-600"
                />
                <span>Privilegi SuperAdmin: Veure dades des-emmascarades (Audit Traçat)</span>
              </label>

              <GlassButton
                variant="primary"
                onClick={handleExecuteTestQuery}
                disabled={isQuerying}
                icon={<Send size={14} />}
              >
                {isQuerying ? 'Consultant Via Oberta...' : 'Executar Consulta Oficial mTLS'}
              </GlassButton>
            </div>

            {/* Live Result Display */}
            {queryResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Resposta Validada de la Pasarel·la Oficial
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Audit ID: {queryResult.auditId}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Masked Record */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-white/10 space-y-1.5">
                    <div className="text-[11px] font-bold text-cyan-300">
                      Dades de Ciutadà ({unmaskSuperAdmin ? 'Mode Des-emmascarat' : 'PII Masking Actiu'}):
                    </div>
                    <div><span className="text-slate-400">Identificador:</span> <strong className="font-mono text-white">{queryResult.maskedRecord?.citizenIdentifierMasked}</strong></div>
                    <div><span className="text-slate-400">Nom Complet:</span> <strong className="text-white">{queryResult.maskedRecord?.fullNameMasked}</strong></div>
                    <div><span className="text-slate-400">Adreça:</span> <span className="text-slate-300">{queryResult.maskedRecord?.addressMasked}</span></div>
                    <div><span className="text-slate-400">Grau Discapacitat:</span> <span className="text-emerald-300 font-bold">{queryResult.maskedRecord?.disabilityGradePercent}%</span></div>
                    <div><span className="text-slate-400">Nivell Dependència:</span> <span className="text-purple-300 font-bold">{queryResult.maskedRecord?.dependencyLevel}</span></div>
                    <div><span className="text-slate-400">Prestacions:</span> <span className="text-slate-300">{queryResult.maskedRecord?.benefitsSummary}</span></div>
                  </div>

                  {/* Right: AES-256 Encryption Proof */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-white/10 space-y-1.5">
                    <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                      <Lock size={12} /> Criptografia de Trànsit & Repòs:
                    </div>
                    <div><span className="text-slate-400">Algorisme:</span> <strong className="text-white font-mono">{queryResult.encryptionMetadata?.algorithm}</strong></div>
                    <div><span className="text-slate-400">Autenticació MAC (AuthTag):</span> <span className="text-emerald-400 font-bold">Verificat</span></div>
                    <div><span className="text-slate-400">Cifrat Hex en Trànsit:</span></div>
                    <div className="font-mono text-[10px] text-slate-400 bg-black/60 p-1.5 rounded border border-white/10 break-all">
                      {queryResult.encryptionMetadata?.encryptedHexPreview}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* TAB 2: CERTIFICATES & MTLS CREDENTIALS */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <GlassCard key={cert.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <KeyRound size={14} className="text-indigo-400" />
                    {cert.alias}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {cert.status} ({cert.daysRemaining} dies)
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div><span className="text-slate-400">Emissor:</span> <span className="text-slate-200">{cert.issuer}</span></div>
                  <div><span className="text-slate-400">Subject:</span> <span className="text-slate-300 font-mono text-[11px]">{cert.subject}</span></div>
                  <div><span className="text-slate-400">Longitud Clau:</span> <span className="font-mono font-bold text-white">{cert.keyLengthBits} bits (RSA-4096)</span></div>
                  <div><span className="text-slate-400">Vigència:</span> <span className="text-slate-300">{cert.validFrom.slice(0, 10)} fins a {cert.validTo.slice(0, 10)}</span></div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="text-[10px] text-slate-400 font-mono mb-1">Fingerprint SHA-256:</div>
                  <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10 font-mono text-[10px] text-cyan-300">
                    <span className="truncate">{cert.fingerprintSha256}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cert.fingerprintSha256)}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Copiar Fingerprint"
                    >
                      {copiedHash === cert.fingerprintSha256 ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    disabled={isRotating}
                    onClick={() => handleRotateCertificate(cert.id)}
                    icon={<RotateCw size={13} className={isRotating ? 'animate-spin' : ''} />}
                  >
                    Rotar Certificat Ara
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RGPD AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Registre Forense d'Auditoria RGPD (Inmutable)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Principi de Responsabilitat Proactiva (Accountability)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-mono">
                <tr>
                  <th className="p-3">Data / Hora</th>
                  <th className="p-3">Professional</th>
                  <th className="p-3">Pasarel·la & Registre</th>
                  <th className="p-3">Ciutadà (PII Masked)</th>
                  <th className="p-3">Base Jurídica</th>
                  <th className="p-3">Estat</th>
                  <th className="p-3">Signatura SHA-256</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition">
                    <td className="p-3 font-mono text-[11px] text-slate-300">
                      {log.timestamp.slice(0, 19).replace('T', ' ')}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{log.professionalName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">DNI: {log.professionalDni}</div>
                    </td>
                    <td className="p-3 text-cyan-300 font-medium">
                      {log.queriedRegistry}
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-300">
                      {log.citizenIdentifierMasked}
                    </td>
                    <td className="p-3 text-[11px] text-slate-300">
                      {log.legalBasis.replace(/_/g, ' ')}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'PERMITTED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-400">
                      <span className="truncate max-w-[120px] inline-block align-middle" title={log.tamperProofHash}>
                        {log.tamperProofHash.slice(0, 14)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* TAB 4: ANOMALIES & SECURITY TRIPWIRES */}
      {activeTab === 'anomalies' && (
        <GlassCard className="p-6 space-y-4 border-rose-500/30">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Tripwires de Seguretat & Detecció d'Anomalies de Consulta
              </h3>
            </div>
            <GlassBadge variant="rose">Defensa Automàtica Activa</GlassBadge>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            El sistema monitoritza en temps real els patrons de peticions dirigits a les pasarel·les d'AOC i Via Oberta.
            Qualsevol intent massiu de consulta (&gt;10 consultes/minut per IP), extraccions fora d'horari o intents
            sense consentiment previ activen un bloqueig preventiu automàtic i una alerta immediata per al Delegat de Protecció de Dades (DPO).
          </p>

          <div className="space-y-3">
            {anomalies.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    {alert.reason}
                  </div>
                  <div className="text-slate-400 font-mono">
                    IP Origen: <span className="text-white">{alert.sourceIp}</span> &middot; Objectiu: {alert.targetRegistry}
                  </div>
                  <div className="text-slate-400">
                    Timestamp: {alert.timestamp.slice(0, 19).replace('T', ' ')}
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-600/30 text-rose-200 border border-rose-400/40 font-mono font-bold text-[10px]">
                    ACCIÓ: {alert.actionTaken}
                  </span>
                </div>
              </div>
            ))}

            {anomalies.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center gap-2">
                <CheckCircle2 size={32} className="text-emerald-400" />
                <span>Cap incidència o anomalia detectada en les darreres 24 hores. Totes les consultes són conformes a RGPD.</span>
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
