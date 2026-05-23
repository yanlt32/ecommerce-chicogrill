"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, products, formatPrice } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SizeGuide from "@/components/SizeGuide";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

function Stars({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer" : "cursor-default pointer-events-none"}
        >
          <span
            className={`material-symbols-outlined text-lg transition-colors ${
              n <= (hover || rating) ? "text-yellow-400" : "text-outline-variant"
            }`}
            style={{ fontVariationSettings: n <= (hover || rating) ? "'FILL' 1" : "'FILL' 0" }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Reviews
  const reviewKey = `cg_reviews_${product.id}`;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(reviewKey);
      if (stored) setReviews(JSON.parse(stored));
    } catch { /* ignore */ }
  }, [reviewKey]);

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    const review: Review = {
      id: Math.random().toString(36).slice(2),
      name: user?.name ?? "Cliente",
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString("pt-BR"),
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    localStorage.setItem(reviewKey, JSON.stringify(updated));
    setReviewComment("");
    setReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 4.9;
  const reviewCount = reviews.length || 124;

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 4);

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  function handleAddToCart() {
    if (adding || added || outOfStock) return;
    setAdding(true);
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) addItem(product, selectedSize);
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 600);
  }

  return (
    <>
      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightboxOpen(false)}>
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <button
            className="absolute left-4 text-white"
            onClick={(e) => { e.stopPropagation(); setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length); }}
          >
            <span className="material-symbols-outlined text-4xl">chevron_left</span>
          </button>
          <div className="relative w-full max-w-2xl aspect-square" onClick={(e) => e.stopPropagation()}>
            <Image src={product.images[selectedImage]} alt={product.name} fill className="object-contain" unoptimized />
          </div>
          <button
            className="absolute right-4 text-white"
            onClick={(e) => { e.stopPropagation(); setSelectedImage((i) => (i + 1) % product.images.length); }}
          >
            <span className="material-symbols-outlined text-4xl">chevron_right</span>
          </button>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-4 md:px-16 py-8">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 py-2 lg:py-6">
          {/* Gallery */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div
              className="aspect-square overflow-hidden bg-surface-container rounded-xl group relative cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-base">zoom_in</span>
              </div>
              {outOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="font-headline text-3xl text-white uppercase">Esgotado</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square overflow-hidden bg-surface-container rounded-lg relative transition-all ${
                      selectedImage === i ? "ring-2 ring-flame-orange" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-5 md:sticky md:top-[100px] flex flex-col gap-6">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="font-headline text-4xl md:text-5xl text-on-surface tracking-tighter mb-2 uppercase">
                  {product.name}
                </h1>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="mt-1 shrink-0 p-2 rounded-full hover:bg-surface-container-high transition-colors"
                  aria-label="Favoritar"
                >
                  <span
                    className={`material-symbols-outlined text-2xl transition-colors ${isWishlisted(product.id) ? "text-meat-red" : "text-on-surface-variant"}`}
                    style={{ fontVariationSettings: isWishlisted(product.id) ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-headline text-3xl text-flame-orange">{formatPrice(product.price)}</span>
                <div className="h-6 w-px bg-outline-variant/30" />
                <button onClick={() => {}} className="flex items-center gap-1 text-on-surface-variant hover:text-flame-orange transition-colors">
                  <Stars rating={Math.round(avgRating)} />
                  <span className="font-title font-semibold text-sm ml-1">
                    {avgRating.toFixed(1)} ({reviewCount})
                  </span>
                </button>
              </div>

              {/* Stock indicator */}
              <div className="mt-3">
                {outOfStock ? (
                  <span className="inline-flex items-center gap-1.5 font-title font-semibold text-xs text-meat-red uppercase">
                    <span className="w-2 h-2 rounded-full bg-meat-red" />
                    Esgotado
                  </span>
                ) : lowStock ? (
                  <span className="inline-flex items-center gap-1.5 font-title font-semibold text-xs text-yellow-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    Últimas {product.stock} unidades!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-title font-semibold text-xs text-green-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Em estoque ({product.stock} disponíveis)
                  </span>
                )}
              </div>
            </div>

            <div className="h-px w-full bg-outline-variant/20" />

            {/* Size selector */}
            {product.sizes && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-title font-bold text-lg uppercase tracking-tight">Tamanho</label>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-on-surface-variant text-sm underline hover:text-flame-orange transition-colors font-title flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">straighten</span>
                    Guia de Medidas
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={outOfStock}
                      className={`py-4 border-2 rounded-lg font-title font-bold text-lg transition-all active:scale-95 ${
                        selectedSize === size
                          ? "border-flame-orange bg-flame-orange text-black"
                          : "border-outline-variant/40 hover:border-flame-orange text-on-surface disabled:opacity-40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA */}
            <div className="flex flex-col gap-4">
              <label className="font-title font-bold text-lg uppercase tracking-tight">Quantidade</label>
              <div className="flex gap-4 h-14">
                <div className="flex items-center border-2 border-outline-variant/40 rounded-lg px-4 bg-surface-container-low gap-2">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-1 hover:text-flame-orange transition-colors">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-8 text-center font-title font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-1 hover:text-flame-orange transition-colors disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={`flex-1 font-title font-bold text-base uppercase tracking-tighter rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    added ? "bg-meat-red text-white" : "bg-flame-orange text-black hover:brightness-110"
                  }`}
                >
                  {adding ? (
                    <><span className="material-symbols-outlined animate-spin">progress_activity</span>Adicionando...</>
                  ) : added ? (
                    <><span className="material-symbols-outlined">check_circle</span>Adicionado!</>
                  ) : outOfStock ? (
                    "Esgotado"
                  ) : (
                    <><span className="material-symbols-outlined">shopping_bag</span>Adicionar ao Carrinho</>
                  )}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 bg-surface-container rounded-xl border border-outline-variant/20">
              <h3 className="font-title font-bold text-lg mb-2 text-on-surface">O Toque do Mestre</h3>
              <p className="font-body text-base text-on-surface-variant">{product.description}</p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-flame-orange">local_shipping</span>
                  <span className="font-title font-semibold text-sm">Frete Grátis em compras acima de R$ 300</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-flame-orange">sync_alt</span>
                  <span className="font-title font-semibold text-sm">Troca grátis em até 30 dias</span>
                </div>
                {product.material && (
                  <div className="flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-flame-orange">verified</span>
                    <span className="font-title font-semibold text-sm">{product.material}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-16 border-t border-outline-variant/20">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Summary */}
            <div className="shrink-0 md:w-48 text-center md:text-left">
              <p className="font-headline text-7xl text-flame-orange leading-none">{avgRating.toFixed(1)}</p>
              <Stars rating={Math.round(avgRating)} />
              <p className="font-body text-sm text-on-surface-variant mt-1">{reviewCount} avaliações</p>
            </div>

            {/* List + form */}
            <div className="flex-1 space-y-6">
              <h2 className="font-headline text-3xl uppercase">Avaliações</h2>

              {reviews.length > 0 && (
                <div className="space-y-4 mb-6">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/20">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-title font-bold text-sm text-on-surface uppercase">{r.name}</p>
                          <p className="font-body text-xs text-on-surface-variant">{r.date}</p>
                        </div>
                        <Stars rating={r.rating} />
                      </div>
                      <p className="font-body text-sm text-on-surface-variant">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review form */}
              <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/20">
                <h3 className="font-headline text-xl uppercase mb-4">Deixe sua Avaliação</h3>
                {!user ? (
                  <p className="font-body text-sm text-on-surface-variant">
                    <Link href="/login" className="text-flame-orange hover:underline">Entre na sua conta</Link> para avaliar este produto.
                  </p>
                ) : reviewSubmitted ? (
                  <p className="font-body text-sm text-green-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Avaliação enviada! Obrigado.
                  </p>
                ) : (
                  <form onSubmit={submitReview} className="space-y-4">
                    <div>
                      <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">Sua nota</label>
                      <Stars rating={reviewRating} interactive onChange={setReviewRating} />
                    </div>
                    <div>
                      <label className="font-title font-semibold text-xs text-on-surface-variant uppercase block mb-2">Comentário</label>
                      <textarea
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="O que você achou do produto?"
                        rows={3}
                        className="w-full bg-surface border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface font-body text-sm focus:border-flame-orange outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-flame-orange text-black font-title font-bold text-sm px-6 py-3 rounded-full uppercase hover:bg-secondary-container transition-all active:scale-95"
                    >
                      Enviar Avaliação
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        <section className="py-16 border-t border-outline-variant/20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline text-4xl md:text-5xl text-on-surface uppercase leading-none">Completar o Visual</h2>
              <p className="font-body text-lg text-on-surface-variant">Equipamento para quem leva o fogo a sério.</p>
            </div>
            <Link href="/" className="text-on-surface border-b-2 border-on-surface pb-1 font-title font-semibold text-sm uppercase tracking-widest hover:text-flame-orange hover:border-flame-orange transition-all">
              Ver tudo
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link key={item.id} href={`/product/${item.id}`} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-surface-container rounded-xl overflow-hidden mb-4 relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                  {item.badge && (
                    <div className="absolute top-4 right-4 bg-flame-orange text-black px-3 py-1 font-headline text-base rounded-sm">{item.badge}</div>
                  )}
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="font-headline text-xl text-white uppercase">Esgotado</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="font-title font-bold text-sm uppercase">{item.name}</h3>
                  <span className="font-headline text-xl text-flame-orange">{formatPrice(item.price)}</span>
                </div>
                <p className="font-body text-sm text-on-surface-variant mt-1">{item.description.substring(0, 50)}...</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
