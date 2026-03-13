import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSliders,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { products as allProducts } from "../data/products";
import type { Product } from "../types/product";

const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];
const dressStyles = ["Casual", "Formal", "Party", "Gym"];
const sizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];
const availableColors = [
  { name: "Green", code: "#00C12B" },
  { name: "Red", code: "#F50606" },
  { name: "Yellow", code: "#F5DD06" },
  { name: "Orange", code: "#F57906" },
  { name: "Cyan", code: "#06CAF5" },
  { name: "Blue", code: "#063AF5" },
  { name: "Purple", code: "#7D06F5" },
  { name: "Pink", code: "#F506A4" },
  { name: "White", code: "#FFFFFF" },
  { name: "Black", code: "#000000" },
];

export default function ShopPage() {
  const [searchParams] = useSearchParams();

  const styleQuery = searchParams.get("style");
  const searchQuery = searchParams.get("search") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isColorsOpen, setIsColorsOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isStyleOpen, setIsStyleOpen] = useState(true);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 9;

  useEffect(() => {
    if (styleQuery) {
      setSelectedStyle(styleQuery);
    } else {
      setSelectedStyle(null);
    }
    setCurrentPage(1);
  }, [styleQuery]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedCategory,
    selectedStyle,
    priceRange,
    selectedColor,
    selectedSize,
  ]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p: Product) => {
      const matchesSearch = searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = selectedCategory
        ? p.category === selectedCategory
        : true;
      const matchesStyle = selectedStyle ? p.style === selectedStyle : true;
      const matchesPrice =
        p.price >= priceRange.min && p.price <= priceRange.max;
      const matchesColor = selectedColor
        ? p.colors?.includes(selectedColor)
        : true;
      const matchesSize = selectedSize ? p.sizes?.includes(selectedSize) : true;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesStyle &&
        matchesPrice &&
        matchesColor &&
        matchesSize
      );
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedStyle,
    priceRange,
    selectedColor,
    selectedSize,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedStyle(null);
    setPriceRange({ min: 0, max: 500 });
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 font-satoshi text-left text-black min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        <aside
          className={`fixed inset-0 z-[500] bg-white p-6 transition-transform duration-300 lg:static lg:w-[295px] lg:border lg:rounded-[20px] lg:block overflow-y-auto lg:overflow-visible ${
            isMobileFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex justify-between items-center border-b pb-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter">Filters</h2>
            <button
              className="lg:hidden bg-transparent border-none p-2"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <FiX size={24} />
            </button>
            <FiSliders className="hidden lg:block text-black/40" />
          </div>

          <div className="space-y-4 pb-6 border-b border-black/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`w-full flex justify-between items-center bg-transparent border-none text-[16px] py-1 cursor-pointer transition-all ${
                  selectedCategory === cat ? "font-bold text-black" : "text-black/60 hover:text-black"
                }`}
              >
                {cat} <FiChevronRight size={14} className="opacity-40" />
              </button>
            ))}
          </div>

          <div className="py-6 border-b border-black/5">
            <button
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="w-full flex items-center justify-between mb-6 bg-transparent border-none cursor-pointer"
            >
              <span className="text-xl font-black uppercase tracking-tighter">Price</span>
              {isPriceOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isPriceOpen && (
              <div className="px-2 space-y-6">
                <div className="relative w-full h-1.5 bg-[#F0F0F0] rounded-full">
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
                      setPriceRange({
                        ...priceRange,
                        min: Math.min(Number(e.target.value), priceRange.max - 10),
                      })
                    }
                    className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-30 accent-black"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        max: Math.max(Number(e.target.value), priceRange.min + 10),
                      })
                    }
                    className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-40 accent-black"
                  />
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
              </div>
            )}
          </div>

          <div className="py-6 border-b border-black/5">
            <button
              onClick={() => setIsColorsOpen(!isColorsOpen)}
              className="w-full flex items-center justify-between mb-4 bg-transparent border-none cursor-pointer"
            >
              <span className="text-xl font-black uppercase tracking-tighter">Colors</span>
              {isColorsOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isColorsOpen && (
              <div className="grid grid-cols-5 gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.code}
                    onClick={() =>
                      setSelectedColor(selectedColor === color.code ? null : color.code)
                    }
                    className={`w-9 h-9 rounded-full border border-black/10 flex items-center justify-center transition-all ${
                      selectedColor === color.code
                        ? "ring-2 ring-black ring-offset-2 scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.code }}
                  >
                    {selectedColor === color.code && (
                      <FiCheck
                        size={16}
                        color={color.code === "#FFFFFF" ? "black" : "white"}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-6 border-b border-black/5">
            <button
              onClick={() => setIsSizeOpen(!isSizeOpen)}
              className="w-full flex items-center justify-between mb-4 bg-transparent border-none cursor-pointer"
            >
              <span className="text-xl font-black uppercase tracking-tighter">Size</span>
              {isSizeOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isSizeOpen && (
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                    className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all border-none cursor-pointer ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-6 border-b border-black/5">
            <button
              onClick={() => setIsStyleOpen(!isStyleOpen)}
              className="w-full flex items-center justify-between mb-4 bg-transparent border-none cursor-pointer"
            >
              <span className="text-xl font-black uppercase tracking-tighter">Dress Style</span>
              {isStyleOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isStyleOpen && (
              <div className="space-y-4">
                {dressStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
                    className={`w-full flex justify-between items-center bg-transparent border-none text-[16px] py-1 cursor-pointer transition-all ${
                      selectedStyle === style ? "font-bold text-black" : "text-black/60 hover:text-black"
                    }`}
                  >
                    {style} <FiChevronRight size={14} className="opacity-40" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={() => {
              clearAllFilters();
              setIsMobileFilterOpen(false);
            }}
            className="w-full mt-6 rounded-full py-4 bg-black text-white font-black uppercase tracking-widest text-[12px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Apply Filters
          </Button>
        </aside>

        <main className="flex-1 w-full">
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col gap-1">
              <h1 className="text-[32px] md:text-[40px] font-[1000] uppercase tracking-tighter leading-none">
                {selectedStyle || selectedCategory || "Shop"}
              </h1>
              <p className="text-[12px] font-black uppercase tracking-widest text-black/20">
                Showing {filteredProducts.length} Results
              </p>
            </div>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden p-3 bg-[#F0F0F0] rounded-full border-none cursor-pointer hover:bg-black/5 transition-colors"
            >
              <FiSliders size={20} />
            </button>
          </div>

          {isLoading ? (
            <div className="py-40 flex justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                  {currentProducts.map((p: Product) => (
                    <div key={p.id} className="relative group">
                      {p.oldPrice && p.oldPrice > p.price && (
                        <div className="absolute top-3 left-3 z-30 pointer-events-none">
                          <span className="bg-red-600 text-white text-[10px] font-[1000] uppercase px-2.5 py-1 rounded-full shadow-lg animate-bounce inline-block">
                            {p.discount || `-${Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%`}
                          </span>
                        </div>
                      )}
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-40 text-center">
                  <h3 className="text-xl font-black uppercase opacity-20">No products found.</h3>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 text-xs font-black uppercase underline underline-offset-8 cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-20 pt-6 border-t border-black/5 flex justify-between items-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((prev) => prev - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 border border-black/10 px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold bg-white cursor-pointer disabled:opacity-30 hover:bg-black/5 transition-colors"
                  >
                    <HiArrowLeft /> Previous
                  </button>
                  <div className="flex gap-1 md:gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-xl font-bold border-none cursor-pointer transition-all ${
                          currentPage === i + 1
                            ? "bg-black/5 text-black"
                            : "bg-transparent text-black/40 hover:text-black"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((prev) => prev + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 border border-black/10 px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold bg-white cursor-pointer disabled:opacity-30 hover:bg-black/5 transition-colors"
                  >
                    Next <HiArrowRight />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}