import { Link } from "react-router-dom";
import { products as allProducts } from "../../data/products";
import ProductCard from "../product/ProductCard";
import Button from "../../components/ui/Button";

export default function NewArrivals() {
  const products = allProducts.slice(0, 4);

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16 border-b border-black/10">
      <h2 className="text-[32px] md:text-[48px] font-[1000] text-center mb-8 md:mb-14 uppercase tracking-tighter">
        New Arrivals
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      <div className="flex justify-center mt-8 md:mt-12">
        <Link to="/shop" className="w-full md:w-auto">
          <Button
            variant="outline"
            className="w-full md:px-14 py-4 text-black font-black border-black/10 rounded-full hover:bg-black hover:text-white transition-all uppercase text-[14px]"
          >
            View All
          </Button>
        </Link>
      </div>
    </section>
  );
}
