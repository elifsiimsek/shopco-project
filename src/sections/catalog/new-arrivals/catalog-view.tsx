import { useEffect, useState } from "react";
import NewArricalsCatalogHeader from "./catalog-header";
import NewArricalsCatalogList from "./catalog-list";
import { productService } from "../../../data/products";
import type { Product } from "../../../types/product";

export default function NewArrivalsCatalogView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const all = await productService.getAllProducts();

        const realNewItems = all.filter(
          (p: Product) => p.isNew && !p.discount && !p.oldPrice,
        );

        let finalSelection: Product[] = [];

        if (realNewItems.length < 8) {
          const others = all.filter(
            (p: Product) => !realNewItems.find((ni) => ni.id === p.id),
          );

          const shuffledOthers = [...others].sort(() => 0.5 - Math.random());

          finalSelection = [...realNewItems, ...shuffledOthers].slice(0, 8);
        } else {
          finalSelection = realNewItems;
        }

        setProducts(finalSelection);
      } catch (error) {
        console.error("Products could not be synchronized:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-white font-satoshi overflow-x-hidden selection:bg-black selection:text-white">
      <NewArricalsCatalogHeader count={products.length} />

      {loading ? (
        <div className="py-40 text-center animate-pulse uppercase font-black tracking-[0.5em] text-black/10">
          Synchronizing...
        </div>
      ) : (
        <NewArricalsCatalogList products={products} />
      )}

      <footer className="py-10 bg-black overflow-hidden flex border-t border-white/5">
        <div className="flex whitespace-nowrap animate-marquee-infinite">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-12 mx-12">
              <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.8em]">
                New Arrivals
              </span>
              <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
