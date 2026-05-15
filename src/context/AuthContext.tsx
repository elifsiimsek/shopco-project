import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

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
  id: string | number;
  email: string;
  name: string;
  role: string;
  avatar: string;
  birthDate: string;
  addresses: Address[];
  savedCards: Card[];
  orders: Order[];
  favorites: string[];
  hasWelcomeCoupon: boolean;
  password?: string;
  status?: "active" | "restricted";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    pass: string,
    birthDate: string,
  ) => Promise<boolean>;
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const activeSession = localStorage.getItem("vault_active_session");
    if (activeSession) {
      try {
        setUser(JSON.parse(activeSession));
      } catch (e) {
        localStorage.removeItem("vault_active_session");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("vault_active_session", JSON.stringify(user));
      const allUsers: User[] = JSON.parse(
        localStorage.getItem("vault_all_users") || "[]",
      );
      const index = allUsers.findIndex((u) => u.email === user.email);
      if (index > -1) {
        allUsers[index] = { ...allUsers[index], ...user };
      } else {
        allUsers.push(user);
      }
      localStorage.setItem("vault_all_users", JSON.stringify(allUsers));
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (email === "admin@mail.com" && password === "admin123") {
        setUser({
          id: "ADMIN-001",
          name: "VAULT ADMIN",
          email: "admin@mail.com",
          role: "admin",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
          birthDate: "1990-01-01",
          addresses: [],
          savedCards: [],
          orders: [],
          favorites: [],
          hasWelcomeCoupon: false,
          status: "active",
        });
        return true;
      }

      const allUsers: User[] = JSON.parse(
        localStorage.getItem("vault_all_users") || "[]",
      );
      const localMatch = allUsers.find(
        (u) => u.email === email && u.password === password,
      );
      if (localMatch) {
        setUser(localMatch);
        return true;
      }

      const res = await axios.post(
        "https://api.escuelajs.co/api/v1/auth/login",
        {
          email,
          password,
        },
      );

      if (res.data.access_token) {
        const profileRes = await axios.get(
          "https://api.escuelajs.co/api/v1/auth/profile",
          {
            headers: { Authorization: `Bearer ${res.data.access_token}` },
          },
        );

        if (profileRes.data) {
          setUser({
            ...profileRes.data,
            role: "customer",
            birthDate: "",
            addresses: [],
            savedCards: [],
            orders: [],
            favorites: [],
            hasWelcomeCoupon: true,
            status: "active",
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    birthDate: string,
  ): Promise<boolean> => {
    const newUserBase = {
      name,
      email,
      password: pass,
      birthDate,
      role: "customer",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      addresses: [],
      savedCards: [],
      orders: [],
      favorites: [],
      hasWelcomeCoupon: true,
      status: "active" as const,
    };

    try {
      const res = await axios.post("https://api.escuelajs.co/api/v1/users/", {
        name,
        email,
        password: pass,
        avatar: newUserBase.avatar,
      });

      if (res.status === 201 || res.status === 200) {
        setUser({ ...res.data, ...newUserBase });
        return true;
      }
      throw new Error("API_FAIL");
    } catch (error) {
      const localUser: User = { id: Date.now(), ...newUserBase };
      const allUsers: User[] = JSON.parse(
        localStorage.getItem("vault_all_users") || "[]",
      );
      allUsers.push(localUser);
      localStorage.setItem("vault_all_users", JSON.stringify(allUsers));
      setUser(localUser);
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem("vault_active_session");
    setUser(null);
    window.location.href = "/login";
  };

  const addOrder = (order: Order) =>
    setUser((prev) =>
      prev ? { ...prev, orders: [order, ...(prev.orders || [])] } : null,
    );

  const saveCard = (card: Omit<Card, "id">) =>
    setUser((prev) =>
      prev
        ? {
            ...prev,
            savedCards: [
              { ...card, id: `CRD-${Date.now()}` },
              ...(prev.savedCards || []),
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
              ...(prev.addresses || []),
            ],
          }
        : null,
    );

  const deleteAddress = (id: string) =>
    setUser((prev) =>
      prev
        ? {
            ...prev,
            addresses: (prev.addresses || []).filter((a) => a.id !== id),
          }
        : null,
    );

  const deleteCard = (id: string) =>
    setUser((prev) =>
      prev
        ? {
            ...prev,
            savedCards: (prev.savedCards || []).filter((c) => c.id !== id),
          }
        : null,
    );

  const updateAddress = (id: string, addr: Omit<Address, "id">) =>
    setUser((prev) =>
      prev
        ? {
            ...prev,
            addresses: (prev.addresses || []).map((a) =>
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
            savedCards: (prev.savedCards || []).map((c) =>
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
      const currentFavs = prev.favorites || [];
      const favs = currentFavs.includes(productId)
        ? currentFavs.filter((id) => id !== productId)
        : [...currentFavs, productId];
      return { ...prev, favorites: favs };
    });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
