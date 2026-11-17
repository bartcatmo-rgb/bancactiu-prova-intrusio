import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "BancActiu Nexus 3.0 Enterprise",
  description: "BancActiu 3.0 Enterprise - Plataforma Unificada de Governança i Serveis Sociosanitaris (Zero-Trust & ENS Nivell Alt)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <body className="antialiased min-h-screen w-full bg-slate-50 text-slate-900 overflow-x-hidden overflow-y-auto" suppressHydrationWarning>
        <Script id="bancactiu-init" strategy="beforeInteractive">
          {`
            window.__BANCACTIU_APP__ = "bancactiu-nexus";
            window.__BANCACTIU_ENV__ = "production";
          `}
        </Script>
        {/* Banner Visual d'Avís - Versió Educativa de Demostració */}
        <aside aria-label="Avís de versió educativa" className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 py-1 px-3 text-center text-[11px] sm:text-xs font-mono font-bold tracking-wider shadow-sm z-50 flex items-center justify-center gap-2 select-none border-b border-amber-600/30 sticky top-0">
          <span className="text-amber-950 font-black">⚠️</span>
          <span>VERSIÓ EDUCATIVA DE DEMOSTRACIÓ - Ús restringit</span>
          <span className="text-amber-950 font-black">⚠️</span>
        </aside>
        {children}
      </body>
    </html>
  );
}
