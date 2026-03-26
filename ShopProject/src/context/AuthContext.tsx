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
  password?: string;
  birthDate: string;
  addresses: Address[];
  savedCards: Card[];
  orders: Order[];
  favorites: string[];
  hasWelcomeCoupon: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  register: (userData: User) => void;
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
  const [user, setUser] = useState<User | null>(() => {
    const active = localStorage.getItem("shopco_active_user");
    return active ? JSON.parse(active) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("shopco_active_user", JSON.stringify(user));
      const allUsers = JSON.parse(
        localStorage.getItem("shopco_all_users") || "[]",
      );
      const updatedUsers = allUsers.filter((u: User) => u.email !== user.email);
      localStorage.setItem(
        "shopco_all_users",
        JSON.stringify([...updatedUsers, user]),
      );
    } else {
      localStorage.removeItem("shopco_active_user");
    }
  }, [user]);

  const register = (userData: User) => {
    const allUsers = JSON.parse(
      localStorage.getItem("shopco_all_users") || "[]",
    );
    if (allUsers.find((u: User) => u.email === userData.email)) return;
    setUser(userData);
  };

  const login = (email: string, pass: string) => {
    const allUsers = JSON.parse(
      localStorage.getItem("shopco_all_users") || "[]",
    );
    const found = allUsers.find(
      (u: User) => u.email === email && u.password === pass,
    );
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    window.location.href = "/";
  };
  const addOrder = (order: Order) =>
    setUser((prev) =>
      prev ? { ...prev, orders: [order, ...prev.orders] } : null,
    );
  const saveCard = (card: Omit<Card, "id">) =>
    setUser((prev) =>
      prev
        ? {
            ...prev,
            savedCards: [
              { ...card, id: `CRD-${Date.now()}` },
              ...prev.savedCards,
            ],
          }
        : null,
    );
  const saveAddress = (addr: Omit<Address, "id">) =>
    setUser((prev) =>
      prev
        ? {
            ...prev,
            addresses: [
              { ...addr, id: `ADR-${Date.now()}` },
              ...prev.addresses,
            ],
          }
        : null,
    );
  const deleteAddress = (id: string) =>
    setUser((prev) =>
      prev
        ? { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) }
        : null,
    );
  const deleteCard = (id: string) =>
    setUser((prev) =>
      prev
        ? { ...prev, savedCards: prev.savedCards.filter((c) => c.id !== id) }
        : null,
    );
  const updateAddress = (id: string, addr: Omit<Address, "id">) =>
    setUser((prev) =>
      prev
        ? {
            ...prev,
            addresses: prev.addresses.map((a) =>
              a.id === id ? { ...addr, id } : a,
            ),
          }
        : null,
    );
  const updateCard = (id: string, crd: Omit<Card, "id">) =>
    setUser((prev) =>
      prev
        ? {
            ...prev,
            savedCards: prev.savedCards.map((c) =>
              c.id === id ? { ...crd, id } : c,
            ),
          }
        : null,
    );
  const updateProfile = (
    data: Partial<Pick<User, "name" | "email" | "birthDate">>,
  ) => setUser((prev) => (prev ? { ...prev, ...data } : null));
  const toggleFavorite = (productId: string) =>
    setUser((prev) => {
      if (!prev) return null;
      const favs = prev.favorites.includes(productId)
        ? prev.favorites.filter((id) => id !== productId)
        : [...prev.favorites, productId];
      return { ...prev, favorites: favs };
    });

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
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
