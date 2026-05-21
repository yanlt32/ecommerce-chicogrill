"use client";

import { useState } from "react";

type ViaCEP = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

// Freight table by state (simulated — real values require Correios contract)
const FREIGHT: Record<string, { standard: number; express: number; days: string; daysExpress: string }> = {
  SP: { standard: 15, express: 29.9, days: "3–5", daysExpress: "1–2" },
  RJ: { standard: 17, express: 32, days: "4–6", daysExpress: "2–3" },
  MG: { standard: 17, express: 32, days: "4–6", daysExpress: "2–3" },
  ES: { standard: 19, express: 35, days: "5–7", daysExpress: "2–3" },
  PR: { standard: 20, express: 36, days: "5–7", daysExpress: "3–4" },
  SC: { standard: 20, express: 36, days: "5–7", daysExpress: "3–4" },
  RS: { standard: 22, express: 38, days: "6–8", daysExpress: "3–4" },
  DEFAULT: { standard: 28, express: 48, days: "8–12", daysExpress: "5–7" },
};

function formatCep(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 8);
  return n.length > 5 ? `${n.slice(0, 5)}-${n.slice(5)}` : n;
}

function getFreight(uf: string) {
  return FREIGHT[uf] ?? FREIGHT.DEFAULT;
}

export default function ShippingCalc() {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<ViaCEP | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCalc() {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) { setError("Digite um CEP válido com 8 dígitos."); return; }
    setLoading(true);
    setError("");
    setAddress(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data: ViaCEP = await res.json();
      if (data.erro) setError("CEP não encontrado. Verifique e tente novamente.");
      else setAddress(data);
    } catch { setError("Erro ao consultar CEP. Tente novamente."); }
    finally { setLoading(false); }
  }

  const freight = address ? getFreight(address.uf) : null;

  return (
    <section className="bg-surface-container-highest/50 py-12">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-16 flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="flex items-center gap-6 shrink-0">
          <span className="material-symbols-outlined text-flame-orange text-5xl">local_shipping</span>
          <div>
            <h4 className="font-headline text-3xl">CALCULAR FRETE</h4>
            <p className="text-on-surface-variant font-body text-sm">
              Veja o prazo e valor para sua região
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-auto gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="00000-000"
              value={cep}
              onChange={(e) => setCep(formatCep(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleCalc()}
              maxLength={9}
              className="w-48 bg-surface-container border border-outline-variant/40 rounded-lg px-6 py-3 focus:border-flame-orange outline-none text-on-surface font-headline tracking-widest text-2xl"
            />
            <button
              onClick={handleCalc}
              disabled={loading}
              className="bg-bone-white text-black font-title font-bold px-8 py-3 rounded-lg hover:bg-primary-fixed-dim transition-all uppercase text-sm disabled:opacity-50"
            >
              {loading ? "..." : "Calcular"}
            </button>
          </div>

          {error && <p className="text-meat-red font-body text-sm">{error}</p>}

          {address && freight && (
            <div className="bg-surface-container-high p-5 rounded-xl border border-outline-variant/20 space-y-4 min-w-80">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-flame-orange text-base mt-0.5">pin_drop</span>
                <div>
                  <p className="font-title font-semibold text-sm text-on-surface">
                    {address.logradouro && `${address.logradouro}, `}{address.bairro}
                  </p>
                  <p className="font-body text-xs text-on-surface-variant">
                    {address.localidade} — {address.uf}
                  </p>
                </div>
              </div>
              <div className="border-t border-outline-variant/20 pt-3 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-title font-semibold text-sm text-on-surface">PAC (Padrão)</p>
                    <p className="text-on-surface-variant font-body text-xs">{freight.days} dias úteis</p>
                  </div>
                  <span className="font-headline text-xl text-flame-orange">
                    R$ {freight.standard.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-title font-semibold text-sm text-on-surface">SEDEX (Expresso)</p>
                    <p className="text-on-surface-variant font-body text-xs">{freight.daysExpress} dias úteis</p>
                  </div>
                  <span className="font-headline text-xl text-flame-orange">
                    R$ {freight.express.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
              <p className="font-body text-xs text-on-surface-variant border-t border-outline-variant/10 pt-2">
                * Valores baseados em tabela de frete. Frete grátis PAC em compras acima de R$ 300.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
