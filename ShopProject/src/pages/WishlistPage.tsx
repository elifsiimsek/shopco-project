import { Link } from "react-router-dom";
import {
  FiTrash2,
  FiShoppingCart,
  FiChevronRight,
  FiHeart,
  FiCopy,
  FiTag,
} from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, setNotification } = useCart();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setNotification("Promo code copied! 📋");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 font-satoshi text-left text-black min-h-screen selection:bg-shopBlack selection:text-white">
      <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-12 animate-fade-in-up">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <FiChevronRight size={12} className="opacity-40" />
        <span className="text-black font-bold italic uppercase tracking-widest leading-none">
          Wishlist
        </span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b border-shopGray-border pb-12 text-left animate-fade-in-up">
        <div className="space-y-4">
          <h1 className="text-[50px] md:text-[64px] font-[1000] uppercase tracking-[-0.06em] leading-[0.85] italic">
            Saved <br />
            <span className="text-black/10 not-italic font-serif font-light lowercase">
              Pieces
            </span>
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30 leading-none">
            {wishlist.length} Items in your private archive
          </p>
        </div>

        {wishlist.length > 0 && (
          <div
            onClick={() => copyToClipboard("SHOPCO20")}
            className="group cursor-pointer bg-shopBlack text-white px-6 py-4 rounded-[24px] flex items-center gap-4 hover:scale-105 transition-all shadow-xl"
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <FiTag
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
            </div>
            <div className="flex flex-col pr-4">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                Special Offer
              </span>
              <span className="text-sm font-black tracking-widest italic">
                SHOPCO20 <span className="text-white/20 ml-1">(-20%)</span>
              </span>
            </div>
            <FiCopy
              size={14}
              className="opacity-20 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>

      {wishlist.length > 0 ? (
        <div className="max-w-[1000px] animate-fade-in-up">
          <div className="flex flex-col gap-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group flex items-center gap-4 md:gap-8 p-4 md:p-6 rounded-[32px] bg-shopGray-muted hover:bg-white border border-transparent hover:border-shopGray-border transition-all duration-500 hover:shadow-xl"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 bg-shopGray-light rounded-[24px] overflow-hidden shrink-0">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[8px] font-black text-black/20 uppercase tracking-widest block mb-1">
                    Archive Item
                  </span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-black text-[14px] md:text-[18px] text-black uppercase tracking-tighter italic truncate hover:text-black/60 transition-colors leading-none">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-[1000] text-base md:text-xl tracking-tighter italic leading-none">
                      ${product.price}
                    </span>
                    {product.oldPrice && (
                      <span className="text-black/10 line-through text-xs font-black decoration-shopRed/20 leading-none">
                        ${product.oldPrice}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() => addToCart({ ...product, quantity: 1 }, 1)}
                    className="w-10 h-10 md:w-12 md:h-12 bg-shopBlack text-white rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer border-none shadow-lg"
                  >
                    <FiShoppingCart size={16} />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="w-10 h-10 md:w-12 md:h-12 bg-white text-black/20 hover:text-shopRed rounded-full flex items-center justify-center transition-all cursor-pointer border border-shopGray-border"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-10 animate-fade-in-up">
          <div className="relative">
            <FiHeart size={100} className="text-black/[0.03]" />
            <FiHeart
              size={40}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/10 animate-ping"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-[40px] font-[1000] uppercase italic tracking-tighter leading-none opacity-10">
              Your archive is empty
            </h2>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30">
              Start saving pieces you love
            </p>
          </div>
          <Link to="/shop">
            <Button className="px-16 py-6 bg-shopBlack text-white rounded-full font-[1000] uppercase italic tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all">
              Browse Collection
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
