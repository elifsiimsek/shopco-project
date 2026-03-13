import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const brandData = [
  {
    name: "Versace",
    sub: "Milan / Italy",
    desc: "Luxury house defined by impeccable tailoring and a heritage of bold Italian artistry.",
    image:
      "https://images.unsplash.com/photo-1550639524-a6f58345a2ca?q=80&w=600",
  },
  {
    name: "Zara",
    sub: "Arteixo / Spain",
    desc: "A global benchmark for capturing the spirit of contemporary fashion trends with speed.",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600",
  },
  {
    name: "Gucci",
    sub: "Florence / Italy",
    desc: "Redefining the code of modern luxury through an eclectic and highly creative lens.",
    image:
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=600",
  },
  {
    name: "Prada",
    sub: "Milan / Italy",
    desc: "Intellectual elegance that challenges the status quo of high-fashion aesthetics.",
    image:
      "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=600",
  },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-satoshi text-black pb-20">
      <section className="px-4 md:px-16 pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 block mb-4">
            Curated Portfolio
          </span>
          <h1 className="text-[48px] md:text-[72px] font-[1000] uppercase tracking-tight leading-none">
            Selected <br></br>
            <span className="italic font-serif font-light text-black/20">
              Partners
            </span>
          </h1>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
          {brandData.map((brand, index) => (
            <div
              key={brand.name}
              className={`group cursor-pointer ${index % 2 !== 0 ? "md:mt-24" : ""}`}
            >
              <div className="relative aspect-[4/3] w-full max-w-[450px] mx-auto overflow-hidden rounded-lg bg-[#F5F5F5] mb-6">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover transition-all duration-[2s] grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>

              <div className="max-w-[450px] mx-auto space-y-3">
                <div className="flex items-end justify-between border-b border-black/5 pb-2">
                  <h2 className="text-2xl font-[1000] uppercase tracking-tighter italic">
                    {brand.name}
                  </h2>
                  <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">
                    {brand.sub}
                  </span>
                </div>
                <p className="text-black/50 text-xs leading-relaxed font-medium italic">
                  {brand.desc}
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest pt-2 hover:text-black transition-colors text-black/40"
                >
                  Explore <FiArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-40 text-center">
        <button className="px-10 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/80 transition-all shadow-lg active:scale-95">
          Inquire Partnership
        </button>
      </section>
    </div>
  );
}
