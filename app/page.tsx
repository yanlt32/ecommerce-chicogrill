import Link from "next/link";
import Image from "next/image";
import { products, formatPrice } from "@/lib/products";

const categories = ["Todos", "Camisetas", "Moletons", "Acessórios"];

export default function ShopPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-surface-container-lowest py-32 px-4 md:px-16 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
          <p className="font-body text-sm text-flame-orange uppercase tracking-widest mb-4">
            Nova Coleção
          </p>
          <h1 className="font-headline text-[80px] leading-none text-on-surface uppercase mb-6">
            RAW
            <br />
            QUALITY
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-md mb-8">
            Equipamento para quem leva o fogo a sério. Cada peça é uma
            declaração.
          </p>
          <Link
            href="#products"
            className="inline-flex items-center gap-2 bg-flame-orange text-black font-title font-bold px-8 py-4 rounded-full uppercase tracking-wide hover:bg-secondary-container transition-all active:scale-95"
          >
            Ver Coleção
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-gradient-to-l from-flame-orange to-transparent pointer-events-none" />
      </section>

      {/* Category filter */}
      <div className="sticky top-16 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-16">
        <div className="max-w-screen-2xl mx-auto flex gap-6 py-4 overflow-x-auto">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`font-title font-semibold text-sm uppercase tracking-wider whitespace-nowrap pb-2 border-b-2 transition-all ${
                i === 0
                  ? "border-flame-orange text-flame-orange"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <section
        id="products"
        className="max-w-screen-2xl mx-auto px-4 md:px-16 py-16"
      >
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface uppercase">
              A Coleção
            </h2>
            <p className="font-body text-base text-on-surface-variant">
              {products.length} produtos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
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
      </section>

      {/* Shipping banner */}
      <section className="bg-surface-container-highest/50 py-12 mt-8">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
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
