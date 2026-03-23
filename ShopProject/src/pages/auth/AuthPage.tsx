import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface Order {
  id: string;
  date: string;
  total: number;
  itemsCount: number;
  status: string;
}

export interface Card {
  number: string;
  holder: string;
  expiry: string;
}

interface User {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  savedCard: Card | null;
  orders: Order[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, "orders" | "savedCard">) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  saveCard: (card: Card) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("shopco_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (userData: Omit<User, "orders" | "savedCard">) => {
    const finalUser: User = { ...userData, orders: [], savedCard: null };
    setUser(finalUser);
    localStorage.setItem("shopco_user", JSON.stringify(finalUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shopco_user");
  };

  const addOrder = (order: Order) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, orders: [order, ...(prev.orders || [])] };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const saveCard = (card: Card) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, savedCard: card };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addOrder, saveCard }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth error");
  return context;
};
