import { Link } from "react-router-dom";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import type { Product } from "../../types/product";

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemove: (product: Product) => void;
}

export default function WishlistItem({
  product,
  onAddToCart,
  onRemove,
}: Props) {
  return (
    <div className="group flex items-center gap-4 md:gap-8 p-4 md:p-6 rounded-[32px] bg-shopGray-muted hover:bg-white border border-transparent hover:border-shopGray-border transition-all duration-500 hover:shadow-xl">
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
            <span className="text-black/10 line-through text-xs font-black">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => onAddToCart(product)}
          className="w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer border-none shadow-lg"
        >
          <FiShoppingCart size={16} />
        </button>
        <button
          onClick={() => onRemove(product)}
          className="w-10 h-10 md:w-12 md:h-12 bg-white text-black/20 hover:text-red-500 rounded-full flex items-center justify-center transition-all cursor-pointer border border-shopGray-border"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
}
