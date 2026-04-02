import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const brandData = [
  {
    name: "Versace",
    sub: "Milan / Italy",
    desc: "Luxury house defined by impeccable tailoring and the bold spirit of the Medusa, bridging classical art with modern provocation.",
    image:
      "https://images.unsplash.com/photo-1550639524-a6f58345a2ca?q=80&w=600",
  },
  {
    name: "Zara",
    sub: "Arteixo / Spain",
    desc: "A global benchmark for capturing the spirit of the moment, delivering high-fashion aesthetics with unprecedented speed.",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600",
  },
  {
    name: "Gucci",
    sub: "Florence / Italy",
    desc: "Redefining the codes of modern luxury through an eclectic, contemporary lens, rooted in Italian craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=600",
  },
  {
    name: "Prada",
    sub: "Milan / Italy",
    desc: "Intellectual elegance that challenges the status quo, blending industrial innovation with sophisticated minimalism.",
    image:
      "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=600",
  },
  {
    name: "Calvin Klein",
    sub: "New York / USA",
    desc: "The ultimate architect of American minimalism, defined by provocative imagery and clean-lined archive essentials.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600",
  },
];

export default function BrandsGrid() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-16 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 mb-32">
        {brandData.map((brand, index) => (
          <div
            key={brand.name}
            className={`group cursor-pointer ${index % 2 !== 0 ? "md:mt-24" : ""}`}
          >
            <div className="relative aspect-[4/3] w-full max-w-[450px] mx-auto overflow-hidden rounded-lg bg-[#F9F9F9] mb-6 shadow-sm">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover transition-all duration-[2s] grayscale group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
            <div className="max-w-[450px] mx-auto space-y-3 text-left">
              <div className="flex items-end justify-between border-b border-black/5 pb-2">
                <h2 className="text-2xl font-[1000] uppercase tracking-tighter italic m-0">
                  {brand.name}
                </h2>
                <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">
                  {brand.sub}
                </span>
              </div>
              <p className="text-black/50 text-xs leading-relaxed font-medium italic m-0">
                {brand.desc}
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest pt-2 hover:text-black transition-colors text-black/40 no-underline"
              >
                Explore <FiArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center border-t border-black/[0.05] pt-16">
        <Link
          to="/brands"
          className="group relative px-12 py-5 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-[0.3em] italic no-underline transition-all hover:bg-white hover:text-black border border-black overflow-hidden shadow-2xl"
        >
          <span className="relative z-10">View All Archive Brands</span>
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
        </Link>
      </div>
    </section>
  );
}
