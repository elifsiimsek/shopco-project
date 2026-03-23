import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart, type AddProductData } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const isFavorite = wishlist.some(
    (item) => String(item.id) === String(product.id),
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const cartData: AddProductData = {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      img: product.img,
      selectedSize: "Medium",
      selectedColor: product.colors?.[0] || "Black",
    };
    addToCart(cartData, 1);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col gap-3 no-underline text-black animate-in fade-in duration-500"
    >
      <div className="relative aspect-square bg-[#F0F0F0] rounded-[24px] overflow-hidden shadow-sm">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-none cursor-pointer z-10 
            opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
            ${isFavorite ? "bg-white text-black" : "bg-white/90 text-black/40 hover:bg-white hover:text-black"}
          `}
        >
          <Heart
            size={18}
            fill={isFavorite ? "text-black" : "none"}
            strokeWidth={isFavorite ? 0 : 2}
          />
        </button>

        <button
          onClick={handleQuickAdd}
          className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center bg-white/90 text-black/60 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl border-none cursor-pointer hover:bg-black hover:text-white"
        >
          <ShoppingCart size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 text-left px-1">
        <h3 className="font-[1000] text-base md:text-xl uppercase italic tracking-tighter leading-tight">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex text-[#FFC633]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating) ? "#FFC633" : "none"}
                strokeWidth={i < Math.floor(product.rating) ? 0 : 2}
              />
            ))}
          </div>
          <span className="text-[10px] font-black opacity-20 uppercase tracking-widest pt-0.5">
            {product.rating}/5
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-xl md:text-2xl font-[1000] italic tracking-tighter text-black">
            ${product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xl md:text-2xl font-black text-black/10 line-through tracking-tighter">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
