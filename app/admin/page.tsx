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

const RETURN_STATUS_COLOR: Record<string, string> = {
  Pendente: "bg-yellow-500/20 text-yellow-400",
  "Em Análise": "bg-blue-500/20 text-blue-400",
  Aprovada: "bg-green-500/20 text-green-400",
  Recusada: "bg-red-500/20 text-red-400",
};

const RETURN_REASON_LABEL: Record<string, string> = {
  tamanho: "Tamanho incorreto",
  defeito: "Produto com defeito",
  nao_gostei: "Não gostei",
  item_errado: "Item diferente do pedido",
  outro: "Outro",
};

const STATUS_NEXT: Record<string, "Enviado" | "Entregue" | null> = {
  Processando: "Enviado",
  Enviado: "Entregue",
  Entregue: null,
};

export default function AdminPage() {
  const { allOrders, updateOrder, updateReturn } = useAuth();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"pedidos" | "devolucoes">("pedidos");
  const [printingId, setPrintingId] = useState<string | null>(null);
  const [labelLoadingId, setLabelLoadingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setAuthenticated(true);
    else setError("Senha incorreta.");
  }

  async function handlePrint(order: { id: string; meOrderId?: string; labelUrl?: string | null }) {
    if (order.labelUrl) {
      window.open(order.labelUrl, "_blank");
      return;
    }
    if (!order.meOrderId || order.meOrderId.startsWith("mock_")) return;
    setPrintingId(order.id);
    try {
      const res = await fetch(`/api/shipping/print/${order.meOrderId}`);
      if (res.ok) {
        const { url } = await res.json();
        updateOrder(order.id, { labelUrl: url });
        window.open(url, "_blank");
      }
    } finally {
      setPrintingId(null);
    }
  }

  async function handleGenerateLabel(order: typeof allOrders[0]) {
    setLabelLoadingId(order.id);
    try {
      const res = await fetch("/api/shipping/label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: order.address.street,
          customerEmail: "contato@chicogrill.com.br",
          customerPhone: "11999990000",
          address: {
            street: order.address.street,
            number: order.address.number,
            district: order.address.neighborhood ?? "",
            city: order.address.city,
            state: order.address.state,
            cep: order.address.cep,
          },
          serviceId: 1,
          insuranceValue: order.total,
          items: order.items.map((i) => ({
            name: i.productName,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });
      if (res.ok) {
        const { trackingCode, labelUrl, meOrderId } = await res.json();
        updateOrder(order.id, { trackingCode, labelUrl, meOrderId });
      }
    } finally {
      setLabelLoadingId(null);
    }
  }

  function handleStatusAdvance(orderId: string, current: string) {
    const next = STATUS_NEXT[current];
    if (next) updateOrder(orderId, { status: next });
  }

  function handleReturnDecision(
    orderId: string,
    decision: "Aprovada" | "Recusada" | "Em Análise"
  ) {
    const note = adminNotes[orderId] ?? "";
    updateReturn(orderId, { status: decision, adminNote: note || undefined });
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
  const pendingReturns = allOrders.filter((o) => o.returnRequest?.status === "Pendente").length;

  const filtered = allOrders.filter(
    (o) =>
      o.id.includes(search) ||
      o.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase())) ||
      (o.trackingCode ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const ordersWithReturns = allOrders.filter((o) => !!o.returnRequest);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-16 py-12">
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
          { icon: "sync_alt", label: "Devoluções Pendentes", value: pendingReturns.toString() },
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

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-outline-variant/20">
        {(["pedidos", "devolucoes"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-4 font-title font-semibold text-sm uppercase tracking-wider transition-all border-b-2 -mb-px flex items-center gap-2 ${
              tab === t
                ? "border-flame-orange text-flame-orange"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t === "pedidos" ? "Pedidos" : "Devoluções"}
            {t === "devolucoes" && pendingReturns > 0 && (
              <span className="bg-meat-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {pendingReturns}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search (orders tab only) */}
      {tab === "pedidos" && (
        <div className="mb-6 flex gap-3 items-center">
          <div className="relative flex-grow max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por pedido, produto ou rastreio..."
              className="w-full bg-surface border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2.5 text-on-surface font-body text-sm focus:border-flame-orange outline-none transition-all"
            />
          </div>
          <span className="font-title font-semibold text-xs text-on-surface-variant uppercase">
            {filtered.length} pedido{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Returns tab */}
      {tab === "devolucoes" && (
        <>
          {ordersWithReturns.length === 0 ? (
            <div className="text-center py-24 bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-5xl text-outline mb-4 block">sync_alt</span>
              <p className="font-title font-semibold text-base text-on-surface-variant">Nenhuma solicitação de devolução.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersWithReturns.map((order) => {
                const ret = order.returnRequest!;
                return (
                  <div key={order.id} className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-title font-bold text-base text-on-surface">Pedido #{order.id}</p>
                          <span className={`font-title font-semibold text-xs px-3 py-1 rounded-full uppercase ${RETURN_STATUS_COLOR[ret.status]}`}>
                            {ret.status}
                          </span>
                        </div>
                        <p className="font-body text-xs text-on-surface-variant mt-1">
                          Solicitado em {ret.date} · Pedido de {order.date}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant mt-1">
                          📍 {order.address.city}/{order.address.state}
                        </p>
                      </div>
                      <span className="font-headline text-2xl text-flame-orange">{formatPrice(order.total)}</span>
                    </div>

                    <div className="bg-surface-container rounded-lg p-4 space-y-1 mb-4">
                      <p className="font-title font-semibold text-xs text-on-surface uppercase">
                        {RETURN_REASON_LABEL[ret.reason]}
                      </p>
                      <p className="font-body text-sm text-on-surface-variant italic">&ldquo;{ret.description}&rdquo;</p>
                    </div>

                    {/* Items */}
                    <div className="flex gap-2 flex-wrap mb-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-surface-container rounded-lg p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-md object-cover shrink-0" />
                          <div>
                            <p className="font-title font-semibold text-xs text-on-surface uppercase">{item.productName}</p>
                            <p className="font-body text-xs text-on-surface-variant">{item.size} · {item.quantity}x</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Admin note + actions */}
                    <div className="border-t border-outline-variant/10 pt-4 space-y-3">
                      <div>
                        <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-1">
                          Nota para o cliente (opcional)
                        </label>
                        <input
                          type="text"
                          value={adminNotes[order.id] ?? ret.adminNote ?? ""}
                          onChange={(e) => setAdminNotes((prev) => ({ ...prev, [order.id]: e.target.value }))}
                          placeholder="Ex: Etiqueta enviada por e-mail..."
                          className="w-full bg-surface border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface font-body text-sm focus:border-flame-orange outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleReturnDecision(order.id, "Em Análise")}
                          className="flex items-center gap-2 border border-blue-400/40 text-blue-400 font-title font-semibold text-xs px-4 py-2 rounded-full uppercase hover:bg-blue-400/10 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                          Em Análise
                        </button>
                        <button
                          onClick={() => handleReturnDecision(order.id, "Aprovada")}
                          className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 font-title font-semibold text-xs px-4 py-2 rounded-full uppercase hover:bg-green-500/30 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleReturnDecision(order.id, "Recusada")}
                          className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 font-title font-semibold text-xs px-4 py-2 rounded-full uppercase hover:bg-red-500/30 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">cancel</span>
                          Recusar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "pedidos" && allOrders.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-low rounded-2xl border border-outline-variant/20">
          <span className="material-symbols-outlined text-5xl text-outline mb-4 block">inbox</span>
          <p className="font-title font-semibold text-base text-on-surface-variant">Nenhum pedido ainda.</p>
        </div>
      ) : tab === "pedidos" ? (
        <div className="space-y-4">
          {filtered.map((order) => {
            const hasLabel = !!order.meOrderId;
            const nextStatus = STATUS_NEXT[order.status];

            return (
              <div key={order.id} className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-title font-bold text-base text-on-surface">Pedido #{order.id}</p>
                      <span className={`font-title font-semibold text-xs px-3 py-1 rounded-full uppercase ${STATUS_COLOR[order.status]}`}>
                        {order.status}
                      </span>
                      {order.trackingCode && (
                        <a
                          href={`https://rastreamento.correios.com.br/app/index.php?numero=${order.trackingCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-title font-semibold text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">local_shipping</span>
                          {order.trackingCode}
                        </a>
                      )}
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

                {/* Items */}
                <div className="flex gap-3 flex-wrap border-t border-outline-variant/10 pt-4 mb-4">
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

                {/* Actions */}
                <div className="flex flex-wrap gap-2 border-t border-outline-variant/10 pt-4">
                  {!hasLabel && (
                    <button
                      onClick={() => handleGenerateLabel(order)}
                      disabled={labelLoadingId === order.id}
                      className="flex items-center gap-2 bg-flame-orange text-black font-title font-semibold text-xs px-4 py-2 rounded-full uppercase hover:bg-secondary-container transition-all disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-sm ${labelLoadingId === order.id ? "animate-spin" : ""}`}>
                        {labelLoadingId === order.id ? "progress_activity" : "label"}
                      </span>
                      {labelLoadingId === order.id ? "Gerando..." : "Gerar Etiqueta"}
                    </button>
                  )}

                  {hasLabel && (
                    order.meOrderId?.startsWith("mock_") ? (
                      <span className="flex items-center gap-2 border border-outline-variant/20 text-on-surface-variant font-title font-semibold text-xs px-4 py-2 rounded-full uppercase opacity-60 cursor-default">
                        <span className="material-symbols-outlined text-sm">science</span>
                        Etiqueta simulada (sem token)
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePrint(order)}
                        disabled={printingId === order.id}
                        className="flex items-center gap-2 bg-surface-container-highest border border-outline-variant/30 text-on-surface font-title font-semibold text-xs px-4 py-2 rounded-full uppercase hover:border-flame-orange hover:text-flame-orange transition-all disabled:opacity-50"
                      >
                        <span className={`material-symbols-outlined text-sm ${printingId === order.id ? "animate-spin" : ""}`}>
                          {printingId === order.id ? "progress_activity" : "print"}
                        </span>
                        {printingId === order.id ? "Buscando..." : "Imprimir Etiqueta"}
                      </button>
                    )
                  )}

                  {nextStatus && (
                    <button
                      onClick={() => handleStatusAdvance(order.id, order.status)}
                      className="flex items-center gap-2 border border-outline-variant/40 text-on-surface-variant font-title font-semibold text-xs px-4 py-2 rounded-full uppercase hover:border-blue-400 hover:text-blue-400 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      Marcar como {nextStatus}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
