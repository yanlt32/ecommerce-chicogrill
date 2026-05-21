"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, products, formatPrice } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  function handleAddToCart() {
    if (adding || added) return;
    setAdding(true);
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) {
        addItem(product, selectedSize);
      }
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 600);
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-16 py-8">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 py-2 lg:py-6">
        {/* Gallery */}
        <div className="md:col-span-7 flex flex-col gap-3">
          <div className="aspect-square overflow-hidden bg-surface-container rounded-xl group relative">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square overflow-hidden bg-surface-container rounded-lg relative transition-all ${
                    selectedImage === i
                      ? "ring-2 ring-flame-orange"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="md:col-span-5 md:sticky md:top-[100px] flex flex-col gap-6">
          <div>
            <h1 className="font-headline text-4xl md:text-5xl text-on-surface tracking-tighter mb-2 uppercase">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-headline text-3xl text-flame-orange">
                {formatPrice(product.price)}
              </span>
              <div className="h-6 w-px bg-outline-variant/30" />
              <div className="flex items-center gap-1 text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-title font-semibold text-sm">
                  4.9 (124 reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-outline-variant/20" />

          {/* Size selector */}
          {product.sizes && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-title font-bold text-lg uppercase tracking-tight">
                  Tamanho
                </label>
                <button className="text-on-surface-variant text-sm underline hover:text-flame-orange transition-colors font-title">
                  Guia de Medidas
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-4 border-2 rounded-lg font-title font-bold text-lg transition-all active:scale-95 ${
                      selectedSize === size
                        ? "border-flame-orange bg-flame-orange text-black"
                        : "border-outline-variant/40 hover:border-flame-orange text-on-surface"
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
            <label className="font-title font-bold text-lg uppercase tracking-tight">
              Quantidade
            </label>
            <div className="flex gap-4 h-14">
              <div className="flex items-center border-2 border-outline-variant/40 rounded-lg px-4 bg-surface-container-low gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 hover:text-flame-orange transition-colors"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-8 text-center font-title font-bold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 hover:text-flame-orange transition-colors"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 font-title font-bold text-base uppercase tracking-tighter rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                  added
                    ? "bg-meat-red text-white"
                    : "bg-flame-orange text-black hover:brightness-110"
                }`}
              >
                {adding ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    Adicionando...
                  </>
                ) : added ? (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    Adicionado!
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">shopping_bag</span>
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 bg-surface-container rounded-xl border border-outline-variant/20">
            <h3 className="font-title font-bold text-lg mb-2 text-on-surface">
              O Toque do Mestre
            </h3>
            <p className="font-body text-base text-on-surface-variant">
              {product.description}
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-flame-orange">
                  local_shipping
                </span>
                <span className="font-title font-semibold text-sm">
                  Frete Grátis em compras acima de R$ 300
                </span>
              </div>
              {product.material && (
                <div className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-flame-orange">
                    verified
                  </span>
                  <span className="font-title font-semibold text-sm">
                    {product.material}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface uppercase leading-none">
              Completar o Visual
            </h2>
            <p className="font-body text-lg text-on-surface-variant">
              Equipamento para quem leva o fogo a sério.
            </p>
          </div>
          <Link
            href="/"
            className="text-on-surface border-b-2 border-on-surface pb-1 font-title font-semibold text-sm uppercase tracking-widest hover:text-flame-orange hover:border-flame-orange transition-all"
          >
            Ver tudo
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] bg-surface-container rounded-xl overflow-hidden mb-4 relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                {item.badge && (
                  <div className="absolute top-4 right-4 bg-flame-orange text-black px-3 py-1 font-headline text-base rounded-sm">
                    {item.badge}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start">
                <h3 className="font-title font-bold text-sm uppercase">
                  {item.name}
                </h3>
                <span className="font-headline text-xl text-flame-orange">
                  {formatPrice(item.price)}
                </span>
              </div>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                {item.description.substring(0, 50)}...
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
