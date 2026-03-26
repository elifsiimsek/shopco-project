import { useState, useRef, useEffect } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiChevronDown,
  FiX,
  FiMenu,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { products } from "../../data/products";
import type { Product } from "../../types/product";

export default function Navbar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  const totalItems = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + (item.quantity || 0), 0)
    : 0;
  const totalFavorites = wishlist.length;

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchResults([]);
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length >= 2) {
      const filtered = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            (p.category && p.category.toLowerCase().includes(query)),
        )
        .slice(0, 8);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleResultClick = (id: string | number) => {
    navigate(`/product/${id}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const handleUserClick = () => {
    if (!user) navigate("/login");
    else setIsUserMenuOpen(!isUserMenuOpen);
  };

  const shopCategories = [
    { name: "Casual", path: "/shop?style=Casual" },
    { name: "Formal", path: "/shop?style=Formal" },
    { name: "Party", path: "/shop?style=Party" },
    { name: "Gym", path: "/shop?style=Gym" },
  ];

  return (
    <header className="w-full sticky top-0 z-[1000] shadow-sm bg-white font-satoshi">
      {isBannerVisible && (
        <div className="bg-black text-white py-2.5 px-6 relative flex items-center justify-center w-full min-h-[35px]">
          <p className="text-[12px] md:text-sm font-normal text-center m-0">
            Sign up and get 20% off to your first order.{" "}
            <Link
              to="/register"
              className="font-bold underline text-white ml-1"
            >
              Sign Up Now
            </Link>
          </p>
          <button
            onClick={() => setIsBannerVisible(false)}
            className="absolute right-4 md:right-16 opacity-50 text-white bg-transparent border-none cursor-pointer flex items-center hover:opacity-100 transition-all"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <nav className="w-full border-b border-black/[0.04] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 h-[64px] md:h-[80px] flex items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-1 text-black bg-transparent border-none cursor-pointer flex items-center transition-transform active:scale-95"
            >
              <FiMenu size={24} />
            </button>
            <Link
              to="/"
              className="text-[24px] md:text-[32px] font-[1000] uppercase tracking-tighter text-black leading-none no-underline italic"
            >
              SHOP.CO
            </Link>

            <ul className="hidden lg:flex items-center gap-8 text-[16px] font-normal list-none p-0 m-0">
              <li className="relative group cursor-pointer flex items-center gap-1 py-4">
                <span
                  className={
                    location.pathname.startsWith("/shop")
                      ? "text-black font-bold"
                      : "text-black/60 hover:text-black transition-colors"
                  }
                >
                  Shop
                </span>
                <FiChevronDown className="group-hover:rotate-180 transition-transform opacity-40" />
                <div className="absolute top-[80%] left-0 hidden group-hover:block w-48 bg-white border border-black/5 shadow-xl rounded-2xl p-3 z-[1010] mt-0">
                  <ul className="flex flex-col gap-1 list-none p-0 m-0 text-left text-black">
                    {shopCategories.map((c) => (
                      <li key={c.name}>
                        <Link
                          to={c.path}
                          className="block px-4 py-3 rounded-xl hover:bg-[#F0F0F0] transition-all font-bold text-sm no-underline text-black/60 hover:text-black uppercase"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li>
                <Link
                  to="/on-sale"
                  className={`no-underline transition ${isActive("/on-sale") ? "text-black font-bold" : "text-black/60 hover:text-black"}`}
                >
                  On Sale
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className={`no-underline transition ${isActive("/new-arrivals") ? "text-black font-bold" : "text-black/60 hover:text-black"}`}
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/brands"
                  className={`no-underline transition ${isActive("/brands") ? "text-black font-bold" : "text-black/60 hover:text-black"}`}
                >
                  Brands
                </Link>
              </li>
            </ul>
          </div>

          <div
            ref={searchRef}
            className="flex-1 hidden lg:block relative max-w-[450px]"
          >
            <div className="flex items-center bg-[#F0F0F0] px-5 py-3 rounded-full focus-within:ring-1 focus-within:ring-black/10 transition-all">
              <FiSearch className="text-black/40 text-lg" />
              <input
                type="text"
                id="navbar-search-desktop"
                name="search-desktop"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="bg-transparent outline-none ml-3 text-sm w-full placeholder:text-black/30 text-black border-none font-normal"
              />
            </div>
            {searchResults.length > 0 && (
              <SearchResults
                products={searchResults}
                searchQuery={searchQuery}
                handleResultClick={handleResultClick}
                navigate={navigate}
                setSearchResults={setSearchResults}
              />
            )}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-1 text-black/60 bg-transparent border-none cursor-pointer flex items-center hover:text-black transition-all active:scale-95"
            >
              <FiSearch size={22} />
            </button>
            <Link
              to="/wishlist"
              className={`relative p-1 no-underline transition-all hover:scale-110 ${isActive("/wishlist") ? "text-red-500" : "text-black/60 hover:text-black"}`}
            >
              <FiHeart size={24} />
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalFavorites}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className={`relative p-1 no-underline transition-all hover:scale-110 ${isActive("/cart") ? "text-black" : "text-black/60 hover:text-black"}`}
            >
              <FiShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleUserClick}
                className="p-1 bg-transparent border-none cursor-pointer text-black/60 hover:text-black transition-all"
              >
                {user ? (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black italic uppercase transition ${isActive("/account") ? "bg-black text-white" : "bg-black text-white"}`}
                  >
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <FiUser size={24} />
                )}
              </button>
              {user && isUserMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white border border-black/5 shadow-2xl rounded-[24px] p-2 z-[1010] animate-in slide-in-from-top-2 text-left text-black">
                  <Link
                    to="/account"
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors no-underline ${isActive("/account") ? "bg-[#F5F5F5] text-black font-bold" : "text-black hover:bg-[#F5F5F5]"}`}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiUser size={16} />
                    <span className="text-[11px] uppercase tracking-tight">
                      Profile
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <FiLogOut size={16} />
                    <span className="text-[11px] font-bold uppercase">
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={`fixed inset-x-0 top-[64px] bottom-0 bg-white z-[1001] lg:hidden p-6 transition-transform duration-300 origin-top shadow-2xl ${isSearchOpen ? "scale-y-100" : "scale-y-0"}`}
          >
            <div className="flex items-center bg-[#F0F0F0] px-5 py-3 rounded-full mb-6">
              <FiSearch className="text-black/40 text-lg" />
              <input
                type="text"
                id="navbar-search-mobile"
                name="search-mobile"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none ml-3 text-sm w-full text-black border-none font-normal"
                autoFocus={isSearchOpen}
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="ml-2 text-black/40 bg-transparent border-none"
              >
                <FiX size={18} />
              </button>
            </div>
            {searchResults.length > 0 && (
              <SearchResults
                products={searchResults}
                searchQuery={searchQuery}
                handleResultClick={handleResultClick}
                navigate={navigate}
                setSearchResults={setSearchResults}
                isMobile
              />
            )}
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/40 z-[2000] transition-opacity duration-500 ${isMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div
          className={`fixed top-0 left-0 w-[280px] h-full bg-white transition-transform duration-500 p-10 shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-12 text-left">
            <h2 className="text-2xl font-[1000] uppercase m-0 italic text-black">
              SHOP.CO
            </h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="bg-transparent border-none cursor-pointer text-black"
            >
              <FiX size={28} />
            </button>
          </div>
          <ul className="flex flex-col gap-8 list-none p-0 text-left">
            {shopCategories.map((c) => (
              <li key={c.name}>
                <Link
                  to={c.path}
                  className={`no-underline uppercase text-lg transition ${location.search.includes(c.name) ? "text-black font-[1000]" : "text-black/40 hover:text-black font-bold"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <div className="h-[1px] bg-black/5 w-full my-2" />
            <li>
              <Link
                to="/on-sale"
                className={`no-underline uppercase text-lg transition ${isActive("/on-sale") ? "text-black font-[1000]" : "text-black/40 hover:text-black font-bold"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                On Sale
              </Link>
            </li>
            <li>
              <Link
                to="/new-arrivals"
                className={`no-underline uppercase text-lg transition ${isActive("/new-arrivals") ? "text-black font-[1000]" : "text-black/40 hover:text-black font-bold"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                to="/brands"
                className={`no-underline uppercase text-lg transition ${isActive("/brands") ? "text-black font-[1000]" : "text-black/40 hover:text-black font-bold"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Brands
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

interface SearchResultsProps {
  products: Product[];
  searchQuery: string;
  handleResultClick: (id: string | number) => void;
  navigate: (path: string) => void;
  setSearchResults: (products: Product[]) => void;
  isMobile?: boolean;
}

function SearchResults({
  products,
  searchQuery,
  handleResultClick,
  navigate,
  setSearchResults,
  isMobile,
}: SearchResultsProps) {
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
              className="w-10 h-10 object-cover rounded-lg"
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
