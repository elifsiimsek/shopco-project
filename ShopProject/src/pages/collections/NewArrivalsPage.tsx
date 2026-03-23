import { Link } from "react-router-dom";
import { FiArrowUpRight, FiMinus } from "react-icons/fi";
import { products } from "../../data/products";
import type { Product } from "../../types/product";
import ProductCard from "../../components/product/ProductCard";

export default function NewArrivalsPage() {
  const newProducts: Product[] = products.filter(
    (p) => p.isNew === true && !p.discount && !p.oldPrice,
  );

  return (
    <div className="min-h-screen bg-white font-satoshi text-left overflow-x-hidden selection:bg-black selection:text-white">
      <div className="fixed top-20 -right-10 opacity-[0.015] pointer-events-none select-none hidden lg:block z-0">
        <h2 className="text-[25vw] font-[1000] uppercase leading-none tracking-tighter text-black">
          New
        </h2>
      </div>

      <header className="max-w-[1440px] mx-auto px-6 md:px-16 pt-32 mb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-black/[0.03] pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-black/20">
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">
                Selected Drops
              </span>
              <FiMinus />
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">
                2026 Collection
              </span>
            </div>
            <h1 className="text-[60px] md:text-[110px] font-[1000] uppercase tracking-[-0.07em] leading-[0.75] text-black m-0">
              New <br />
              <span className="italic font-serif font-light text-black/10">
                Arrivals
              </span>
            </h1>
          </div>

          <div className="md:text-right">
            <p className="text-black/40 text-[16px] font-medium max-w-[300px] md:ml-auto leading-relaxed italic mb-8">
              "Curated essentials for the modern pioneer. Silhouettes that speak
              of quiet luxury."
            </p>
            <div className="inline-flex items-center gap-4 bg-black text-white px-6 py-2 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-widest">
                {newProducts.length} Pieces
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 md:px-16 pb-40 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-32">
          {newProducts.map((product, index) => (
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

              <div className="mt-8 pt-6 border-t border-black/[0.03]">
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

      <footer className="py-10 bg-black overflow-hidden flex border-t border-white/5">
        <div className="flex whitespace-nowrap animate-marquee-infinite">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {[...Array(10)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-12 mx-12">
                  <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.8em]">
                    New Arrivals
                  </span>
                  <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
