"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/products";

const ADMIN_PASSWORD = "chicogrill2024";

const STATUS_COLOR: Record<string, string> = {
  Processando: "bg-flame-orange/20 text-flame-orange",
  Enviado: "bg-blue-500/20 text-blue-400",
  Entregue: "bg-green-500/20 text-green-400",
};

export default function AdminPage() {
  const { allOrders } = useAuth();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      setError("Senha incorreta.");
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-5xl text-flame-orange mb-2 block">admin_panel_settings</span>
            <h1 className="font-headline text-3xl uppercase text-on-surface">Painel Admin</h1>
            <p className="font-body text-sm text-on-surface-variant mt-1">CHICO GRILL</p>
          </div>
          <form onSubmit={handleLogin} className="bg-surface-container-high p-8 rounded-2xl border border-outline-variant/20 space-y-4">
            <div>
              <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all"
              />
            </div>
            {error && <p className="text-meat-red font-body text-sm">{error}</p>}
            <button type="submit" className="w-full bg-flame-orange text-black font-title font-bold py-3 rounded-full uppercase">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
  const processing = allOrders.filter((o) => o.status === "Processando").length;

  const filtered = allOrders.filter(
    (o) =>
      o.id.includes(search) ||
      o.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-16 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-headline text-4xl uppercase text-on-surface">Painel Admin</h1>
          <p className="font-body text-sm text-on-surface-variant">CHICO GRILL · Gestão de Pedidos</p>
        </div>
        <button
          onClick={() => setAuthenticated(false)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-meat-red font-title font-semibold text-sm px-4 py-2 rounded-full border border-outline-variant/40 hover:border-meat-red transition-all uppercase"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          Sair
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { icon: "receipt_long", label: "Total de Pedidos", value: allOrders.length.toString() },
          { icon: "payments", label: "Receita Total", value: formatPrice(totalRevenue) },
          { icon: "pending", label: "Em Processamento", value: processing.toString() },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-high rounded-2xl border border-outline-variant/20 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-flame-orange/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-flame-orange">{stat.icon}</span>
            </div>
            <div>
              <p className="font-title font-semibold text-xs text-on-surface-variant uppercase">{stat.label}</p>
              <p className="font-headline text-2xl text-flame-orange">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-3 items-center">
        <div className="relative flex-grow max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por pedido ou produto..."
            className="w-full bg-surface border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2.5 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all"
          />
        </div>
        <span className="font-title font-semibold text-xs text-on-surface-variant uppercase">
          {filtered.length} pedido{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Orders table */}
      {allOrders.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-low rounded-2xl border border-outline-variant/20">
          <span className="material-symbols-outlined text-5xl text-outline mb-4 block">inbox</span>
          <p className="font-title font-semibold text-base text-on-surface-variant">Nenhum pedido ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-title font-bold text-base text-on-surface">Pedido #{order.id}</p>
                    <span className={`font-title font-semibold text-xs px-3 py-1 rounded-full uppercase ${STATUS_COLOR[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-body text-xs text-on-surface-variant mt-1">
                    {order.date} · {order.payMethod}
                  </p>
                  {order.address && (
                    <p className="font-body text-xs text-on-surface-variant mt-1">
                      📍 {order.address.street}, {order.address.number} — {order.address.city}/{order.address.state}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-headline text-2xl text-flame-orange">{formatPrice(order.total)}</span>
                  <p className="font-body text-xs text-on-surface-variant mt-1">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap border-t border-outline-variant/10 pt-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-surface-container rounded-lg p-2">
                    <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-title font-semibold text-xs text-on-surface uppercase">{item.productName}</p>
                      <p className="font-body text-xs text-on-surface-variant">{item.size} · {item.quantity}x · {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
