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
    <div className="min-h-screen bg-[#FDFDFD] font-satoshi text-left overflow-x-hidden relative selection:bg-black selection:text-white">
      <div className="absolute top-10 -right-20 opacity-[0.02] pointer-events-none select-none hidden lg:block">
        <h2 className="text-[20vw] font-[1000] uppercase leading-none tracking-tighter">Edition</h2>
      </div>

      <header className="max-w-[1440px] mx-auto px-4 md:px-16 pt-32 mb-32 relative z-10 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-black/20">
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Selected Drops</span>
              <FiMinus />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Vol. 01</span>
            </div>
            <h1 className="text-[48px] md:text-[80px] font-[1000] uppercase tracking-[-0.06em] leading-[0.8] italic text-black">
              New <br />
              <span className="text-black/5 not-italic font-serif font-light">Arrivals</span>
            </h1>
          </div>

          <div className="md:text-right space-y-6">
            <p className="text-black/40 text-[14px] font-medium max-w-[260px] md:ml-auto leading-relaxed italic">
              "Contemporary silhouettes. Premium textures. Designed for the minimalist elite."
            </p>
            <div className="flex items-center md:justify-end gap-4">
              <span className="h-[1px] w-12 bg-black/10"></span>
              <span className="text-[11px] font-black uppercase tracking-widest text-black">
                {newProducts.length} Pieces Collected
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-16 pb-40 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-32">
          {newProducts.map((product, index) => (
            <div 
              key={product.id} 
              className={`group flex flex-col transition-all duration-700 animate-fade-in-up ${
                index % 2 !== 0 ? "lg:mt-32" : ""
              }`}
            >
              <div className="mb-4 text-[10px] font-black text-black/10 group-hover:text-black transition-colors duration-500">
                / 0{index + 1}
              </div>

              <div className="relative overflow-hidden rounded-[32px] bg-white shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <ProductCard product={product} />
              </div>

              <Link 
                to={`/product/${product.id}`} 
                className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/20 group-hover:text-black transition-all duration-300 no-underline"
              >
                View Details <FiArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <div className="py-16 bg-black overflow-hidden flex border-y border-white/5">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 mx-8">
              <span className="text-white text-[14px] font-black uppercase tracking-[0.6em]">
                New Collection 2026
              </span>
              <span className="w-2 h-2 bg-white/20 rounded-full"></span>
            </div>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 mx-8">
              <span className="text-white text-[14px] font-black uppercase tracking-[0.6em]">
                New Collection 2026
              </span>
              <span className="w-2 h-2 bg-white/20 rounded-full"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}