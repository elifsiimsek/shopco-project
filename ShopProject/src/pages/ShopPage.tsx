import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FiSliders,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
  FiX,
  FiCheck,
  FiHeart,
} from "react-icons/fi";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { products as allProducts } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import type { Product } from "../types/product";

const availableColors = [
  { name: "Green", code: "bg-vault-green" },
  { name: "Red", code: "bg-vault-red" },
  { name: "Yellow", code: "bg-vault-yellow" },
  { name: "Orange", code: "bg-vault-orange" },
  { name: "Cyan", code: "bg-vault-cyan" },
  { name: "Blue", code: "bg-vault-blue" },
  { name: "Purple", code: "bg-vault-purple" },
  { name: "Pink", code: "bg-vault-pink" },
  { name: "White", code: "bg-white" },
  { name: "Black", code: "bg-black" },
];
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

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const styleQuery = searchParams.get("style");
  const searchQuery = searchParams.get("search") || "";

  const { toggleWishlist, isInWishlist } = useWishlist();

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
  const [selectedStyle, setSelectedStyle] = useState<string | null>(
    styleQuery || null,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 9;

  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "unset";
  }, [isMobileFilterOpen]);

  useEffect(() => {
    if (styleQuery) {
      setSelectedStyle(styleQuery);
    }
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
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStyleClick = (style: string) => {
    const newVal = selectedStyle === style ? null : style;
    setSelectedStyle(newVal);
    if (newVal) {
      setSearchParams({ style: newVal });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 font-satoshi text-left text-shopBlack min-h-screen bg-white">
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-shopBlack/30 mb-8">
        <Link
          to="/"
          className="hover:text-shopBlack transition-colors no-underline"
        >
          Home
        </Link>
        <FiChevronRight size={12} />
        <span className="text-shopBlack italic">Shop</span>
        {(selectedStyle || selectedCategory) && (
          <>
            <FiChevronRight size={12} />
            <span className="text-shopBlack uppercase italic">
              {selectedStyle || selectedCategory}
            </span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        <div
          className={`fixed inset-0 bg-shopBlack/40 z-[999] transition-opacity duration-300 lg:hidden ${isMobileFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={() => setIsMobileFilterOpen(false)}
        />

        <aside
          className={`fixed lg:sticky top-0 lg:top-24 left-0 h-full lg:h-[calc(100vh-140px)] w-[85%] sm:w-[350px] lg:w-[310px] bg-white z-[1000] lg:z-10 transition-transform duration-500 ease-in-out lg:translate-x-0 lg:border lg:rounded-[20px] flex flex-col overflow-hidden shadow-2xl lg:shadow-none ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between items-center border-b p-6 bg-white shrink-0">
            <h2 className="text-xl font-[1000] uppercase italic tracking-tighter">
              Filters
            </h2>
            <button
              className="p-2 lg:hidden bg-shopGray-light rounded-full border-none cursor-pointer"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <FiX size={20} />
            </button>
            <FiSliders className="hidden lg:block text-shopBlack/40" />
          </div>

          <div className="flex-1 overflow-y-auto px-6 scrollbar-hide py-2">
            <div className="space-y-4 py-6 border-b border-shopGray-border">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat ? null : cat);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex justify-between items-center text-[16px] bg-transparent border-none py-1 transition-all cursor-pointer ${selectedCategory === cat ? "font-bold text-shopBlack" : "text-shopBlack/60 hover:text-shopBlack"}`}
                >
                  {cat} <FiChevronRight size={14} className="opacity-40" />
                </button>
              ))}
            </div>

            <div className="py-6 border-b border-shopGray-border">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="w-full flex items-center justify-between mb-8 bg-transparent border-none cursor-pointer text-shopBlack font-[1000] uppercase italic tracking-tighter"
              >
                Price {isPriceOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {isPriceOpen && (
                <div className="px-2 pb-6">
                  <div className="relative w-full h-1.5 bg-shopGray-light rounded-full mb-8">
                    <div
                      className="absolute h-full bg-shopBlack rounded-full transition-all"
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
                          min: Math.min(
                            Number(e.target.value),
                            priceRange.max - 20,
                          ),
                        })
                      }
                      className="range-input"
                    />
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: Math.max(
                            Number(e.target.value),
                            priceRange.min + 20,
                          ),
                        })
                      }
                      className="range-input"
                    />
                    <style>{`
                      .range-input { position: absolute; width: 100%; height: 6px; top: -2.5px; pointer-events: none; -webkit-appearance: none; background: transparent; z-index: 30; }
                      .range-input::-webkit-slider-thumb { pointer-events: auto; width: 18px; height: 18px; border-radius: 50%; background: #000; cursor: pointer; -webkit-appearance: none; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
                    `}</style>
                  </div>
                  <div className="flex justify-between font-black text-sm text-shopBlack tabular-nums">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="py-6 border-b border-shopGray-border">
              <button
                onClick={() => setIsColorsOpen(!isColorsOpen)}
                className="w-full flex items-center justify-between mb-4 bg-transparent border-none cursor-pointer text-shopBlack font-[1000] uppercase italic tracking-tighter"
              >
                Colors {isColorsOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {isColorsOpen && (
                <div className="grid grid-cols-5 gap-4">
                  {availableColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(
                          selectedColor === color.code ? null : color.code,
                        );
                        setCurrentPage(1);
                      }}
                      style={{ backgroundColor: color.code }}
                      className={`w-9 h-9 rounded-full border border-shopBlack/10 flex items-center justify-center transition-all cursor-pointer ${color.code} ${selectedColor === color.code ? "ring-2 ring-shopBlack ring-offset-4 scale-110" : "hover:scale-105"}`}
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

            <div className="py-6 border-b border-shopGray-border">
              <button
                onClick={() => setIsSizeOpen(!isSizeOpen)}
                className="w-full flex items-center justify-between mb-4 bg-transparent border-none cursor-pointer text-shopBlack font-[1000] uppercase italic tracking-tighter"
              >
                Size {isSizeOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {isSizeOpen && (
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(selectedSize === size ? null : size);
                        setCurrentPage(1);
                      }}
                      className={`px-5 py-3 rounded-full text-xs font-black transition-all border-none cursor-pointer ${selectedSize === size ? "bg-shopBlack text-white shadow-xl" : "bg-shopGray-light text-shopBlack/60 hover:bg-shopBlack/10"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="py-6">
              <button
                onClick={() => setIsStyleOpen(!isStyleOpen)}
                className="w-full flex items-center justify-between mb-4 bg-transparent border-none cursor-pointer text-shopBlack font-[1000] uppercase italic tracking-tighter"
              >
                Dress Style {isStyleOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {isStyleOpen && (
                <div className="space-y-4">
                  {dressStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => handleStyleClick(style)}
                      className={`w-full flex justify-between items-center bg-transparent border-none text-[16px] py-1 transition-all cursor-pointer ${selectedStyle === style ? "font-bold text-shopBlack" : "text-shopBlack/60 hover:text-shopBlack"}`}
                    >
                      {style}{" "}
                      <FiChevronRight size={14} className="opacity-40" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-white border-t shrink-0 flex flex-col gap-3">
            <Button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full rounded-full py-4 bg-shopBlack text-white font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all border-none cursor-pointer"
            >
              Apply Filters
            </Button>
            <button
              onClick={clearAllFilters}
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-shopBlack/30 hover:text-shopBlack transition-colors py-2 cursor-pointer text-center"
            >
              Clear All
            </button>
          </div>
        </aside>

        <main className="flex-1 w-full animate-fade-in-up">
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col gap-1 text-left">
              <h1 className="text-[32px] md:text-[40px] font-[1000] uppercase italic tracking-tighter leading-none text-shopBlack">
                {selectedStyle || selectedCategory || "Shop"}
              </h1>
              <p className="text-[12px] font-black uppercase tracking-widest text-shopBlack/20 text-left italic">
                Archive: {filteredProducts.length} Results
              </p>
            </div>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden p-3 bg-shopGray-light rounded-full border-none cursor-pointer shadow-sm hover:scale-110 transition-transform"
            >
              <FiSliders size={20} />
            </button>
          </div>

          {isLoading ? (
            <div className="py-40 flex justify-center">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
              {currentProducts.map((p: Product) => (
                <div key={p.id} className="relative group overflow-hidden">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(p);
                    }}
                    className={`absolute top-4 right-4 z-[50] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-none cursor-pointer 
                      ${
                        isInWishlist(p.id)
                          ? "bg-shopBlack text-white opacity-100 scale-100"
                          : "bg-white text-shopBlack opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 hover:scale-110"
                      }`}
                  >
                    <FiHeart
                      fill={isInWishlist(p.id) ? "white" : "none"}
                      className={
                        isInWishlist(p.id) ? "text-white" : "text-shopBlack"
                      }
                      size={18}
                    />
                  </button>

                  {p.oldPrice && p.oldPrice > p.price && (
                    <div className="absolute top-4 left-4 z-30 pointer-events-none">
                      <span className="bg-shopRed text-white text-[10px] font-[1000] uppercase px-3 py-1.5 rounded-full shadow-lg animate-bounce inline-block">
                        -
                        {Math.round(
                          ((p.oldPrice - p.price) / p.oldPrice) * 100,
                        )}
                        %
                      </span>
                    </div>
                  )}

                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-20 pt-6 border-t border-shopGray-border flex justify-between items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 border border-shopGray-border px-4 md:px-6 py-2.5 rounded-xl text-sm font-black bg-white disabled:opacity-30 hover:bg-shopGray-light transition-all text-shopBlack cursor-pointer"
              >
                <HiArrowLeft /> Previous
              </button>
              <div className="flex gap-2 text-shopBlack">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all border-none cursor-pointer ${currentPage === i + 1 ? "bg-shopBlack text-white shadow-md" : "text-black/40 hover:text-black hover:bg-shopGray-light"}`}
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
                className="flex items-center gap-2 border border-shopGray-border px-4 md:px-6 py-2.5 rounded-xl text-sm font-black bg-white disabled:opacity-30 hover:bg-shopGray-light transition-all text-shopBlack cursor-pointer"
              >
                Next <HiArrowRight />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
