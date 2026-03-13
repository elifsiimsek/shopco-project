import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
export interface Order {
  id: string;
  date: string;
  total: number;
  itemsCount: number;
  status: string;
  items: any[];
}

export interface Card {
  number: string;
  holder: string;
  expiry: string;
}

export interface Address {
  title: string;
  city: string;
  district: string;
  fullAddress: string;
}

export interface User {
  name: string;
  email: string;
  birthDate: string; 
  address: Address | null;
  savedCard: Card | null;
  orders: Order[];
  hasWelcomeCoupon: boolean;
}

interface LoginData {
  name: string;
  email: string;
  birthDate: string;
}

interface ProfileUpdateData {
  name?: string;
  email?: string;
  birthDate?: string;
  hasWelcomeCoupon?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: LoginData) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  saveCard: (card: Card) => void;
  saveAddress: (address: Address) => void;
  updateProfile: (data: ProfileUpdateData) => void;
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

  const login = (userData: LoginData) => {
    const finalUser: User = {
      orders: [],
      savedCard: null,
      address: null,
      hasWelcomeCoupon: true,
      ...userData
    };
    setUser(finalUser);
    localStorage.setItem("shopco_user", JSON.stringify(finalUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shopco_user");
  };

  const addOrder = (order: Order) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, orders: [order, ...(prev.orders || [])] };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const saveCard = (card: Card) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, savedCard: card };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const saveAddress = (address: Address) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, address: address };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const updateProfile = (data: ProfileUpdateData) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addOrder, saveCard, saveAddress, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};