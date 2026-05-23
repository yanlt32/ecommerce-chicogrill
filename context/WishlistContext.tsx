"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type WishlistContextType = {
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "cg_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  function toggleWishlist(id: number) {
    setWishlist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function isWishlisted(id: number): boolean {
    return wishlist.includes(id);
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
