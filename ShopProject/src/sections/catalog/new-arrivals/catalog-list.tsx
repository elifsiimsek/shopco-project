import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import ProductCard from "../../../components/product/ProductCard";
import type { Product } from "../../../types/product";

interface ListProps {
  products: Product[];
}

export default function NewArricalsCatalogList({ products }: ListProps) {
  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-16 pb-40 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-32">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`flex flex-col transition-all duration-1000 ease-out animate-fade-in-up ${
              index % 2 !== 0 ? "lg:mt-40" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[12px] font-black font-serif italic text-black/10 tracking-widest">
                Series 0{index + 1}
              </span>
              <div className="h-[1px] w-8 bg-black/5"></div>
            </div>

            <ProductCard product={product} />

            <div className="mt-8 pt-6 border-t border-black/[0.03] text-left">
              <Link
                to={`/product/${product.id}`}
                className="flex items-center justify-between group/btn no-underline"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 group-hover/btn:text-black transition-colors">
                  Explore Details
                </span>
                <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white transition-all">
                  <FiArrowUpRight size={14} />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
