import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts"; 
import ProductCard from "../../components/product/ProductCard"; 
import Button from "../../components/ui/Button";
import Title from "../../components/title";
import type { Product } from "../../types/product"; 

export default function HomeTopSelling() {
  const { products: allProducts, loading, error } = useProducts();

  const discountProducts: Product[] = allProducts 
    ? allProducts.filter((p: Product) => p.discount && p.discount > 0).slice(0, 4)
    : [];

  const displayProducts: Product[] = discountProducts.length > 0 
    ? discountProducts 
    : (allProducts ? allProducts.slice(0, 4) : []);

  if (loading) {
    return (
      <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16">
        <div className="text-center animate-pulse">Loading Top Sellers...</div>
      </section>
    );
  }

  if (error) return null; 

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-10 md:py-16 border-t border-black/10">
      <Title title="Top Selling" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {displayProducts.map((item: Product) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      <div className="flex justify-center mt-8 md:mt-14 px-4">
        <Link to="/shop" className="w-full md:w-[218px] no-underline">
          <Button
            variant="outline"
            className="w-full py-4 text-black font-[400] border-black/10 rounded-full hover:bg-black hover:text-white transition-all text-[16px]"
          >
            View All
          </Button>
        </Link>
      </div>
    </section>
  );
}