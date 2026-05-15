import { useState, useEffect } from "react";
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
import type { PriceRange } from "../../data/products";

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
  onStyleChange: (style: string | null) => void;
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
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [localPrice, setLocalPrice] = useState(priceRange);
  const [localColor, setLocalColor] = useState(selectedColor);
  const [localSize, setLocalSize] = useState(selectedSize);

  useEffect(() => {
    setLocalPrice(priceRange);
    setLocalColor(selectedColor);
    setLocalSize(selectedSize);
  }, [priceRange, selectedColor, selectedSize, isOpen]);

  const handleApply = () => {
    onPriceChange(localPrice);
    onColorChange(localColor);
    onSizeChange(localSize);
    onClose();
  };

  const handleClearAll = () => {
    setLocalPrice({ min: 0, max: 500 });
    setLocalColor(null);
    setLocalSize(null);
    onClear();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-[999] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed lg:sticky top-0 lg:top-24 left-0 h-full lg:h-[calc(100vh-120px)] w-[85%] sm:w-[350px] lg:w-[310px] bg-white z-[1000] lg:z-10 transition-transform duration-500 lg:translate-x-0 border-r lg:border lg:rounded-[20px] flex flex-col overflow-hidden shadow-2xl lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b p-6 bg-white shrink-0">
          <h2 className="text-xl font-bold tracking-tighter">Filters</h2>
          <button
            className="p-2 lg:hidden bg-[#F5F5F5] rounded-full border-none cursor-pointer flex items-center justify-center hover:bg-black/5 transition-colors"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
          <FiSliders className="hidden lg:block text-black/40" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-hide text-left">
          <div className="py-6 border-b border-black/5">
            <div className="space-y-3">
              {(showAllCategories ? categories : categories.slice(0, 5)).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      onCategoryChange(selectedCategory === cat ? null : cat)
                    }
                    className={`w-full flex justify-between items-center text-[16px] bg-transparent border-none py-1.5 transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "font-bold text-black"
                        : "text-black/60 hover:text-black"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {selectedCategory === cat && (
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      )}
                      {cat}
                    </span>
                    <FiChevronRight
                      size={14}
                      className={
                        selectedCategory === cat ? "opacity-100" : "opacity-40"
                      }
                    />
                  </button>
                ),
              )}
            </div>
            {categories.length > 5 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/40 hover:text-black mt-4 bg-transparent border-none cursor-pointer"
              >
                {showAllCategories ? (
                  <>
                    <FiChevronUp /> Show Less
                  </>
                ) : (
                  <>
                    <FiChevronDown /> Show More
                  </>
                )}
              </button>
            )}
          </div>

          <div className="py-6 border-b border-black/5">
            <button
              onClick={() =>
                setOpenStates({ ...openStates, price: !openStates.price })
              }
              className="w-full flex items-center justify-between mb-8 bg-transparent border-none cursor-pointer text-black font-bold text-lg"
            >
              Price {openStates.price ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openStates.price && (
              <div className="px-2 pb-4">
                <div className="relative w-full h-1.5 bg-[#F5F5F5] rounded-full mb-6">
                  <div
                    className="absolute h-full bg-black rounded-full"
                    style={{
                      left: `${(localPrice.min / 500) * 100}%`,
                      right: `${100 - (localPrice.max / 500) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={localPrice.min}
                    onChange={(e) =>
                      setLocalPrice({
                        ...localPrice,
                        min: Math.min(
                          Number(e.target.value),
                          localPrice.max - 0,
                        ),
                      })
                    }
                    className="absolute w-full h-1.5 top-0 left-0 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={localPrice.max}
                    onChange={(e) =>
                      setLocalPrice({
                        ...localPrice,
                        max: Math.max(
                          Number(e.target.value),
                          localPrice.min + 0,
                        ),
                      })
                    }
                    className="absolute w-full h-1.5 top-0 left-0 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                <div className="flex justify-between font-bold text-sm text-black">
                  <span>${localPrice.min}</span>
                  <span>${localPrice.max}</span>
                </div>
              </div>
            )}
          </div>

          <div className="py-6 border-b border-black/5">
            <button
              onClick={() =>
                setOpenStates({ ...openStates, colors: !openStates.colors })
              }
              className="w-full flex items-center justify-between mb-6 bg-transparent border-none cursor-pointer text-black font-bold text-lg"
            >
              Colors {openStates.colors ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openStates.colors && (
              <div className="grid grid-cols-5 gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() =>
                      setLocalColor(
                        localColor === color.code ? null : color.code,
                      )
                    }
                    className={`w-9 h-9 rounded-full border border-black/10 flex items-center justify-center transition-all cursor-pointer ${color.code} ${
                      localColor === color.code
                        ? "ring-2 ring-black ring-offset-2 scale-110 shadow-lg"
                        : "hover:scale-110"
                    }`}
                    title={color.name}
                  >
                    {localColor === color.code && (
                      <FiCheck
                        size={16}
                        className={
                          color.name === "White" ? "text-black" : "text-white"
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-6 border-b border-black/5">
            <button
              onClick={() =>
                setOpenStates({ ...openStates, size: !openStates.size })
              }
              className="w-full flex items-center justify-between mb-6 bg-transparent border-none cursor-pointer text-black font-bold text-lg"
            >
              Size {openStates.size ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openStates.size && (
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setLocalSize(localSize === size ? null : size)
                    }
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
                      localSize === size
                        ? "bg-black text-white shadow-md scale-105"
                        : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                    }`}
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
              className="w-full flex items-center justify-between mb-6 bg-transparent border-none cursor-pointer text-black font-bold text-lg"
            >
              Dress Style{" "}
              {openStates.style ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openStates.style && (
              <div className="space-y-3">
                {dressStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() =>
                      onStyleChange(selectedStyle === style ? null : style)
                    }
                    className={`w-full flex justify-between items-center bg-transparent border-none text-[16px] py-1.5 transition-all cursor-pointer ${
                      selectedStyle === style
                        ? "font-bold text-black"
                        : "text-black/60 hover:text-black"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {selectedStyle === style && (
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      )}
                      {style}
                    </span>
                    <FiChevronRight
                      size={14}
                      className={
                        selectedStyle === style ? "opacity-100" : "opacity-40"
                      }
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white border-t shrink-0 flex flex-col gap-3">
          <button
            onClick={handleApply}
            className="w-full rounded-full py-4 bg-black text-white font-bold text-[14px] text-base border-none cursor-pointer active:scale-[0.98] shadow-xl hover:bg-black/90"
          >
            Apply Filter
          </button>
          <button
            onClick={handleClearAll}
            className="bg-transparent border-none text-[12px] font-bold text-black/30 hover:text-red-500 transition-colors py-2 cursor-pointer text-center"
          >
            Clear All
          </button>
        </div>
      </aside>
    </>
  );
}
