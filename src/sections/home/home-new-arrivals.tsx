import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts"; 
import ProductCard from "../../components/product/ProductCard";
import Button from "../../components/ui/Button";
import Title from "../../components/title/index"; 
import type { Product } from "../../types/product"; 

export default function HomeNewArrivals() {
  const { products: allProducts, loading, error } = useProducts();

  const products: Product[] = allProducts.slice(1, 5);

  if (loading) {
    return (
      <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16">
        <Title title="New Arrivals" />
        <div className="text-center py-10 font-medium">Loading Products...</div>
      </section>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16 border-b border-black/10">
      <Title title="New Arrivals" />
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {products.map((item: Product) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      <div className="flex justify-center mt-8 md:mt-12">
        <Link to="/shop" className="w-full md:w-auto no-underline">
          <Button
            variant="outline"
            className="w-full md:px-14 py-4 text-black font-[400] border-black/10 rounded-full hover:bg-black hover:text-white transition-all text-[16px]"
          >
            View All
          </Button>
        </Link>
      </div>
    </section>
  );
}