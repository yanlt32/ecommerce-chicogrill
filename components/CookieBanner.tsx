"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cg_cookies_accepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cg_cookies_accepted", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal-deep/95 backdrop-blur border-t border-outline-variant/20">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="font-body text-xs text-on-surface-variant leading-relaxed max-w-2xl">
          Usamos cookies para melhorar sua experiência e analisar o tráfego. Ao
          continuar, você concorda com nossa{" "}
          <Link
            href="/privacidade"
            className="text-flame-orange hover:underline"
          >
            Política de Privacidade
          </Link>
          .
        </p>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            className="bg-flame-orange text-black font-title font-bold text-xs px-5 py-2 rounded-full uppercase tracking-wide hover:opacity-90 transition-opacity active:scale-95"
          >
            Aceitar Todos
          </button>
          <button
            onClick={accept}
            className="border border-outline-variant/40 text-on-surface-variant font-title font-semibold text-xs px-5 py-2 rounded-full uppercase tracking-wide hover:border-outline-variant transition-colors active:scale-95"
          >
            Apenas Necessários
          </button>
        </div>
      </div>
    </div>
  );
}
