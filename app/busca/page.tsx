"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { products, formatPrice } from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";

function BuscaContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { isWishlisted, toggleWishlist } = useWishlist();

  const filtered = q.trim()
    ? products.filter((p) => {
        const term = q.toLowerCase();
        return (
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        );
      })
    : products;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-16 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl text-on-surface uppercase">
          {q.trim() ? (
            <>
              RESULTADOS PARA:{" "}
              <span className="text-flame-orange">"{q}"</span>
            </>
          ) : (
            "BUSCA"
          )}
        </h1>
        <p className="font-body text-sm text-on-surface-variant mt-2">
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""}{" "}
          encontrado{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* No results */}
      {q.trim() && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
            search_off
          </span>
          <p className="font-headline text-2xl text-on-surface uppercase mb-2">
            Nenhum produto encontrado
          </p>
          <p className="font-body text-sm text-on-surface-variant mb-8">
            para &ldquo;{q}&rdquo;
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:bg-secondary-container transition-all active:scale-95"
          >
            Ver Todos os Produtos
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      ) : (
        /* Products grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="group cursor-pointer relative">
              <Link href={`/product/${product.id}`}>
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
              </Link>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label={
                  isWishlisted(product.id)
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
                }
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-charcoal-deep/60 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-flame-orange transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  {isWishlisted(product.id) ? "favorite" : "favorite_border"}
                </span>
              </button>

              <Link href={`/product/${product.id}`}>
                <div className="flex justify-between items-start px-1">
                  <div>
                    <h3 className="font-title font-bold text-base text-on-surface uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-bone-white/80">
                      {product.category}
                    </p>
                  </div>
                  <span className="font-headline text-xl text-flame-orange">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuscaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-flame-orange text-4xl">
            progress_activity
          </span>
        </div>
      }
    >
      <BuscaContent />
    </Suspense>
  );
}
