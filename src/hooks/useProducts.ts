import { useState, useEffect } from "react";
import { productService } from "../data/products";
import type { Product } from "../data/products";

export const useProducts = (productId?: string | number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) setProduct(null);
    else setProducts([]);

    const fetchData = async () => {
      setLoading(true);
      setError(null); 

      try {
        if (productId) {
          const data = await productService.getProductById(productId);
          if (data) {
            setProduct(data);
          } else {
            setError("The piece could not be located in the vault.");
          }
        } else {
          const all = await productService.getAllProducts();
          setProducts(all);
        }
      } catch (err) {
        console.error("Hook Error:", err);
        setError("Vault synchronization failure. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return { product, products, loading, error };
};
