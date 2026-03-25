import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  img: string;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  itemsCount: number;
  status: string;
  items: OrderItem[];
}

export interface Card {
  id: string;
  number: string;
  holder: string;
  expiry: string;
}

export interface Address {
  id: string;
  title: string;
  city: string;
  district: string;
  fullAddress: string;
}

export interface User {
  name: string;
  email: string;
  birthDate: string;
  addresses: Address[];
  savedCards: Card[];
  orders: Order[];
  favorites: string[];
  hasWelcomeCoupon: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: { name: string; email: string; birthDate: string }) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  saveCard: (card: Omit<Card, "id">) => void;
  saveAddress: (address: Omit<Address, "id">) => void;
  deleteAddress: (id: string) => void;
  deleteCard: (id: string) => void;
  updateAddress: (id: string, address: Omit<Address, "id">) => void;
  updateCard: (id: string, card: Omit<Card, "id">) => void;
  updateProfile: (data: Partial<Pick<User, "name" | "email" | "birthDate">>) => void;
  toggleFavorite: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("shopco_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("shopco_user");
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("shopco_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shopco_user");
    }
  }, [user]);

  const login = (userData: { name: string; email: string; birthDate: string }) => {
    setUser({
      ...userData,
      orders: [],
      favorites: [],
      savedCards: [],
      addresses: [],
      hasWelcomeCoupon: true,
    });
  };

  const logout = () => {
    setUser(null);
    window.location.href = "/";
  };

  const addOrder = (order: Order) => {
    setUser((prev) => prev ? { ...prev, orders: [order, ...(prev.orders || [])] } : null);
  };

  const saveCard = (card: Omit<Card, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newCard = { ...card, id: `CRD-${Date.now()}` };
      return { ...prev, savedCards: [newCard, ...(prev.savedCards || [])] };
    });
  };

  const saveAddress = (address: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newAddress = { ...address, id: `ADR-${Date.now()}` };
      return { ...prev, addresses: [newAddress, ...(prev.addresses || [])] };
    });
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => prev ? { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) } : null);
  };

  const deleteCard = (id: string) => {
    setUser((prev) => prev ? { ...prev, savedCards: prev.savedCards.filter((c) => c.id !== id) } : null);
  };

  const updateAddress = (id: string, addr: Omit<Address, "id">) => {
    setUser((prev) => prev ? {
      ...prev,
      addresses: prev.addresses.map((a) => a.id === id ? { ...addr, id } : a)
    } : null);
  };

  const updateCard = (id: string, crd: Omit<Card, "id">) => {
    setUser((prev) => prev ? {
      ...prev,
      savedCards: prev.savedCards.map((c) => c.id === id ? { ...crd, id } : c)
    } : null);
  };

  const updateProfile = (data: Partial<Pick<User, "name" | "email" | "birthDate">>) => {
    setUser((prev) => prev ? { ...prev, ...data } : null);
  };

  const toggleFavorite = (productId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedFavs = prev.favorites.includes(productId)
        ? prev.favorites.filter((id) => id !== productId)
        : [...prev.favorites, productId];
      return { ...prev, favorites: updatedFavs };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user, login, logout, addOrder, saveCard, saveAddress,
        deleteAddress, deleteCard, updateAddress, updateCard,
        updateProfile, toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};