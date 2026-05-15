import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, X } from "lucide-react";
import { FiShoppingBag } from "react-icons/fi";
import { useCart, type AddProductData } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
  showControls?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showControls = true,
}) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const isFavorite = wishlist.some((item) => item.id === product.id);

  const discountPercentage =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : product.discount;

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConfirmAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize || !selectedColor) return;

    const cartData: AddProductData = {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      img: product.img,
      selectedSize,
      selectedColor,
    };

    addToCart(cartData, 1);
    setIsModalOpen(false);
    setSelectedSize("");
    setSelectedColor("");
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      <Link
        to={`/product/${product.id}`}
        className="group flex flex-col gap-3 no-underline text-black animate-in fade-in duration-500"
      >
        <div className="relative aspect-square bg-shopGray-light rounded-[24px] overflow-hidden shadow-sm">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://i.sstatic.net/y9DpT.jpg";
            }}
          />

          {showControls && (
            <>
              <button
                onClick={handleFavoriteClick}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-none cursor-pointer z-10 
                  opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                  ${isFavorite ? "bg-white text-black" : "bg-white/90 text-black/40 hover:bg-white hover:text-black"}
                `}
              >
                <Heart
                  size={18}
                  fill={isFavorite ? "black" : "none"}
                  strokeWidth={isFavorite ? 0 : 2}
                />
              </button>

              <button
                onClick={handleQuickAddClick}
                className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center bg-white/90 text-black/60 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl border-none cursor-pointer hover:bg-black hover:text-white"
              >
                <ShoppingCart size={20} />
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-left px-1">
          <h3 className="font-[700] text-base md:text-xl tracking-tighter leading-tight truncate">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5">
            <div className="flex text-shopYellow">
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
            <span className="text-xl md:text-2xl font-[1000] tracking-tighter text-black">
              ${product.price}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-xl md:text-2xl font-black text-black/10 line-through tracking-tighter">
                  ${product.oldPrice}
                </span>
                {discountPercentage && (
                  <span className="bg-shopRed/10 text-shopRed px-3 py-1 rounded-full text-[10px] md:text-[12px] font-black tracking-tighter">
                    -%{discountPercentage}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </Link>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-[420px] rounded-[40px] p-10 flex flex-col items-center shadow-2xl animate-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-black/20 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-[1000] text-black mb-10 uppercase tracking-tighter text-center">
              Quick Selection
            </h2>

            <div className="w-full flex flex-col gap-8">
              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] font-black uppercase text-black/30 tracking-widest">
                  Select Color
                </span>
                <div className="flex flex-wrap justify-center gap-3">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border border-black/10 transition-all ${color} ${
                        selectedColor === color
                          ? "scale-125 ring-2 ring-black/30 shadow-lg"
                          : "opacity-50 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] font-black uppercase text-black/30 tracking-widest">
                  Select Size
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-12 rounded-2xl font-[1000] transition-all border-2 flex items-center justify-center ${
                        selectedSize === size
                          ? "bg-black text-white border-black shadow-lg scale-110"
                          : "bg-white text-black border-gray-100 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmAdd}
                disabled={!selectedSize || !selectedColor}
                className={`w-full py-6 rounded-full font-[1000] text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  !selectedSize || !selectedColor
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-900 active:scale-95 shadow-xl"
                }`}
              >
                <FiShoppingBag/> Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
