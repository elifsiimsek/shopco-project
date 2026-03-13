import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import type { Product } from "../types/product";

export const useProducts = (productId?: string | number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (productId) {
          const data = await productService.getProductById(productId);
          if (data) setProduct(data);
          else setError("Ürün bulunamadı.");
        }
      } catch (err) {
        setError("Veri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};
