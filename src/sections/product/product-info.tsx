import { Star, Check, Minus, Plus, Heart } from "lucide-react";
import Button from "../../components/ui/Button";
import type { Product } from "../../types/product";

interface ProductInfoProps {
  product: Product;
  selectedColor: string;
  setSelectedColor: (val: string) => void;
  selectedSize: string;
  setSelectedSize: (val: string) => void;
  quantity: number;
  setQuantity: (val: number | ((prev: number) => number)) => void;
  onAddToCart: () => void;
  onToggleWishlist: (p: Product) => void;
  isFavorite: boolean;
}

export default function ProductInfo({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  onAddToCart,
  onToggleWishlist,
  isFavorite,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col text-left">
      <div className="flex justify-between items-start">
        <h1 className="text-[32px] md:text-[44px] font-[1000] uppercase tracking-tighter leading-tight m-0">
          {product.name}
        </h1>
        <button
          onClick={() => onToggleWishlist(product)}
          className={`p-4 rounded-full border border-black/5 transition-all shadow-xl cursor-pointer ${
            isFavorite
              ? "bg-black text-white"
              : "bg-white text-black/10 hover:text-black"
          }`}
        >
          <Heart
            size={22}
            fill={isFavorite ? "currentColor" : "none"}
            strokeWidth={2.5}
          />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex text-[#FFC633]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              fill={i < Math.floor(product.rating) ? "#FFC633" : "none"}
              strokeWidth={0}
            />
          ))}
        </div>
        <span className="text-xs font-black opacity-30">
          {product.rating}/5
        </span>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <span className="text-[32px] md:text-[40px] font-[700] tracking-tighter">
          ${product.price}
        </span>
        {product.oldPrice && (
          <div className="flex items-center gap-3">
            <span className="md text-[40px] text-black/10 font-[700] line-through tracking-tighter">
              ${product.oldPrice}
            </span>
            <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-[1000]">
              -
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100,
              )}
              %
            </span>
          </div>
        )}
      </div>

      <p className="text-black/50 text-sm leading-relaxed border-b border-black/5 pb-8 mt-4 max-w-[500px]">
        {product.description}
      </p>

      <div className="space-y-4 pt-6">
        <p className="text-[15px] tracking-widest text-black/50">
          Select Colors
        </p>
        <div className="flex gap-3 leading-relaxed border-b border-black/5 pb-8 mt-1">
          {(product.colors || []).map((color) => {
            const isWhite = color === "bg-white" || color.includes("white");

            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-9 h-9 rounded-full border border-black/10 flex items-center justify-center transition-all cursor-pointer ${color} ${
                  selectedColor === color
                    ? "ring-2 ring-black ring-offset-2 scale-110 shadow-lg"
                    : "hover:scale-110"
                }`}
              >
                {selectedColor === color && (
                  <Check
                    size={16}
                    className={isWhite ? "text-black" : "text-white"}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 border-b border-black/5 pb-10 pt-8">
        <p className="text-[15px] tracking-widest text-black/50">Choose Size</p>
        <div className="flex flex-wrap gap-2">
          {(product.sizes || []).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-8 py-3 rounded-full text-[14px] font-bold tracking-widest transition-all cursor-pointer border-none ${
                selectedSize === size
                  ? "bg-black text-white shadow-xl scale-105"
                  : "bg-[#F0F0F0] text-black/40 hover:bg-black/10"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-8">
        <div className="flex items-center justify-between w-[140px] bg-[#F0F0F0] px-6 py-4 rounded-full font-black text-black">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="opacity-30 border-none bg-transparent cursor-pointer hover:opacity-100 transition-opacity"
          >
            <Minus size={20} />
          </button>
          <span className="tabular-nums text-lg font-bold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="opacity-30 border-none bg-transparent cursor-pointer hover:opacity-100 transition-opacity"
          >
            <Plus size={20} />
          </button>
        </div>
        <Button
          onClick={onAddToCart}
          className="flex-1 py-4 bg-black text-white font-bold rounded-full tracking-widest text-[16px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all border-none cursor-pointer"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
