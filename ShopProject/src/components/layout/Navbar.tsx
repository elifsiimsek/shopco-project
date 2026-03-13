import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length > 0) {
      const filtered = products
        .filter((p) => p.name.toLowerCase().includes(query))
        .slice(0, 6);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleResultClick = (id: string | number) => {
    navigate(`/product/${id}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setIsUserMenuOpen(!isUserMenuOpen);
    }
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
        <div className="bg-black text-white py-2.5 px-4 relative flex items-center justify-center w-full">
          <p className="text-[12px] md:text-sm font-normal text-center m-0">
            Sign up and get 20% off to your first order.{" "}
            <Link
              to="/register"
              className="font-black underline underline-offset-4 text-white"
            >
              Sign Up Now
            </Link>
          </p>
          <button
            onClick={() => setIsBannerVisible(false)}
            className="absolute right-4 md:right-16 opacity-60 text-white bg-transparent border-none cursor-pointer flex items-center"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <nav className="w-full border-b border-black/5 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 h-[64px] md:h-[80px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-1 text-black bg-transparent border-none cursor-pointer flex items-center"
            >
              <FiMenu size={24} />
            </button>
            <Link
              to="/"
              className="text-[24px] md:text-[32px] font-[1000] uppercase tracking-tighter text-black leading-none no-underline"
            >
              SHOP.CO
            </Link>
          </div>

          <ul className="hidden lg:flex items-center gap-8 text-[16px] font-bold list-none p-0 m-0">
            <li className="relative group cursor-pointer flex items-center gap-1 py-2 text-black/60 hover:text-black transition">
              <span>Shop</span>
              <FiChevronDown className="group-hover:rotate-180 transition-transform" />
              <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white border border-black/5 shadow-xl rounded-2xl p-3 z-[1001]">
                <ul className="flex flex-col gap-1 list-none p-0 m-0 text-left">
                  {shopCategories.map((c) => (
                    <li key={c.name} className="list-none">
                      <Link
                        to={c.path}
                        className="block px-4 py-3 text-black/50 hover:text-black hover:bg-[#F0F0F0] rounded-xl transition font-bold text-sm no-underline"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className="list-none">
              <Link
                to="/on-sale"
                className="text-black/60 hover:text-black transition no-underline"
              >
                On Sale
              </Link>
            </li>
            <li className="list-none">
              <Link
                to="/new-arrivals"
                className="text-black/60 hover:text-black transition no-underline"
              >
                New Arrivals
              </Link>
            </li>
            <li className="list-none">
              <Link
                to="/brands"
                className="text-black/60 hover:text-black transition no-underline"
              >
                Brands
              </Link>
            </li>
          </ul>

          <div
            ref={searchRef}
            className="flex-1 hidden md:block relative max-w-[500px]"
          >
            <div className="flex items-center bg-[#F0F0F0] px-5 py-3 rounded-full focus-within:ring-2 focus-within:ring-black/5 transition-all">
              <FiSearch className="text-black/40 text-xl" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="bg-transparent outline-none ml-3 text-sm w-full placeholder:text-black/30 text-black border-none font-bold"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-[110%] left-0 w-full bg-white border border-black/10 shadow-2xl rounded-2xl overflow-hidden py-2 z-[1005]">
                <div className="max-h-[400px] overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleResultClick(product.id)}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-[#F0F0F0] cursor-pointer transition-colors"
                    >
                      <img
                        src={product.img}
                        alt=""
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-black uppercase">
                          {product.name}
                        </span>
                        <span className="text-xs font-black text-black/40">
                          ${product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 px-4 border-t border-black/5 bg-white">
                  <button
                    onClick={() => {
                      navigate(`/shop?search=${searchQuery}`);
                      setSearchResults([]);
                    }}
                    className="w-full py-3 text-[10px] font-[1000] uppercase italic tracking-widest bg-black text-white rounded-xl cursor-pointer border-none"
                  >
                    View All Results
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <Link to="/wishlist" className="relative p-1 no-underline">
              <FiHeart size={24} className="text-black" />
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalFavorites}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-1 no-underline">
              <FiShoppingCart size={24} className="text-black" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF3333] text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleUserClick}
                className="p-1 bg-transparent border-none cursor-pointer flex items-center"
              >
                {user ? (
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-black italic uppercase">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <FiUser size={24} className="text-black" />
                )}
              </button>
              {user && isUserMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white border border-black/5 shadow-2xl rounded-[24px] p-2 z-[1003]">
                  <div className="px-4 py-3 border-b border-black/5 mb-1 text-left">
                    <p className="text-[10px] font-black text-black/30 uppercase tracking-widest m-0">
                      Account
                    </p>
                    <p className="text-xs font-bold truncate mt-1 m-0">
                      {user.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/account"
                      className="flex items-center gap-3 p-3 hover:bg-[#F5F5F5] rounded-xl text-black no-underline"
                    >
                      <FiUser size={16} />{" "}
                      <span className="text-[11px] font-black uppercase">
                        Profile
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl border-none bg-transparent cursor-pointer"
                    >
                      <FiLogOut size={16} />{" "}
                      <span className="text-[11px] font-black uppercase">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/40 z-[2000] transition-opacity ${isMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div
          className={`fixed top-0 left-0 w-[280px] h-full bg-white transition-transform duration-300 p-8 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black uppercase m-0">SHOP.CO</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="bg-transparent border-none cursor-pointer"
            >
              <FiX size={28} />
            </button>
          </div>
          <ul className="flex flex-col gap-6 font-black uppercase text-lg list-none p-0 text-left">
            {shopCategories.map((c) => (
              <li key={c.name}>
                <Link
                  to={c.path}
                  className="no-underline text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <hr className="border-black/5 w-full m-0" />
            <li>
              <Link
                to="/on-sale"
                className="no-underline text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                On Sale
              </Link>
            </li>
            <li>
              <Link
                to="/new-arrivals"
                className="no-underline text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
