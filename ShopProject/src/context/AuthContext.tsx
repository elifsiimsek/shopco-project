import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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
  updateProfile: (
    data: Partial<Pick<User, "name" | "email" | "birthDate">>,
  ) => void;
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

  const login = (userData: {
    name: string;
    email: string;
    birthDate: string;
  }) => {
    const finalUser: User = {
      ...userData,
      orders: [],
      favorites: [],
      savedCards: [],
      addresses: [],
      hasWelcomeCoupon: true,
    };
    setUser(finalUser);
    localStorage.setItem("shopco_user", JSON.stringify(finalUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shopco_user");
    window.location.href = "/";
  };

  const addOrder = (order: Order) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, orders: [order, ...(prev.orders || [])] };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const saveCard = (card: Omit<Card, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newCard = { ...card, id: Date.now().toString() };
      const updated = {
        ...prev,
        savedCards: [newCard, ...(prev.savedCards || [])],
      };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const saveAddress = (address: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newAddress = { ...address, id: Date.now().toString() };
      const updated = {
        ...prev,
        addresses: [newAddress, ...(prev.addresses || [])],
      };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== id),
      };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCard = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        savedCards: prev.savedCards.filter((c) => c.id !== id),
      };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const updateAddress = (id: string, addr: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        addresses: prev.addresses.map((a) =>
          a.id === id ? { ...addr, id } : a,
        ),
      };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const updateCard = (id: string, crd: Omit<Card, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        savedCards: prev.savedCards.map((c) =>
          c.id === id ? { ...crd, id } : c,
        ),
      };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const updateProfile = (
    data: Partial<Pick<User, "name" | "email" | "birthDate">>,
  ) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (productId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedFavs = prev.favorites.includes(productId)
        ? prev.favorites.filter((id) => id !== productId)
        : [...prev.favorites, productId];
      const updated = { ...prev, favorites: updatedFavs };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        addOrder,
        saveCard,
        saveAddress,
        deleteAddress,
        deleteCard,
        updateAddress,
        updateCard,
        updateProfile,
        toggleFavorite,
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
