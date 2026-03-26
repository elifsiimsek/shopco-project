import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shopCategories: { name: string; path: string }[];
  isActive: (path: string) => boolean;
}

export default function NavbarMobileMenu({
  isOpen,
  onClose,
  shopCategories,
  isActive,
}: Props) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 z-[2000] transition-opacity duration-500 ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div
        className={`fixed top-0 left-0 w-[280px] h-full bg-white transition-transform duration-500 p-10 shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-12 text-left">
          <h2 className="text-2xl font-[1000] uppercase m-0 italic text-black">
            SHOP.CO
          </h2>
          <button
            onClick={onClose}
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
                className={`no-underline uppercase text-lg transition ${isActive(c.path) ? "text-black font-[1000]" : "text-black/40 hover:text-black font-bold"}`}
                onClick={onClose}
              >
                {c.name}
              </Link>
            </li>
          ))}
          <div className="h-[1px] bg-black/5 w-full my-2" />
          <li>
            <Link
              to="/on-sale"
              className="no-underline uppercase text-lg text-black"
              onClick={onClose}
            >
              On Sale
            </Link>
          </li>
          <li>
            <Link
              to="/new-arrivals"
              className="no-underline uppercase text-lg text-black"
              onClick={onClose}
            >
              New Arrivals
            </Link>
          </li>
          <li>
            <Link
              to="/brands"
              className="no-underline uppercase text-lg text-black"
              onClick={onClose}
            >
              Brands
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
