import { useState, useMemo, useEffect, useRef } from "react";
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
import { productService } from "../../data/products";
import type { Product, PriceRange } from "../../data/products";
import ShopFilters from "./shop-filters";

export default function ShopView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Most Popular");
  const sortRef = useRef<HTMLDivElement>(null);

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
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getAllProducts();
        setAllProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const styleQuery = searchParams.get("style");
    if (styleQuery) setSelectedStyle(styleQuery);
  }, [searchParams]);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setIsSortOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    const query = searchParams.get("search")?.toLowerCase() || "";

    let result = allProducts.filter((p: Product) => {
      const matchesSearch = query ? p.name.toLowerCase().includes(query) : true;

      const matchesCategory = selectedCategory
        ? p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          p.name
            .toLowerCase()
            .includes(selectedCategory.toLowerCase().replace("s", ""))
        : true;

      const matchesStyle = selectedStyle
        ? p.style?.toLowerCase() === selectedStyle.toLowerCase()
        : true;

      const matchesPrice =
        p.price >= priceRange.min && p.price <= priceRange.max;

      const matchesColor = selectedColor
        ? p.colors?.some((c) =>
            c.toLowerCase().includes(selectedColor.toLowerCase()),
          )
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

    if (sortBy === "Price: Low to High")
      result.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low")
      result.sort((a, b) => b.price - a.price);

    return result;
  }, [
    allProducts,
    searchParams,
    selectedCategory,
    selectedStyle,
    priceRange,
    selectedColor,
    selectedSize,
    sortBy,
  ]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage,
  );
  const currentProducts = filteredAndSortedProducts.slice(
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

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 font-satoshi text-left text-black min-h-screen">
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-8">
        <Link
          to="/"
          className="hover:text-black no-underline transition-colors"
        >
          Home
        </Link>
        <FiChevronRight size={12} />
        <span className="text-black italic font-black">Shop</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 items-start relative">
        <ShopFilters
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
          priceRange={priceRange}
          onPriceChange={(range) => {
            setPriceRange(range);
            setCurrentPage(1);
          }}
          selectedColor={selectedColor}
          onColorChange={(color) => {
            setSelectedColor(color);
            setCurrentPage(1);
          }}
          selectedSize={selectedSize}
          onSizeChange={(size) => {
            setSelectedSize(size);
            setCurrentPage(1);
          }}
          selectedStyle={selectedStyle}
          onStyleChange={(s) => {
            setSelectedStyle(s);
            setCurrentPage(1);
            setSearchParams(s ? { style: s } : {});
          }}
          onClear={clearAllFilters}
          openStates={openStates}
          setOpenStates={setOpenStates}
        />

        <main className="flex-1 w-full">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <h1 className="text-[32px] md:text-[44px] font-[900] tracking-tighter m-0 uppercase italic">
              {selectedStyle || selectedCategory || "The Archive"}
            </h1>

            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8">
              <p className="text-black/40 text-[13px] font-bold">
                Showing {currentProducts.length} of{" "}
                {filteredAndSortedProducts.length} Products
              </p>

              <div
                className="hidden lg:flex items-center gap-2 relative"
                ref={sortRef}
              >
                <span className="text-black/30 text-[13px] font-bold">
                  Sort by:
                </span>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-transparent border-none text-black text-[13px] font-black flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
                >
                  {sortBy} <FiChevronDown />
                </button>

                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl p-2 z-[100] border border-black/5">
                    {[
                      "Most Popular",
                      "Price: Low to High",
                      "Price: High to Low",
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortBy(opt);
                          setIsSortOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-black rounded-xl border-none cursor-pointer transition-all ${
                          sortBy === opt
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-black/5"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden p-3.5 bg-black text-white rounded-full border-none cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
              >
                <FiSliders size={18} />
              </button>
            </div>
          </header>

          {isLoading ? (
            <div className="py-40 flex flex-col items-center gap-4">
              <Loader />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">
                Accessing Vault...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12">
                {currentProducts.length > 0 ? (
                  currentProducts.map((p) => (
                    <div key={p.id} className="relative group">
                      <button
                        onClick={() => toggleWishlist(p)}
                        className={`absolute top-4 right-4 z-[50] w-10 h-10 rounded-full flex items-center justify-center transition-all border-none cursor-pointer shadow-md ${
                          isInWishlist(p.id)
                            ? "bg-black text-white scale-110"
                            : "bg-white text-black opacity-0 group-hover:opacity-100 hover:scale-110"
                        }`}
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
                  <div className="col-span-full py-40 text-center flex flex-col items-center gap-6">
                    <div className="opacity-10 font-[1000] text-[60px] md:text-[100px] italic uppercase leading-none">
                      Empty
                    </div>
                    <p className="text-black/40 font-bold max-w-[300px]">
                      No products match your current filters. Try resetting
                      them.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="px-8 py-3 bg-black text-white rounded-full font-black text-[11px] uppercase tracking-widest border-none cursor-pointer"
                    >
                      Clear All Filters
                    </button>
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
                    className="flex items-center gap-2 border border-black/[0.05] px-6 py-3 rounded-full text-[11px] font-black tracking-widest bg-white disabled:opacity-20 cursor-pointer text-black hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    <HiArrowLeft size={16} /> Previous
                  </button>

                  <div className="hidden sm:flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-11 h-11 rounded-full font-black text-xs border-none cursor-pointer transition-all ${
                          currentPage === i + 1
                            ? "bg-black text-white shadow-xl scale-110"
                            : "text-black/40 bg-transparent hover:bg-black/5"
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
                    className="flex items-center gap-2 border border-black/[0.05] px-6 py-3 rounded-full text-[11px] font-black tracking-widest bg-white disabled:opacity-20 cursor-pointer text-black hover:bg-black hover:text-white transition-all shadow-sm"
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
