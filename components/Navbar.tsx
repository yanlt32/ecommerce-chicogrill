"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { count } = useCart();

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
          {["Shop", "About", "Units"].map((item) => (
            <Link
              key={item}
              href={item === "Shop" ? "/" : "#"}
              className="text-on-surface-variant hover:text-flame-orange transition-colors text-sm font-title font-semibold tracking-wider uppercase"
            >
              {item}
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
          <button className="hover:bg-surface-container-high/50 transition-all p-2 rounded-full active:scale-95 duration-150">
            <span className="material-symbols-outlined text-flame-orange">
              account_circle
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
