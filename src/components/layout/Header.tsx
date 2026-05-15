import { Link } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-[1440px] mx-auto px-16 h-[80px] flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          SHOP.CO
        </Link>

        <ul className="hidden lg:flex gap-8 text-[16px] font-medium">
          <li>
            <Link to="/">Shop</Link>
          </li>
          <li>
            <Link to="/">On Sale</Link>
          </li>
          <li>
            <Link to="/">New Arrivals</Link>
          </li>
          <li>
            <Link to="/">Brands</Link>
          </li>
        </ul>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-[#F2F0F1] px-4 py-2 rounded-full w-[320px]">
            <FiSearch className="text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Search for products..."
              className="bg-transparent outline-none ml-3 text-sm w-full"
            />
          </div>

          <FiUser className="text-2xl cursor-pointer" />
          <FiShoppingCart className="text-2xl cursor-pointer" />
        </div>
      </div>
    </nav>
  );
}
