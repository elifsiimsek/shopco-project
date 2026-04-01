import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FiChevronRight,
  FiSliders,
  FiHeart,
  FiChevronDown,
} from "react-icons/fi";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import ProductCard from "../../components/product/ProductCard";
import Loader from "../../components/ui/Loader";
import { useWishlist } from "../../context/WishlistContext";
import { products as allProducts } from "../../data/products";
import type { Product, PriceRange } from "../../types/product";
import ShopFilters from "./shop-filters";

export default function ShopView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [openStates, setOpenStates] = useState({
    price: true,
    colors: true,
    size: true,
    style: true,
  });

  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 500,
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(
    searchParams.get("style"),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const styleQuery = searchParams.get("style");
    if (styleQuery) {
      setSelectedStyle(styleQuery);
    } else {
      setSelectedStyle(null);
    }

    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const query = searchParams.get("search")?.toLowerCase() || "";

    return allProducts.filter((p: Product) => {
      const matchesSearch = query ? p.name.toLowerCase().includes(query) : true;
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
    searchParams,
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
  };

  const handleStyleChange = (style: string) => {
    const newVal = selectedStyle === style ? null : style;
    setSelectedStyle(newVal);
    newVal ? setSearchParams({ style: newVal }) : setSearchParams({});
    setCurrentPage(1);
  };

  const startRange =
    filteredProducts.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0;
  const endRange = Math.min(
    currentPage * productsPerPage,
    filteredProducts.length,
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 font-satoshi text-left text-black min-h-screen bg-white">
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-8">
        <Link to="/" className="hover:text-black no-underline">
          Home
        </Link>
        <FiChevronRight size={12} />
        <span className="text-black italic">Shop</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 items-start relative">
        <ShopFilters
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          selectedStyle={selectedStyle}
          onStyleChange={handleStyleChange}
          onClear={clearAllFilters}
          openStates={openStates}
          setOpenStates={setOpenStates}
        />

        <main className="flex-1 w-full animate-fade-in-up">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-[32px] md:text-[44px] font-[700] tracking-tighter leading-none m-0">
                {searchParams.get("search")
                  ? `Results for: ${searchParams.get("search")}`
                  : selectedStyle || selectedCategory || "Shop"}
              </h1>
            </div>

            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8 border-t md:border-none border-black/[0.03] pt-6 md:pt-0">
              <div className="flex items-center gap-5">
                <p className="text-black/40 text-[13px] font-medium tracking-tight m-0">
                  Showing{" "}
                  <span className="text-black/40">
                    {startRange}-{endRange}
                  </span>{" "}
                  of{" "}
                  <span className="text-black/40">
                    {filteredProducts.length}
                  </span>{" "}
                  Products
                </p>

                <div className="hidden lg:flex items-center gap-2 cursor-pointer group">
                  <span className="text-black/40 text-[13px] font-medium">
                    Sort by:
                  </span>
                  <span className="text-black text-[13px] font-[1000] flex items-center gap-1 group-hover:opacity-60 transition-opacity">
                    Most Popular <FiChevronDown size={14} className="mt-0.5" />
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden p-3.5 bg-black text-white rounded-full border-none cursor-pointer shadow-xl active:scale-95 transition-transform"
              >
                <FiSliders size={18} />
              </button>
            </div>
          </header>

          {isLoading ? (
            <div className="py-40 flex justify-center">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
                {currentProducts.length > 0 ? (
                  currentProducts.map((p: Product) => (
                    <div key={p.id} className="relative group">
                      <button
                        onClick={() => toggleWishlist(p)}
                        className={`absolute top-4 right-4 z-[50] w-10 h-10 rounded-full flex items-center justify-center transition-all border-none cursor-pointer shadow-sm ${isInWishlist(p.id) ? "bg-black text-white" : "bg-white text-black opacity-0 group-hover:opacity-100"}`}
                      >
                        <FiHeart
                          fill={isInWishlist(p.id) ? "white" : "none"}
                          size={18}
                        />
                      </button>
                      <ProductCard product={p} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-32 text-center">
                    <div className="text-black/5 font-[1000] text-7xl uppercase italic tracking-tighter mb-4">
                      Empty
                    </div>
                    <p className="text-black/20 font-black uppercase italic tracking-widest text-xs">
                      No items found in archive protocol
                    </p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-24 pt-8 border-t border-black/[0.05] flex justify-between items-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((prev) => prev - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 border border-black/[0.05] px-6 py-3 rounded-full text-[11px] font-[1000] tracking-widest bg-white disabled:opacity-20 hover:bg-black hover:text-white transition-all text-black cursor-pointer active:scale-95 shadow-sm"
                  >
                    <HiArrowLeft size={16} /> Previous
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-11 h-11 rounded-full font-[1000] text-xs transition-all border-none cursor-pointer ${currentPage === i + 1 ? "bg-black text-white shadow-lg scale-110" : "text-black/40 hover:text-black hover:bg-black/[0.02]"}`}
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
                    className="flex items-center gap-2 border border-black/[0.05] px-6 py-3 rounded-full text-[11px] font-[1000] tracking-widest bg-white disabled:opacity-20 hover:bg-black hover:text-white transition-all text-black cursor-pointer active:scale-95 shadow-sm"
                  >
                    Next <HiArrowRight size={16} />
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
