import { useEffect, useState } from "react";
import OnSaleMarquee from "./on-sale-marquee";
import OnSaleHero from "./on-sale-hero";
import OnSaleGrid from "./on-sale-grid";
import { productService } from "../../../data/products";
import type { Product } from "../../../types/product";

export default function OnSaleCatalogView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleItems = async () => {
      const all = await productService.getAllProducts();
      const saleItems = all.filter((p: Product) => p.oldPrice || p.discount);
      setProducts(saleItems);
      setLoading(false);
    };
    fetchSaleItems();
  }, []);

  return (
    <div className="min-h-screen bg-white font-satoshi overflow-x-hidden">
      <OnSaleMarquee />
      <OnSaleHero />
      {loading ? (
        <div className="py-40 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-black/10">
          Calculating Reductions...
        </div>
      ) : (
        <OnSaleGrid products={products} />
      )}
    </div>
  );
}
