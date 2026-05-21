"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/products";

const STATUS_COLOR: Record<string, string> = {
  Processando: "bg-flame-orange/20 text-flame-orange",
  Enviado: "bg-blue-500/20 text-blue-400",
  Entregue: "bg-green-500/20 text-green-400",
};

export default function AccountPage() {
  const router = useRouter();
  const { user, orders, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-flame-orange text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-flame-orange/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-flame-orange text-3xl">account_circle</span>
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
            onClick={() => { logout(); router.push("/"); }}
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
              <span className="material-symbols-outlined text-5xl text-outline mb-4 block">receipt_long</span>
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
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-title font-bold text-base text-on-surface">
                        Pedido #{order.id}
                      </p>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">
                        {order.date} · {order.payMethod}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-title font-semibold text-xs px-3 py-1 rounded-full uppercase ${STATUS_COLOR[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="font-headline text-xl text-flame-orange">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-surface-container rounded-lg p-2">
                        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
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
                </div>
              ))}
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
                  <span className="material-symbols-outlined text-flame-orange text-base">{row.icon}</span>
                  <span className="font-body text-sm text-on-surface-variant">{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-high rounded-2xl border border-outline-variant/20 p-6">
            <h3 className="font-headline text-xl uppercase mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-flame-orange text-base">storefront</span>
                <span className="font-title font-semibold text-sm uppercase">Visitar Loja</span>
              </Link>
              <Link href="/cart" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-flame-orange text-base">shopping_cart</span>
                <span className="font-title font-semibold text-sm uppercase">Ver Carrinho</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
