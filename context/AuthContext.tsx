"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type User = {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
};

export type Address = {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  size: string;
  image: string;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
  status: "Processando" | "Enviado" | "Entregue";
  address: Address;
  payMethod: string;
};

type AuthContextType = {
  user: User | null;
  address: Address | null;
  orders: Order[];
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  saveAddress: (addr: Address) => void;
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => Order;
  // admin: all orders from all users
  allOrders: Order[];
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  user: "cg_user",
  address: "cg_address",
  orders: "cg_orders",
  allOrders: "cg_all_orders",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const u = localStorage.getItem(STORAGE_KEYS.user);
      const a = localStorage.getItem(STORAGE_KEYS.address);
      const ao = localStorage.getItem(STORAGE_KEYS.allOrders);
      if (u) {
        const parsedUser: User = JSON.parse(u);
        setUser(parsedUser);
        const o = localStorage.getItem(`cg_orders_${parsedUser.email}`);
        if (o) setOrders(JSON.parse(o));
      }
      if (a) setAddress(JSON.parse(a));
      if (ao) setAllOrders(JSON.parse(ao));
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  function login(u: User) {
    setUser(u);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u));
    // load this user's orders
    const key = `cg_orders_${u.email}`;
    const stored = localStorage.getItem(key);
    const userOrders = stored ? JSON.parse(stored) : [];
    setOrders(userOrders);
  }

  function logout() {
    setUser(null);
    setOrders([]);
    localStorage.removeItem(STORAGE_KEYS.user);
  }

  function updateUser(updates: Partial<User>) {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updated));
      // keep stored credentials in sync
      const credKey = `cg_user_${prev.email}`;
      const stored = localStorage.getItem(credKey);
      if (stored) {
        localStorage.setItem(credKey, JSON.stringify({ ...JSON.parse(stored), ...updates }));
      }
      return updated;
    });
  }

  function saveAddress(addr: Address) {
    setAddress(addr);
    localStorage.setItem(STORAGE_KEYS.address, JSON.stringify(addr));
  }

  function addOrder(orderData: Omit<Order, "id" | "date" | "status">): Order {
    const order: Order = {
      ...orderData,
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      date: new Date().toLocaleDateString("pt-BR"),
      status: "Processando",
    };

    // Save to user orders
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    if (user) {
      localStorage.setItem(
        `cg_orders_${user.email}`,
        JSON.stringify(updatedOrders)
      );
    }

    // Save to all orders (admin)
    const updatedAll = [order, ...allOrders];
    setAllOrders(updatedAll);
    localStorage.setItem(STORAGE_KEYS.allOrders, JSON.stringify(updatedAll));

    return order;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        address,
        orders,
        isLoading,
        login,
        logout,
        updateUser,
        saveAddress,
        addOrder,
        allOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
