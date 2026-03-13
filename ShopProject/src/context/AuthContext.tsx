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
  favorites: string[];
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
  toggleFavorite: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("shopco_user");
    if (saved) {
      try {
        const parsedUser: User = JSON.parse(saved);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("shopco_user");
      }
    }
  }, []);

  const login = (userData: LoginData) => {
    const finalUser: User = {
      orders: [],
      favorites: [],
      savedCard: null,
      address: null,
      hasWelcomeCoupon: true,
      ...userData,
    };
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
      const updated: User = {
        ...prev,
        orders: [order, ...(prev.orders || [])],
      };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const saveCard = (card: Card) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser: User = { 
        ...prev, 
        savedCard: { ...card } 
      };
      localStorage.setItem("shopco_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const saveAddress = (address: Address) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser: User = { 
        ...prev, 
        address: { ...address } 
      };
      localStorage.setItem("shopco_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateProfile = (data: ProfileUpdateData) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated: User = { ...prev, ...data };
      localStorage.setItem("shopco_user", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (productId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const currentFavs = prev.favorites || [];
      const isFav = currentFavs.includes(productId);
      const updatedFavs = isFav
        ? currentFavs.filter((id) => id !== productId)
        : [...currentFavs, productId];
      const updated: User = { ...prev, favorites: updatedFavs };
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