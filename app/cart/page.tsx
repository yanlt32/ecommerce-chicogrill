"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

const SHIPPING = 15;

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCart();
  const shippingCost = total === 0 ? 0 : total >= 300 ? 0 : SHIPPING;
  const orderTotal = total + shippingCost;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-16 py-12">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Cart items */}
        <div className="flex-grow lg:w-2/3">
          <div className="flex items-baseline gap-4 mb-8">
            <h1 className="font-headline text-4xl md:text-5xl uppercase text-on-surface">
              Seu Carrinho
            </h1>
            <span className="font-title font-semibold text-sm text-on-surface-variant">
              ({count} {count === 1 ? "Item" : "Itens"})
            </span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
                shopping_cart
              </span>
              <p className="font-title font-semibold text-xl text-on-surface-variant mb-8">
                Seu carrinho está vazio
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase"
              >
                Explorar a Loja
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="bg-surface-container-low border border-outline-variant/20 p-4 md:p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center transition-all hover:-translate-y-1 hover:bg-surface-container-high/50 duration-300"
                >
                  <div className="w-full md:w-32 h-32 bg-surface-container rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-grow flex flex-col md:flex-row justify-between w-full">
                    <div className="space-y-1 text-center md:text-left">
                      <h3 className="font-title font-bold text-xl text-on-surface uppercase tracking-tight">
                        {item.product.name}
                      </h3>
                      {item.size && (
                        <p className="text-on-surface-variant font-body italic text-sm">
                          Tamanho: {item.size}
                        </p>
                      )}
                      <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                        <div className="flex items-center border border-outline-variant/40 rounded-full px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.size, -1)
                            }
                            className="p-1 hover:text-flame-orange transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">
                              remove
                            </span>
                          </button>
                          <span className="px-4 font-title font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.size, 1)
                            }
                            className="p-1 hover:text-flame-orange transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">
                              add
                            </span>
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.size)
                          }
                          className="text-on-surface-variant hover:text-meat-red transition-colors flex items-center gap-1 font-title text-xs font-semibold uppercase"
                        >
                          <span className="material-symbols-outlined text-base">
                            delete
                          </span>
                          Remover
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-center md:text-right">
                      <span className="font-headline text-3xl text-flame-orange">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-surface-container-high/30 p-4 rounded-lg border border-outline-variant/10">
              <span className="material-symbols-outlined text-flame-orange text-3xl">
                verified_user
              </span>
              <div>
                <p className="font-title font-semibold text-sm text-on-surface uppercase">
                  Compra Segura
                </p>
                <p className="text-on-surface-variant text-xs font-body">
                  Seus dados protegidos com criptografia de ponta.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-high/30 p-4 rounded-lg border border-outline-variant/10">
              <span className="material-symbols-outlined text-flame-orange text-3xl">
                sync_alt
              </span>
              <div>
                <p className="font-title font-semibold text-sm text-on-surface uppercase">
                  Troca Grátis
                </p>
                <p className="text-on-surface-variant text-xs font-body">
                  Até 30 dias para trocar seu produto sem custo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 bg-surface-container-high p-8 rounded-2xl border border-outline-variant/20 shadow-2xl">
            <h2 className="font-headline text-3xl text-on-surface mb-8 tracking-wide uppercase">
              Resumo do Pedido
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-title font-semibold text-sm text-on-surface-variant uppercase">
                  Subtotal
                </span>
                <span className="font-body text-base text-on-surface">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-title font-semibold text-sm text-on-surface-variant uppercase">
                  Frete
                </span>
                <span className="font-body text-base text-on-surface">
                  {total === 0
                    ? "—"
                    : shippingCost === 0
                    ? "Grátis"
                    : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="pt-4">
                <label className="font-title font-semibold text-xs text-on-surface-variant block mb-2 uppercase">
                  Cupom de Desconto
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Insira o código"
                    className="bg-surface border border-outline-variant/40 rounded-lg px-4 py-2 w-full focus:border-meat-red outline-none transition-all text-on-surface text-sm font-body"
                  />
                  <button className="bg-outline-variant/20 hover:bg-outline-variant/40 text-on-surface px-4 py-2 rounded-lg font-title font-semibold text-xs transition-all uppercase">
                    Aplicar
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant/20 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-headline text-3xl text-on-surface">
                  TOTAL
                </span>
                <span className="font-headline text-5xl text-flame-orange leading-none">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>

            <button
              disabled={items.length === 0}
              className="w-full bg-flame-orange hover:bg-secondary-container disabled:opacity-40 disabled:cursor-not-allowed text-black font-title font-bold text-lg py-5 rounded-full shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] active:scale-95 uppercase mb-6 flex items-center justify-center gap-3"
            >
              Finalizar Compra
              <span className="material-symbols-outlined font-bold">
                arrow_forward
              </span>
            </button>

            <Link
              href="/"
              className="w-full border border-bone-white/20 hover:bg-bone-white/10 text-bone-white font-title font-semibold text-sm py-4 rounded-full transition-all uppercase flex items-center justify-center"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>

      {/* Shipping calc */}
      <section className="bg-surface-container-highest/50 py-12 mt-20 -mx-4 md:-mx-16 px-4 md:px-16">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-flame-orange text-5xl">
              local_shipping
            </span>
            <div>
              <h4 className="font-headline text-3xl">CALCULAR FRETE</h4>
              <p className="text-on-surface-variant font-body">
                Veja o prazo e valor de entrega para sua região
              </p>
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="00000-000"
              className="bg-surface-container border border-outline-variant/40 rounded-lg px-6 py-3 w-full md:w-64 focus:border-flame-orange outline-none text-on-surface font-headline tracking-widest text-2xl"
            />
            <button className="bg-bone-white text-black font-title font-bold px-8 py-3 rounded-lg hover:bg-primary-fixed-dim transition-all uppercase text-sm">
              Calcular
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
