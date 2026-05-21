"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Loja", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Unidades", href: "/unidades" },
];

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30">
      <nav className="flex justify-between items-center w-full px-4 md:px-16 py-2 max-w-screen-2xl mx-auto">
        <Link
          href="/"
          className="font-headline text-3xl text-flame-orange tracking-tighter uppercase"
        >
          CHICO GRILL
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-on-surface-variant hover:text-flame-orange transition-colors text-sm font-title font-semibold tracking-wider uppercase"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
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
    </header>
  );
}
