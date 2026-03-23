import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  oldPrice?: number;
  img: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface AddProductData extends Omit<CartItem, "quantity"> {
  quantity?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: AddProductData, quantity: number) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  increase: (id: string, size?: string, color?: string) => void;
  decrease: (id: string, size?: string, color?: string) => void;
  clearCart: () => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("shopco_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        localStorage.removeItem("shopco_cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shopco_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addToCart = (product: AddProductData, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          String(item.id) === String(product.id) &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor,
      );
      if (existing) {
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity } as CartItem];
    });
    setNotification(`${product.name} added to bag! 🛍️`);
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            String(item.id) === id &&
            item.selectedSize === size &&
            item.selectedColor === color
          ),
      ),
    );
  };

  const increase = (id: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === id &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decrease = (id: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === id &&
        item.selectedSize === size &&
        item.selectedColor === color &&
        item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increase,
        decrease,
        clearCart,
        notification,
        setNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
