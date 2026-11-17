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
        {children}
      </body>
    </html>
  );
}
