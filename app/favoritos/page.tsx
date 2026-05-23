"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { products, formatPrice } from "@/lib/products";

export default function FavoritosPage() {
  const { wishlist, toggleWishlist } = useWishlist();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-16 py-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <h1 className="font-headline text-4xl md:text-5xl text-on-surface uppercase">
          MEUS FAVORITOS
        </h1>
        {favoriteProducts.length > 0 && (
          <span className="inline-flex items-center justify-center h-8 min-w-8 px-2.5 rounded-full bg-flame-orange text-black font-title font-bold text-sm">
            {favoriteProducts.length}
          </span>
        )}
      </div>

      {/* Empty state */}
      {favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
            favorite_border
          </span>
          <p className="font-headline text-2xl text-on-surface uppercase mb-2">
            Você não tem favoritos ainda
          </p>
          <p className="font-body text-sm text-on-surface-variant mb-8">
            Explore nossa coleção e salve os produtos que você ama.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:bg-secondary-container transition-all active:scale-95"
          >
            Explorar Loja
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      ) : (
        /* Products grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="group relative">
              {/* Image */}
              <div className="aspect-[4/5] bg-surface-container rounded-xl overflow-hidden mb-4 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-flame-orange text-black px-3 py-1 font-headline text-base rounded-sm">
                    {product.badge}
                  </div>
                )}

                {/* Remove from wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Remover dos favoritos"
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-charcoal-deep/70 backdrop-blur-sm flex items-center justify-center text-flame-orange hover:text-meat-red transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    favorite
                  </span>
                </button>
              </div>

              {/* Info */}
              <div className="px-1 mb-4">
                <h3 className="font-title font-bold text-base text-on-surface uppercase tracking-tight">
                  {product.name}
                </h3>
                <p className="font-body text-sm text-on-surface-variant">
                  {product.category}
                </p>
                <span className="font-headline text-xl text-flame-orange mt-1 block">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* CTA */}
              <Link
                href={`/product/${product.id}`}
                className="block w-full text-center bg-surface-container-high border border-outline-variant/30 hover:border-flame-orange hover:text-flame-orange text-on-surface font-title font-bold text-sm py-3 rounded-full uppercase tracking-wide transition-all active:scale-95"
              >
                Ver Produto
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
