"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, formatPrice } from "@/lib/products";
import ShippingCalc from "@/components/ShippingCalc";

const categories = ["Todos", "Camisetas", "Moletons", "Acessórios"];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-charcoal-deep">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={products[0].images[2]}
            alt="hero"
            fill
            className="object-cover opacity-30"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep via-charcoal-deep/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 md:px-16 w-full py-24">
          <div className="max-w-2xl">
            <span className="inline-block bg-flame-orange text-black font-title font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
              Nova Coleção 2026
            </span>

            <h1 className="font-headline text-[72px] md:text-[110px] leading-none text-white uppercase mb-6">
              BRASA<br />
              <span className="text-flame-orange">&amp; ESTILO.</span>
            </h1>

            <p className="font-body text-lg text-white/70 max-w-md mb-10 leading-relaxed">
              O estilo da churrascaria mais insana de São Paulo, agora em cada
              peça. Streetwear com a intensidade da brasa.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#products"
                className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:bg-secondary-container transition-all active:scale-95"
              >
                Ver Coleção
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:border-flame-orange hover:text-flame-orange transition-all active:scale-95"
              >
                Criar Conta
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-16 pt-8 border-t border-white/10">
              {[
                { value: "2K+", label: "Clientes" },
                { value: "50+", label: "Produtos" },
                { value: "4.9★", label: "Avaliação" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-headline text-3xl text-flame-orange">
                    {s.value}
                  </p>
                  <p className="font-body text-xs text-white/50 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-white/40 text-2xl">
            keyboard_arrow_down
          </span>
        </div>
      </section>

      {/* ── Category filter ── */}
      <div
        id="products"
        className="sticky top-16 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-16"
      >
        <div className="max-w-screen-2xl mx-auto flex gap-1 py-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-title font-semibold text-sm uppercase tracking-wider whitespace-nowrap px-5 py-2 rounded-full transition-all ${
                activeCategory === cat
                  ? "bg-flame-orange text-black"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products grid ── */}
      <section className="max-w-screen-2xl mx-auto px-4 md:px-16 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface uppercase">
              {activeCategory === "Todos" ? "A Coleção" : activeCategory}
            </h2>
            <p className="font-body text-base text-on-surface-variant">
              {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-on-surface-variant font-body">
            Nenhum produto nesta categoria ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] bg-surface-container rounded-xl overflow-hidden mb-4 relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                  {product.badge && (
                    <div className="absolute top-4 right-4 bg-flame-orange text-black px-3 py-1 font-headline text-base rounded-sm">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="font-title font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                      Ver Produto
                      <span className="material-symbols-outlined text-base">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start px-1">
                  <div>
                    <h3 className="font-title font-bold text-base text-on-surface uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant">
                      {product.category}
                    </p>
                  </div>
                  <span className="font-headline text-xl text-flame-orange">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Brand strip ── */}
      <section className="bg-flame-orange py-8 overflow-hidden">
        <div className="flex gap-16 animate-[slide_20s_linear_infinite] whitespace-nowrap">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                className="font-headline text-2xl text-black uppercase tracking-widest shrink-0"
              >
                CHICO GRILL · COLEÇÃO 2026 · UNAPOLOGETIC STYLE ·
              </span>
            ))}
        </div>
      </section>

      {/* ── Shipping calc ── */}
      <ShippingCalc />
    </div>
  );
}
