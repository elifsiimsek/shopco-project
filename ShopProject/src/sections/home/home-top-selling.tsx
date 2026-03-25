import { Link } from "react-router-dom";
import { products as allProducts } from "../../data/products";
import ProductCard from "../../components/product/ProductCard"; 
import Button from "../../components/ui/Button";
import Title from "../../components/title";

export default function HomeTopSelling() {
  const topSellingIds = ["5", "6", "7", "8"];
  const products = allProducts.filter((p) =>
    topSellingIds.includes(String(p.id)),
  );

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-10 md:py-16 border-t border-black/10">
      <Title title="Top Selling" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      <div className="flex justify-center mt-8 md:mt-14 px-4">
        <Link to="/shop" className="w-full md:w-[218px] no-underline">
          <Button
            variant="outline"
            className="w-full py-4 text-black font-black border-black/10 rounded-full hover:bg-black hover:text-white transition-all uppercase text-[14px] tracking-widest"
          >
            View All
          </Button>
        </Link>
      </div>
    </section>
  );
}