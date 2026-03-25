import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiChevronRight, FiSliders, FiHeart } from "react-icons/fi";
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
  const [openStates, setOpenStates] = useState({ price: true, colors: true, size: true, style: true });

  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 500 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(searchParams.get("style"));
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
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchesStyle = selectedStyle ? p.style === selectedStyle : true;
      const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      const matchesColor = selectedColor ? p.colors?.includes(selectedColor) : true;
      const matchesSize = selectedSize ? p.sizes?.includes(selectedSize) : true;
      
      return matchesSearch && matchesCategory && matchesStyle && matchesPrice && matchesColor && matchesSize;
    });
  }, [searchParams, selectedCategory, selectedStyle, priceRange, selectedColor, selectedSize]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

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

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 font-satoshi text-left text-black min-h-screen bg-white">
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-8">
        <Link to="/" className="hover:text-black no-underline">Home</Link>
        <FiChevronRight size={12} />
        <span className="text-black italic">Shop</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
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
          <header className="flex justify-between items-center mb-10 text-left">
            <div className="flex flex-col gap-1">
              <h1 className="text-[32px] md:text-[40px] font-[1000] uppercase italic tracking-tighter leading-none">
                {searchParams.get("search") ? `Results for: ${searchParams.get("search")}` : (selectedStyle || selectedCategory || "Shop")}
              </h1>
              <p className="text-[12px] font-black uppercase tracking-widest text-black/20 italic">
                Archive: {filteredProducts.length} Results
              </p>
            </div>
            <button 
              onClick={() => setIsMobileFilterOpen(true)} 
              className="lg:hidden p-3 bg-[#F5F5F5] rounded-full border-none cursor-pointer"
            >
              <FiSliders size={20} />
            </button>
          </header>

          {isLoading ? (
            <div className="py-40 flex justify-center"><Loader /></div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                {currentProducts.length > 0 ? (
                  currentProducts.map((p: Product) => (
                    <div key={p.id} className="relative group overflow-hidden">
                      <button 
                        onClick={() => toggleWishlist(p)} 
                        className={`absolute top-4 right-4 z-[50] w-10 h-10 rounded-full flex items-center justify-center transition-all border-none cursor-pointer ${isInWishlist(p.id) ? "bg-black text-white" : "bg-white text-black opacity-0 group-hover:opacity-100"}`}
                      >
                        <FiHeart fill={isInWishlist(p.id) ? "white" : "none"} size={18} />
                      </button>
                      <ProductCard product={p} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-black/20 font-black uppercase italic tracking-widest">
                    No items found in archive
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-20 pt-6 border-t border-[#F0F0F0] flex justify-between items-center">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                    className="flex items-center gap-2 border border-[#F0F0F0] px-4 md:px-6 py-2.5 rounded-xl text-sm font-black bg-white disabled:opacity-30 hover:bg-[#F5F5F5] transition-all text-black cursor-pointer"
                  >
                    <HiArrowLeft /> Previous
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                        className={`w-10 h-10 rounded-xl font-black text-sm transition-all border-none cursor-pointer ${currentPage === i + 1 ? "bg-black text-white shadow-md" : "text-black/40 hover:text-black hover:bg-[#F5F5F5]"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                    className="flex items-center gap-2 border border-[#F0F0F0] px-4 md:px-6 py-2.5 rounded-xl text-sm font-black bg-white disabled:opacity-30 hover:bg-[#F5F5F5] transition-all text-black cursor-pointer"
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