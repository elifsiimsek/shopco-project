import type { Product } from "../../../types/product";

interface Props {
  products: Product[];
  searchQuery: string;
  handleResultClick: (id: string | number) => void;
  navigate: (path: string) => void;
  setSearchResults: (products: Product[]) => void;
  isMobile?: boolean;
}

export default function NavbarSearchResults({
  products,
  searchQuery,
  handleResultClick,
  navigate,
  setSearchResults,
  isMobile,
}: Props) {
  return (
    <div
      className={`absolute left-0 w-full bg-white border border-black/5 shadow-2xl rounded-[24px] overflow-hidden p-2 z-[1005] ${isMobile ? "static border-none shadow-none mt-4 p-0" : "top-[110%]"}`}
    >
      <div
        className="max-h-[350px] overflow-y-auto scrollbar-hide text-left"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleResultClick(product.id)}
            className="flex items-center gap-4 px-4 py-3 hover:bg-[#F9F9F9] rounded-xl cursor-pointer transition-all border-b border-black/[0.02] last:border-none"
          >
            <img
              src={product.img}
              alt=""
              className="w-10 h-10 object-cover rounded-lg bg-black/[0.02]"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-black uppercase">
                {product.name}
              </span>
              <span className="text-xs font-medium text-black/40 italic">
                ${product.price}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 pt-3">
        <button
          onClick={() => {
            navigate(`/shop?search=${searchQuery}`);
            setSearchResults([]);
          }}
          className="w-full py-3.5 text-[10px] font-black uppercase italic tracking-[0.1em] bg-black text-white rounded-xl hover:bg-black/90 transition-all cursor-pointer border-none shadow-sm"
        >
          View All Results
        </button>
      </div>
    </div>
  );
}
