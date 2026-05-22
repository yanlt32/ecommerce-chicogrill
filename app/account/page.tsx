"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, Order, ReturnReason } from "@/context/AuthContext";
import { formatPrice } from "@/lib/products";

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

const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
  { value: "tamanho", label: "Tamanho incorreto" },
  { value: "defeito", label: "Produto com defeito" },
  { value: "nao_gostei", label: "Não gostei do produto" },
  { value: "item_errado", label: "Produto diferente do pedido" },
  { value: "outro", label: "Outro motivo" },
];

function OrderTimeline({ order }: { order: Order }) {
  const steps = [
    {
      label: "Pedido Confirmado",
      icon: "check_circle",
      done: true,
      date: order.date,
    },
    {
      label: "Etiqueta Gerada",
      icon: "label",
      done: !!order.meOrderId,
      date: null,
    },
    {
      label: "Em Trânsito",
      icon: "local_shipping",
      done: order.status === "Enviado" || order.status === "Entregue",
      date: null,
    },
    {
      label: "Entregue",
      icon: "home",
      done: order.status === "Entregue",
      date: null,
    },
  ];

  return (
    <div className="flex items-start gap-0 mt-4 mb-5">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                step.done
                  ? "bg-flame-orange text-black"
                  : "bg-surface-container border border-outline-variant/40 text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{step.icon}</span>
            </div>
            <span
              className={`text-[10px] font-title font-semibold uppercase text-center leading-tight max-w-[56px] ${
                step.done ? "text-flame-orange" : "text-on-surface-variant"
              }`}
            >
              {step.label}
            </span>
            {step.date && (
              <span className="text-[10px] font-body text-on-surface-variant">{step.date}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-1 mb-5 transition-all ${
                step.done && steps[i + 1].done ? "bg-flame-orange" : "bg-outline-variant/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ReturnModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const { requestReturn } = useAuth();
  const [reason, setReason] = useState<ReturnReason>("tamanho");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    requestReturn(order.id, reason, description);
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {done ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-5xl text-flame-orange mb-4 block">
              check_circle
            </span>
            <h3 className="font-headline text-2xl uppercase text-on-surface mb-2">
              Solicitação Enviada!
            </h3>
            <p className="font-body text-sm text-on-surface-variant mb-6">
              Nossa equipe vai analisar em até 2 dias úteis e entrará em contato pelo e-mail cadastrado.
            </p>
            <button
              onClick={onClose}
              className="bg-flame-orange text-black font-title font-bold px-8 py-3 rounded-full uppercase text-sm"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline text-2xl uppercase text-on-surface">
                  Solicitar Devolução
                </h3>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Pedido #{order.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">
                  Motivo da Devolução
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReturnReason)}
                  className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none"
                >
                  {RETURN_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">
                  Descreva o problema
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nos conte mais detalhes para agilizar o processo..."
                  rows={4}
                  className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none resize-none"
                />
              </div>

              <div className="bg-flame-orange/10 border border-flame-orange/20 rounded-lg p-3 text-xs font-body text-on-surface-variant">
                📦 Após aprovação, enviaremos uma etiqueta gratuita de devolução via e-mail. Prazo de até 30 dias após a entrega.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-outline-variant/40 text-on-surface font-title font-semibold text-sm py-3 rounded-full uppercase hover:border-outline transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-flame-orange text-black font-title font-bold text-sm py-3 rounded-full uppercase hover:bg-secondary-container transition-all active:scale-95"
                >
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, orders, logout, isLoading } = useAuth();
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-flame-orange text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <>
      {returnModalOrder && (
        <ReturnModal
          order={returnModalOrder}
          onClose={() => setReturnModalOrder(null)}
        />
      )}

      <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-flame-orange/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-flame-orange text-3xl">
                account_circle
              </span>
            </div>
            <div>
              <h1 className="font-headline text-3xl md:text-4xl uppercase text-on-surface">
                Olá, {user.name.split(" ")[0]}!
              </h1>
              <p className="font-body text-sm text-on-surface-variant">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="border border-outline-variant/40 text-on-surface font-title font-semibold text-sm px-5 py-2.5 rounded-full uppercase hover:border-outline transition-all"
            >
              Continuar Comprando
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex items-center gap-2 text-on-surface-variant hover:text-meat-red font-title font-semibold text-sm px-5 py-2.5 rounded-full border border-outline-variant/40 hover:border-meat-red transition-all uppercase"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders */}
          <div className="lg:col-span-2">
            <h2 className="font-headline text-2xl uppercase mb-6 flex items-center gap-3">
              Meus Pedidos
              <span className="bg-surface-container-high text-on-surface-variant font-title font-semibold text-xs px-3 py-1 rounded-full">
                {orders.length}
              </span>
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                <span className="material-symbols-outlined text-5xl text-outline mb-4 block">
                  receipt_long
                </span>
                <p className="font-title font-semibold text-base text-on-surface-variant mb-6">
                  Você ainda não fez nenhum pedido.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-6 py-3 rounded-full uppercase text-sm"
                >
                  Explorar a Loja
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const canReturn =
                    (order.status === "Entregue" || order.status === "Enviado") &&
                    !order.returnRequest;
                  const ret = order.returnRequest;

                  return (
                    <div
                      key={order.id}
                      className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6"
                    >
                      {/* Top row */}
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-title font-bold text-base text-on-surface">
                            Pedido #{order.id}
                          </p>
                          <p className="font-body text-xs text-on-surface-variant mt-0.5">
                            {order.date} · {order.payMethod}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <span
                            className={`font-title font-semibold text-xs px-3 py-1 rounded-full uppercase ${STATUS_COLOR[order.status]}`}
                          >
                            {order.status}
                          </span>
                          <span className="font-headline text-xl text-flame-orange">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Timeline */}
                      <OrderTimeline order={order} />

                      {/* Tracking button */}
                      {order.trackingCode && (
                        <a
                          href={`https://rastreamento.correios.com.br/app/index.php?numero=${order.trackingCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 text-blue-400 rounded-xl px-4 py-3 transition-all group mb-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-xl">local_shipping</span>
                            <div>
                              <p className="font-title font-bold text-sm uppercase">
                                Rastrear Pedido
                              </p>
                              <p className="font-body text-xs opacity-70">{order.trackingCode}</p>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                            open_in_new
                          </span>
                        </a>
                      )}

                      {/* Items */}
                      <div className="flex gap-2 flex-wrap mb-4">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-surface-container rounded-lg p-2"
                          >
                            <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-title font-semibold text-xs text-on-surface uppercase leading-tight">
                                {item.productName}
                              </p>
                              <p className="font-body text-xs text-on-surface-variant">
                                {item.size} · {item.quantity}x
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Return request area */}
                      {canReturn && (
                        <button
                          onClick={() => setReturnModalOrder(order)}
                          className="flex items-center gap-2 border border-outline-variant/30 hover:border-meat-red text-on-surface-variant hover:text-meat-red font-title font-semibold text-xs px-4 py-2 rounded-full uppercase transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">sync_alt</span>
                          Solicitar Troca / Devolução
                        </button>
                      )}

                      {ret && (
                        <div className="border border-outline-variant/20 rounded-xl p-4 space-y-2 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-on-surface-variant">
                              sync_alt
                            </span>
                            <p className="font-title font-bold text-xs text-on-surface uppercase">
                              Solicitação de Devolução
                            </p>
                            <span
                              className={`font-title font-semibold text-xs px-2 py-0.5 rounded-full uppercase ${RETURN_STATUS_COLOR[ret.status]}`}
                            >
                              {ret.status}
                            </span>
                          </div>
                          <p className="font-body text-xs text-on-surface-variant">
                            {RETURN_REASONS.find((r) => r.value === ret.reason)?.label} ·{" "}
                            {ret.date}
                          </p>
                          <p className="font-body text-xs text-on-surface-variant italic">
                            &ldquo;{ret.description}&rdquo;
                          </p>
                          {ret.adminNote && (
                            <p className="font-body text-xs text-flame-orange border-t border-outline-variant/10 pt-2">
                              Resposta da loja: {ret.adminNote}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-surface-container-high rounded-2xl border border-outline-variant/20 p-6">
              <h3 className="font-headline text-xl uppercase mb-4">Meus Dados</h3>
              <div className="space-y-3">
                {[
                  { icon: "person", label: user.name },
                  { icon: "mail", label: user.email },
                  { icon: "phone", label: user.phone ?? "Não informado" },
                  { icon: "badge", label: user.cpf ?? "Não informado" },
                ].map((row) => (
                  <div key={row.icon} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-flame-orange text-base">
                      {row.icon}
                    </span>
                    <span className="font-body text-sm text-on-surface-variant">{row.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-high rounded-2xl border border-outline-variant/20 p-6">
              <h3 className="font-headline text-xl uppercase mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-flame-orange text-base">
                    storefront
                  </span>
                  <span className="font-title font-semibold text-sm uppercase">Visitar Loja</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-flame-orange text-base">
                    shopping_cart
                  </span>
                  <span className="font-title font-semibold text-sm uppercase">Ver Carrinho</span>
                </Link>
                <Link
                  href="/trocas"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-flame-orange text-base">
                    sync_alt
                  </span>
                  <span className="font-title font-semibold text-sm uppercase">
                    Política de Trocas
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
