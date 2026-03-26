import { FiMinus } from "react-icons/fi";

interface HeaderProps {
  count: number;
}

export default function NewArricalsCatalogHeader({ count }: HeaderProps) {
  return (
    <>
      <div className="fixed top-20 -right-10 opacity-[0.015] pointer-events-none select-none hidden lg:block z-0">
        <h2 className="text-[25vw] font-[1000] uppercase leading-none tracking-tighter text-black">
          New
        </h2>
      </div>

      <header className="max-w-[1440px] mx-auto px-6 md:px-16 pt-32 mb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-black/[0.03] pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-black/20 text-left">
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">
                Selected Drops
              </span>
              <FiMinus />
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">
                2026 Collection
              </span>
            </div>
            <h1 className="text-[60px] md:text-[110px] font-[1000] uppercase tracking-[-0.07em] leading-[0.75] text-black m-0 text-left">
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
                {count} Pieces
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
