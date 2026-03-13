import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Product } from "../types/product";
import { useCart } from "./CartContext"; 

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { setNotification } = useCart(); 
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("shop-co-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("shop-co-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    const isExist = wishlist.some((item) => String(item.id) === String(product.id));
    
    if (isExist) {
      setWishlist(prev => prev.filter((item) => String(item.id) !== String(product.id)));
      setNotification(`${product.name} removed from archive. 🖤`);
    } else {
      setWishlist(prev => [...prev, product]);
      setNotification(`${product.name} added to archive! 💖`);
    }
  };

  const isInWishlist = (id: string | number) => {
    return wishlist.some((item) => String(item.id) === String(id));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};