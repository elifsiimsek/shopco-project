import {
  FiX,
  FiSliders,
  FiChevronUp,
  FiChevronDown,
  FiChevronRight,
  FiCheck,
} from "react-icons/fi";
import {
  categories,
  availableColors,
  sizes,
  dressStyles,
} from "../../data/products";
import type { PriceRange } from "../../types/product";

interface OpenStates {
  price: boolean;
  colors: boolean;
  size: boolean;
  style: boolean;
}

interface ShopFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  priceRange: PriceRange;
  onPriceChange: (range: PriceRange) => void;
  selectedColor: string | null;
  onColorChange: (color: string | null) => void;
  selectedSize: string | null;
  onSizeChange: (size: string | null) => void;
  selectedStyle: string | null;
  onStyleChange: (style: string) => void;
  onClear: () => void;
  openStates: OpenStates;
  setOpenStates: (states: OpenStates) => void; 
}

export default function ShopFilters({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedColor,
  onColorChange,
  selectedSize,
  onSizeChange,
  selectedStyle,
  onStyleChange,
  onClear,
  openStates,
  setOpenStates,
}: ShopFiltersProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-[999] transition-opacity lg:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed lg:sticky top-0 lg:top-24 left-0 h-full lg:h-[calc(100vh-140px)] w-[85%] sm:w-[350px] lg:w-[310px] bg-white z-[1000] lg:z-10 transition-transform duration-500 lg:translate-x-0 lg:border lg:rounded-[20px] flex flex-col overflow-hidden shadow-2xl lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center border-b p-6 bg-white shrink-0">
          <h2 className="text-xl font-[1000] uppercase tracking-tighter">
            Filters
          </h2>
          <button
            className="p-2 lg:hidden bg-[#F5F5F5] rounded-full border-none cursor-pointer"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
          <FiSliders className="hidden lg:block text-black/40" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide py-2 text-left">
          <div className="space-y-4 py-6 border-b border-[#F0F0F0]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  onCategoryChange(selectedCategory === cat ? null : cat)
                }
                className={`w-full flex justify-between items-center text-[16px] bg-transparent border-none py-1 transition-all cursor-pointer ${selectedCategory === cat ? "font-bold text-black" : "text-black/60 hover:text-black"}`}
              >
                {cat} <FiChevronRight size={14} className="opacity-40" />
              </button>
            ))}
          </div>

          <div className="py-6 border-b border-[#F0F0F0]">
            <button
              onClick={() =>
                setOpenStates({ ...openStates, price: !openStates.price })
              }
              className="w-full flex items-center justify-between mb-8 bg-transparent border-none cursor-pointer text-black font-[1000] uppercase tracking-tighter"
            >
              Price {openStates.price ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openStates.price && (
              <div className="px-2 pb-6">
                <div className="relative w-full h-1.5 bg-[#F5F5F5] rounded-full mb-8">
                  <div
                    className="absolute h-full bg-black rounded-full"
                    style={{
                      left: `${(priceRange.min / 500) * 100}%`,
                      right: `${100 - (priceRange.max / 500) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.min}
                    onChange={(e) =>
                      onPriceChange({
                        ...priceRange,
                        min: Math.min(
                          Number(e.target.value),
                          priceRange.max - 20,
                        ),
                      })
                    }
                    className="absolute w-full h-1.5 top-0 left-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.max}
                    onChange={(e) =>
                      onPriceChange({
                        ...priceRange,
                        max: Math.max(
                          Number(e.target.value),
                          priceRange.min + 20,
                        ),
                      })
                    }
                    className="absolute w-full h-1.5 top-0 left-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                  />
                </div>
                <div className="flex justify-between font-black text-sm text-black">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
              </div>
            )}
          </div>

          <div className="py-6 border-b border-[#F0F0F0]">
            <button
              onClick={() =>
                setOpenStates({ ...openStates, colors: !openStates.colors })
              }
              className="w-full flex items-center justify-between mb-4 bg-transparent border-none cursor-pointer text-black font-[1000] uppercase tracking-tighter"
            >
              Colors {openStates.colors ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openStates.colors && (
              <div className="grid grid-cols-5 gap-4">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => onColorChange(color.code)}
                    className={`w-9 h-9 rounded-full border border-black/10 flex items-center justify-center transition-all cursor-pointer ${color.code} ${selectedColor === color.code ? "ring-2 ring-black ring-offset-4 scale-110" : "hover:scale-105"}`}
                  >
                    {selectedColor === color.code && (
                      <FiCheck
                        size={16}
                        color={color.name === "White" ? "black" : "white"}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-6 border-b border-[#F0F0F0]">
            <button
              onClick={() =>
                setOpenStates({ ...openStates, size: !openStates.size })
              }
              className="w-full flex items-center justify-between mb-4 bg-transparent border-none cursor-pointer text-black font-[1000] uppercase tracking-tighter"
            >
              Size {openStates.size ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openStates.size && (
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onSizeChange(size)}
                    className={`px-5 py-3 rounded-full text-xs font-black transition-all border-none cursor-pointer ${selectedSize === size ? "bg-black text-white shadow-xl" : "bg-[#F5F5F5] text-black/60 hover:bg-black/10"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-6">
            <button
              onClick={() =>
                setOpenStates({ ...openStates, style: !openStates.style })
              }
              className="w-full flex items-center justify-between mb-4 bg-transparent border-none cursor-pointer text-black font-[1000] uppercase tracking-tighter"
            >
              Dress Style{" "}
              {openStates.style ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openStates.style && (
              <div className="space-y-4">
                {dressStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => onStyleChange(style)}
                    className={`w-full flex justify-between items-center bg-transparent border-none text-[16px] py-1 transition-all cursor-pointer ${selectedStyle === style ? "font-bold text-black" : "text-black/60 hover:text-black"}`}
                  >
                    {style} <FiChevronRight size={14} className="opacity-40" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white border-t shrink-0 flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full rounded-full py-4 bg-black text-white font-black uppercase tracking-widest text-[10px] border-none cursor-pointer"
          >
            Apply Filters
          </button>
          <button
            onClick={onClear}
            className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors py-2 cursor-pointer text-center"
          >
            Clear All
          </button>
        </div>
      </aside>
    </>
  );
}