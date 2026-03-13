import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Check,
  Minus,
  Plus,
  ChevronRight,
  X,
  SlidersHorizontal,
  ChevronDown,
  Heart,
} from "lucide-react";
import { products } from "../data/products";
import { useCart, type AddProductData } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Button from "../components/ui/Button";
import { ProductCard } from "../components/product/ProductCard";
import type { Product } from "../types/product";

const tabs = ["Product Details", "Rating & Reviews", "FAQs"];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, setNotification } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("Rating & Reviews");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const product = useMemo(
    () => products.find((p: Product) => String(p.id) === String(id)),
    [id],
  );

  const isFavorite = isInWishlist(product?.id || "");
  const relatedProducts = useMemo(
    () =>
      products.filter((p: Product) => String(p.id) !== String(id)).slice(0, 4),
    [id],
  );

  const [selectedSize, setSelectedSize] = useState("Large");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setMainImage(product.img);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
    }
  }, [id, product]);

  if (!product)
    return (
      <div className="py-40 text-center font-[1000] uppercase tracking-widest text-black/10">
        Product Not Found
      </div>
    );

  const handleAddToCart = () => {
    const cartData: AddProductData = {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      img: product.img,
      selectedSize,
      selectedColor,
    };
    addToCart(cartData, quantity);
  };

  const handlePostReview = () => {
    if (!newReview.comment.trim()) {
      setNotification("Please write your thoughts. ✍️");
      return;
    }
    setNotification("Vault review established! ⭐");
    setIsReviewModalOpen(false);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 text-left font-satoshi text-black">
      <nav className="flex items-center gap-2 text-[14px] text-black/40 mb-10 font-bold uppercase tracking-widest">
        <Link to="/" className="hover:text-black transition no-underline">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-black transition no-underline">
          Shop
        </Link>
        <ChevronRight size={14} />
        <span className="text-black font-black italic">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-24">
        <div className="flex flex-col-reverse md:flex-row gap-4 h-fit">
          <div className="flex md:flex-col gap-4 w-full md:w-[152px]">
            {[product.img, product.img, product.img].map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`aspect-square bg-[#F0EEED] rounded-[20px] overflow-hidden border-2 transition-all cursor-pointer ${mainImage === img && index === 0 ? "border-black" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 bg-[#F0EEED] rounded-[20px] aspect-square overflow-hidden shadow-sm">
            <img
              src={mainImage || product.img}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-[32px] md:text-[48px] font-[1000] uppercase italic tracking-tighter leading-[0.9]">
              {product.name}
            </h1>
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-5 rounded-full border border-black/5 transition-all cursor-pointer shadow-xl ${isFavorite ? "bg-black text-white scale-110" : "bg-white text-black/10 hover:text-black"}`}
            >
              <Heart
                size={26}
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
                  size={22}
                  fill={i < Math.floor(product.rating) ? "#FFC633" : "none"}
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="text-sm font-black opacity-40">
              {product.rating}/5
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <span className="text-[32px] md:text-[40px] font-[1000] tracking-tighter italic">
              ${product.price}
            </span>
            {product.oldPrice && (
              <div className="flex items-center gap-3">
                <span className="text-[32px] font-black text-black/20 line-through tracking-tighter">
                  ${product.oldPrice}
                </span>
                <span className="bg-[#FF3333]/10 text-[#FF3333] px-4 py-1 rounded-full text-xs font-black uppercase italic tracking-widest">
                  -40%
                </span>
              </div>
            )}
          </div>
          <p className="text-black/50 text-[15px] leading-relaxed border-b border-black/5 pb-8 mt-4 font-medium max-w-[550px]">
            {product.description}
          </p>

          <div className="space-y-10 pt-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
                Select Visual Style
              </p>
              <div className="flex gap-4">
                {(product.colors || []).map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border border-black/5 flex items-center justify-center cursor-pointer transition-all ${selectedColor === color ? "ring-2 ring-black ring-offset-4 scale-110 shadow-lg" : ""}`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <Check
                        size={20}
                        className={
                          color.toLowerCase() === "#ffffff"
                            ? "text-black"
                            : "text-white"
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-b border-black/5 pb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
                Choose Identity Size
              </p>
              <div className="flex flex-wrap gap-3">
                {["Small", "Medium", "Large", "X-Large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${selectedSize === size ? "bg-black text-white shadow-2xl scale-105" : "bg-[#F0F0F0] text-black/40 hover:bg-black/5"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="flex items-center justify-between w-[140px] md:w-[180px] bg-[#F0F0F0] px-8 py-5 rounded-full font-black text-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="cursor-pointer hover:scale-125 transition-all border-none bg-transparent opacity-30 hover:opacity-100"
                >
                  <Minus size={20} />
                </button>
                <span className="tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="cursor-pointer hover:scale-125 transition-all border-none bg-transparent opacity-30 hover:opacity-100"
                >
                  <Plus size={20} />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                className="flex-1 py-5 bg-black text-white font-[1000] rounded-full uppercase italic tracking-widest text-sm shadow-2xl hover:scale-[1.02] transition-all border-none cursor-pointer"
              >
                Add to Vault
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="flex border-b border-black/5 mb-16 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-8 text-sm md:text-lg font-black uppercase tracking-widest border-b-2 transition-all min-w-[200px] cursor-pointer ${activeTab === tab ? "text-black border-black italic" : "text-black/20 border-transparent hover:text-black/40"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-[500px]">
          {activeTab === "Rating & Reviews" && (
            <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <h3 className="text-2xl md:text-3xl font-[1000] uppercase italic tracking-tighter">
                  Verified Experiences{" "}
                  <span className="text-black/20 text-lg not-italic ml-2 font-black uppercase">
                    (451)
                  </span>
                </h3>
                <div className="flex gap-4 w-full md:w-auto">
                  <button className="p-5 bg-[#F0F0F0] rounded-full hover:bg-black hover:text-white transition shadow-sm border-none cursor-pointer">
                    <SlidersHorizontal size={20} />
                  </button>
                  <button className="hidden md:flex flex-1 items-center justify-between gap-4 px-8 py-5 bg-[#F0F0F0] rounded-full font-black text-[10px] uppercase tracking-widest cursor-pointer border-none">
                    Latest <ChevronDown size={18} />
                  </button>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="flex-1 bg-black text-white px-10 py-5 rounded-full font-[1000] uppercase italic tracking-widest text-[11px] shadow-2xl hover:scale-105 transition border-none cursor-pointer"
                  >
                    Post Review
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    name: "SAMANTHA D.",
                    date: "MARCH 12, 2026",
                    text: "UNBELIEVABLE QUALITY. THE FIT IS EXACTLY WHAT I WAS LOOKING FOR. MODERN, BOXY AND PREMIUM FEEL.",
                  },
                  {
                    name: "ALEX M.",
                    date: "MARCH 10, 2026",
                    text: "THE COLOR DEPTH IS AMAZING. IT DIDN'T FADE AFTER THE FIRST WASH. ABSOLUTELY WORTH EVERY CENT.",
                  },
                  {
                    name: "ETHAN R.",
                    date: "MARCH 05, 2026",
                    text: "PERFECT FOR DAILY WEAR. MINIMALIST DESIGN BUT FEELS VERY HIGH-END. SHIPPED VERY FAST.",
                  },
                  {
                    name: "OLIVIA P.",
                    date: "FEBRUARY 28, 2026",
                    text: "THE HEAVYWEIGHT COTTON IS SURPRISINGLY BREATHABLE. DEFINITELY MY NEW FAVORITE BRAND.",
                  },
                ].map((review, i) => (
                  <div
                    key={i}
                    className="p-10 md:p-12 border border-black/5 rounded-[48px] space-y-6 bg-white shadow-sm hover:shadow-xl hover:border-black/10 transition-all text-left"
                  >
                    <div className="flex text-[#FFC633] gap-1">
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          size={18}
                          fill="#FFC633"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="font-[1000] text-2xl flex items-center gap-2 uppercase italic tracking-tighter">
                        {review.name}{" "}
                        <Check
                          size={18}
                          className="bg-green-500 text-white rounded-full p-0.5"
                        />
                      </p>
                      <p className="text-black/50 text-base font-bold leading-relaxed italic uppercase">
                        "{review.text}"
                      </p>
                    </div>
                    <p className="text-black/20 text-[10px] font-black uppercase tracking-[0.3em] pt-4">
                      ESTABLISHED {review.date}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-20">
                <button className="px-16 py-5 border-2 border-black/5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all cursor-pointer bg-white">
                  Load All Archives
                </button>
              </div>
            </div>
          )}

          {activeTab === "Product Details" && (
            <div className="grid md:grid-cols-2 gap-10 animate-in zoom-in-95 duration-500">
              <div className="bg-[#FBFBFB] p-12 rounded-[48px] border border-black/5 space-y-8">
                <h4 className="text-2xl font-[1000] uppercase italic tracking-tighter">
                  Identity Specs
                </h4>
                <div className="space-y-6">
                  {[
                    { l: "Identity Material", v: "100% ORGANIC COTTON" },
                    { l: "Fabric Weight", v: "280 GSM PREMIUM" },
                    { l: "Tailoring", v: "OVERSIZED BOXY FIT" },
                    { l: "Origin", v: "VAULT CRAFTED / IST" },
                  ].map((spec, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-black/[0.03] pb-4"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/30">
                        {spec.l}
                      </span>
                      <span className="text-[12px] font-black uppercase text-black">
                        {spec.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-black text-white p-12 rounded-[48px] flex flex-col justify-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <h4 className="text-4xl font-[1000] uppercase italic tracking-tighter leading-none">
                    Designed for <br />
                    The Elite.
                  </h4>
                  <p className="text-white/40 text-[13px] leading-loose uppercase font-bold tracking-widest">
                    Every stitch is a signature of quality. We don't follow
                    trends, we archive style.
                  </p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-48 text-left">
        <h2 className="text-[40px] md:text-[60px] font-[1000] uppercase italic text-center mb-24 tracking-tighter leading-none">
          Complete <br />
          The Uniform.
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-3xl p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[550px] rounded-[56px] p-12 md:p-16 relative animate-in zoom-in-95 shadow-2xl text-left border border-black/5">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-10 right-10 text-black/10 hover:text-black transition cursor-pointer border-none bg-transparent"
            >
              <X size={32} />
            </button>
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-[40px] font-[1000] uppercase italic tracking-tighter leading-none">
                  Post Review
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
                  Archive your experience.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-3 justify-center bg-[#FBFBFB] py-8 rounded-[32px] border border-black/5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewReview({ ...newReview, rating: s })}
                      className="bg-transparent border-none cursor-pointer transform hover:scale-125 transition-all"
                    >
                      <Star
                        size={40}
                        fill={s <= newReview.rating ? "#FFC633" : "none"}
                        color={s <= newReview.rating ? "#FFC633" : "#EAEAEA"}
                        strokeWidth={s <= newReview.rating ? 0 : 2}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">
                    Your Thoughts
                  </label>
                  <textarea
                    rows={5}
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        comment: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="DESCRIBE THE QUALITY, FIT AND STYLE..."
                    className="w-full bg-[#FBFBFB] rounded-[32px] p-8 outline-none font-black text-sm border border-black/5 focus:border-black transition-all resize-none text-black"
                  />
                </div>

                <Button
                  onClick={handlePostReview}
                  className="w-full py-6 uppercase font-[1000] italic rounded-full bg-black text-white tracking-[0.2em] text-xs shadow-2xl hover:scale-[1.02] transition-all border-none"
                >
                  Post to Archives
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
