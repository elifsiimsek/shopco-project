import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import { products } from "../../../data/products";

// Sections Parçaları
import NavbarBanner from "./navbar-banner";
import NavbarSearchResults from "./navbar-search-results";
import NavbarMobileMenu from "./navbar-mobile-menu";

export default function NavbarView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
            p.category?.toLowerCase().includes(query),
        )
        .slice(0, 8);
      setSearchResults(filtered);
    } else setSearchResults([]);
  }, [searchQuery]);

  const handleResultClick = (id: string | number) => {
    navigate(`/product/${id}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
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
        <NavbarBanner onClose={() => setIsBannerVisible(false)} />
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
                placeholder="Search..."
                className="bg-transparent outline-none ml-3 text-sm w-full text-black border-none"
              />
            </div>
            {searchResults.length > 0 && (
              <NavbarSearchResults
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
              className="lg:hidden p-1 text-black/60 bg-transparent border-none cursor-pointer"
            >
              <FiSearch size={22} />
            </button>
            <Link
              to="/wishlist"
              className={`relative p-1 no-underline ${isActive("/wishlist") ? "text-red-500" : "text-black/60 hover:text-black"}`}
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
              className={`relative p-1 no-underline ${isActive("/cart") ? "text-black" : "text-black/60 hover:text-black"}`}
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
                onClick={() =>
                  user ? setIsUserMenuOpen(!isUserMenuOpen) : navigate("/login")
                }
                className="p-1 bg-transparent border-none cursor-pointer text-black/60 hover:text-black"
              >
                {user ? (
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-black italic">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <FiUser size={24} />
                )}
              </button>
              {user && isUserMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white border border-black/5 shadow-2xl rounded-[24px] p-2 z-[1010] text-left text-black">
                  <Link
                    to="/account"
                    className="flex items-center gap-3 p-3 text-black no-underline hover:bg-[#F5F5F5] rounded-xl"
                  >
                    <FiUser size={16} />
                    <span className="text-[11px] font-bold uppercase">
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
            <div className="flex items-center bg-[#F0F0F0] px-5 py-3 rounded-full mb-6 text-black">
              <FiSearch className="text-black/40 text-lg" />
              <input
                type="text"
                id="navbar-search-mobile"
                name="search-mobile"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none ml-3 text-sm w-full text-black border-none"
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
              <NavbarSearchResults
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
      <NavbarMobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        shopCategories={shopCategories}
        isActive={isActive}
      />
    </header>
  );
}
