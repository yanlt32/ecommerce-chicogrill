"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

const NAV_LINKS = [
  { label: "Loja", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Unidades", href: "/unidades" },
];

const MOBILE_MENU = {
  navegacao: [
    { label: "Loja", href: "/" },
    { label: "Minha Conta", href: "/account" },
    { label: "Meus Pedidos", href: "/account" },
    { label: "Carrinho", href: "/cart" },
  ],
  ajuda: [
    { label: "Envio e Entrega", href: "/trocas" },
    { label: "Trocas e Devoluções", href: "/trocas" },
    { label: "Contato", href: "/contato" },
    { label: "FAQ", href: "/contato" },
  ],
  notificacoes: [{ label: "NOTIFICAÇÕES", href: "/#notifications" }],
};

export default function Navbar() {
  const router = useRouter();
  const { count } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30">
      <nav className="relative flex justify-between items-center w-full px-4 md:px-16 py-2 max-w-screen-2xl mx-auto">
        <Link href="/" className="logo" aria-label="Chico Grill - Página inicial">
          <span className="logo-text">
            CHICO
            <span className="logo-accent">GRILL</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-bone-white/80 hover:text-flame-orange transition-colors text-sm font-title font-semibold tracking-wider uppercase"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                ref={searchRef}
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produto..."
                className="bg-surface-container border border-outline-variant/40 rounded-full px-4 py-1.5 text-on-surface font-body text-sm focus:border-flame-orange outline-none w-48 md:w-64"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-on-surface-variant hover:text-flame-orange">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="hover:bg-surface-container-high/50 transition-all p-2 rounded-full active:scale-95 duration-150">
              <span className="material-symbols-outlined text-flame-orange">search</span>
            </button>
          )}

          {/* Wishlist */}
          <Link href="/favoritos" className="relative hover:bg-surface-container-high/50 transition-all p-2 rounded-full active:scale-95 duration-150">
            <span className="material-symbols-outlined text-flame-orange">favorite</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-meat-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            className="md:hidden hover:bg-surface-container-high/50 transition-all p-2 rounded-full active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-flame-orange">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>

          <Link
            href="/cart"
            className="relative hover:bg-surface-container-high/50 transition-all p-2 rounded-full active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-flame-orange">
              shopping_cart
            </span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-meat-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="flex items-center gap-2 hover:bg-surface-container-high/50 transition-all px-3 py-1.5 rounded-full active:scale-95"
              >
                <span className="material-symbols-outlined text-flame-orange text-xl">
                  account_circle
                </span>
                <span className="hidden md:block font-title font-semibold text-xs text-on-surface uppercase truncate max-w-24">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1 text-on-surface-variant hover:text-meat-red transition-colors text-xs font-title font-semibold uppercase"
                title="Sair"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hover:bg-surface-container-high/50 transition-all p-2 rounded-full active:scale-95 duration-150"
            >
              <span className="material-symbols-outlined text-flame-orange">
                account_circle
              </span>
            </Link>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-outline-variant/20 bg-surface/95 backdrop-blur-md">
          <div className="max-w-screen-2xl mx-auto px-4 py-4 space-y-6">
            <div className="space-y-3">
              <p className="font-title text-xs uppercase tracking-widest text-bone-white">Navegação</p>
              <div className="grid grid-cols-2 gap-2">
                {MOBILE_MENU.navegacao.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-title font-semibold uppercase text-bone-white/80 hover:border-flame-orange hover:text-flame-orange transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-title text-xs uppercase tracking-widest text-bone-white">Ajuda</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MOBILE_MENU.ajuda.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-title font-semibold uppercase text-bone-white/80 hover:border-flame-orange hover:text-flame-orange transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-title text-xs uppercase tracking-widest text-bone-white">Notificações</p>
              {MOBILE_MENU.notificacoes.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-title font-semibold uppercase text-bone-white/80 hover:border-flame-orange hover:text-flame-orange transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
