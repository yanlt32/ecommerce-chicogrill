"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type SizeRow = {
  size: string;
  busto: number;
  cintura: number;
  quadril: number;
  comprimento: number;
};

const BASE_ROWS: SizeRow[] = [
  { size: "P",  busto: 88,  cintura: 68,  quadril: 94,  comprimento: 68 },
  { size: "M",  busto: 92,  cintura: 72,  quadril: 98,  comprimento: 70 },
  { size: "G",  busto: 96,  cintura: 76,  quadril: 102, comprimento: 72 },
  { size: "GG", busto: 100, cintura: 80,  quadril: 106, comprimento: 74 },
];

const TABS = ["Camisetas", "Moletons"] as const;
type Tab = (typeof TABS)[number];

function getRows(tab: Tab): SizeRow[] {
  if (tab === "Moletons") {
    return BASE_ROWS.map((r) => ({
      size: r.size,
      busto: r.busto + 4,
      cintura: r.cintura + 4,
      quadril: r.quadril + 4,
      comprimento: r.comprimento + 4,
    }));
  }
  return BASE_ROWS;
}

export default function SizeGuide({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Camisetas");

  if (!open) return null;

  const rows = getRows(activeTab);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full bg-surface-container-high rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline text-2xl text-on-surface uppercase">
            GUIA DE TAMANHOS
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar guia de tamanhos"
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/20 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-3 font-title font-semibold text-sm uppercase tracking-wider transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-flame-orange text-flame-orange"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-outline-variant/20 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container">
                <th className="font-title font-bold text-xs text-on-surface-variant uppercase tracking-wider text-left px-4 py-3">
                  Tamanho
                </th>
                <th className="font-title font-bold text-xs text-on-surface-variant uppercase tracking-wider text-center px-4 py-3">
                  Busto
                </th>
                <th className="font-title font-bold text-xs text-on-surface-variant uppercase tracking-wider text-center px-4 py-3">
                  Cintura
                </th>
                <th className="font-title font-bold text-xs text-on-surface-variant uppercase tracking-wider text-center px-4 py-3">
                  Quadril
                </th>
                <th className="font-title font-bold text-xs text-on-surface-variant uppercase tracking-wider text-center px-4 py-3">
                  Comprimento
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.size}
                  className={i % 2 === 0 ? "bg-surface-container/50" : ""}
                >
                  <td className="font-title font-bold text-on-surface px-4 py-3">
                    {row.size}
                  </td>
                  <td className="font-body text-on-surface-variant text-center px-4 py-3">
                    {row.busto}cm
                  </td>
                  <td className="font-body text-on-surface-variant text-center px-4 py-3">
                    {row.cintura}cm
                  </td>
                  <td className="font-body text-on-surface-variant text-center px-4 py-3">
                    {row.quadril}cm
                  </td>
                  <td className="font-body text-on-surface-variant text-center px-4 py-3">
                    {row.comprimento}cm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer notes */}
        <div className="space-y-2">
          <p className="font-body text-sm text-on-surface flex items-start gap-2">
            <span className="material-symbols-outlined text-flame-orange text-base mt-0.5 shrink-0">
              lightbulb
            </span>
            <span>
              <strong>Dica:</strong> Em caso de dúvida, prefira o tamanho maior.
            </span>
          </p>
          <p className="font-body text-xs text-on-surface-variant pl-6">
            Medidas em centímetros. Podem variar ±2cm.
          </p>
        </div>
      </div>
    </div>
  );
}
