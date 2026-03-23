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
  Heart,
  HelpCircle,
} from "lucide-react";
import { FiShield } from "react-icons/fi";
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
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [mainImage, setMainImage] = useState("");

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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setMainImage(product.img);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
    }
  }, [id, product]);

  if (!product)
    return (
      <div className="py-40 text-center font-black uppercase opacity-20 italic">
        Archive Entry Not Found
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
    setNotification("Vault review archived! ⭐");
    setIsReviewModalOpen(false);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 text-left font-satoshi text-black bg-vault-white min-h-screen">
      <nav className="flex items-center gap-2 text-[11px] text-black/30 mb-10 font-black uppercase tracking-[0.2em]">
        <Link to="/" className="hover:text-black transition no-underline">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-black transition no-underline">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-black italic">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-24">
        <div className="flex flex-col-reverse md:flex-row gap-4 h-fit">
          <div className="flex md:flex-col gap-4 w-full md:w-[120px]">
            {[product.img, product.img, product.img].map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`aspect-square bg-white rounded-[15px] overflow-hidden border-2 transition-all cursor-pointer ${mainImage === img ? "border-black" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white rounded-[20px] aspect-square overflow-hidden shadow-sm border border-black/[0.02]">
            <img src={mainImage || product.img} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col gap-4 text-left">
          <div className="flex justify-between items-start">
            <h1 className="text-[32px] md:text-[44px] font-[1000] uppercase italic tracking-tighter leading-tight m-0">
              {product.name}
            </h1>
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-4 rounded-full border border-black/5 transition-all shadow-xl cursor-pointer ${isFavorite ? "bg-black text-white" : "bg-white text-black/10 hover:text-black"}`}
            >
              <Heart size={22} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex text-[#FFC633]">
              {[...Array(5)].map((_, i) => (<Star key={i} size={18} fill={i < Math.floor(product.rating) ? "#FFC633" : "none"} strokeWidth={0} />))}
            </div>
            <span className="text-xs font-black opacity-30">{product.rating}/5</span>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <span className="text-[32px] md:text-[40px] font-[1000] tracking-tighter italic">${product.price}</span>
            {product.oldPrice && (
              <div className="flex items-center gap-3">
                <span className="text-[28px] font-black text-black/10 line-through tracking-tighter">${product.oldPrice}</span>
                <span className="bg-[#FF3333]/10 text-[#FF3333] px-3 py-1 rounded-full text-[10px] font-[1000] uppercase italic">
                  -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              </div>
            )}
          </div>

          <p className="text-black/50 text-sm leading-relaxed border-b border-black/5 pb-8 mt-2 max-w-[500px]">
            {product.description}
          </p>

          <div className="space-y-4 pt-4 text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Select Visual Identity</p>
            <div className="flex gap-3">
              {(product.colors || []).map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-9 h-9 rounded-full border border-black/5 flex items-center justify-center transition-all cursor-pointer ${color} ${selectedColor === color ? "ring-2 ring-black ring-offset-2 scale-110 shadow-lg" : ""}`}
                >
                  {selectedColor === color && (
                    <Check size={16} className={color.includes("white") ? "text-black" : "text-white"} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-b border-black/5 pb-10 pt-4 text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Choose Identity Size</p>
            <div className="flex flex-wrap gap-2">
              {(product.sizes || []).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-8 py-3 rounded-full text-[11px] font-[1000] uppercase tracking-widest transition-all cursor-pointer border-none ${selectedSize === size ? "bg-black text-white shadow-xl" : "bg-[#F0F0F0] text-black/40 hover:bg-black/5"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 text-left">
            <div className="flex items-center justify-between w-[130px] bg-[#F0F0F0] px-6 py-4 rounded-full font-black text-black">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="opacity-30 hover:opacity-100 transition-all border-none bg-transparent cursor-pointer"><Minus size={18} /></button>
              <span className="tabular-nums text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="opacity-30 hover:opacity-100 transition-all border-none bg-transparent cursor-pointer"><Plus size={18} /></button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="flex-1 py-4 bg-black text-white font-[1000] rounded-full uppercase italic tracking-widest text-[11px] shadow-2xl hover:scale-[1.01] transition-all border-none cursor-pointer"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-24 text-left">
        <div className="flex border-b border-black/5 mb-12 overflow-x-auto no-scrollbar text-left">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-6 text-sm font-black uppercase tracking-widest border-b-2 transition-all min-w-[150px] cursor-pointer ${activeTab === tab ? "text-black border-black italic" : "text-black/20 border-transparent hover:text-black/40"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === "Rating & Reviews" && (
            <div className="animate-fade-in-up text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 text-left">
                <h3 className="text-xl md:text-2xl font-[1000] uppercase italic tracking-tighter text-black">
                  Verified Experiences <span className="text-black/20 text-sm not-italic ml-2">(451)</span>
                </h3>
                <div className="flex gap-3">
                  <button className="p-4 bg-[#F0F0F0] rounded-full border-none cursor-pointer"><SlidersHorizontal size={18} /></button>
                  <button onClick={() => setIsReviewModalOpen(true)} className="bg-black text-white px-8 py-4 rounded-full font-[1000] uppercase italic tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all border-none cursor-pointer">Post Review</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="p-8 border border-black/5 rounded-[30px] space-y-4 bg-white hover:border-black/20 transition-all text-left">
                    <div className="flex text-[#FFC633] gap-1">{[...Array(5)].map((_, s) => (<Star key={s} size={14} fill="#FFC633" strokeWidth={0} />))}</div>
                    <p className="font-[1000] text-lg uppercase italic tracking-tighter flex items-center gap-2 m-0 text-black">SAMANTHA D. <Check size={14} className="bg-green-500 text-white rounded-full p-0.5" /></p>
                    <p className="text-black/50 text-[13px] font-medium leading-relaxed italic m-0">"THE QUALITY IS BEYOND ARCHIVE STANDARDS. PERFECT FIT."</p>
                    <p className="text-black/20 text-[9px] font-black uppercase tracking-widest pt-2 m-0 text-left">ESTABLISHED MARCH 12, 2026</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Product Details" && (
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up text-left">
               <div className="space-y-6 text-left">
                 <IdentitySpec label="Collection Identity" value="2026 ARCHIVE" />
                 <IdentitySpec label="Blueprint Material" value="100% ORGANIC COTTON" />
                 <IdentitySpec label="Weight Class" value="280 GSM PREMIUM" />
                 <IdentitySpec label="Style Specification" value={product.style?.toUpperCase() || "CASUAL"} />
               </div>
               <div className="bg-black text-white p-10 rounded-[35px] flex flex-col justify-center relative overflow-hidden shadow-2xl text-left">
                <h4 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-4 text-white">VAULT QUALITY</h4>
                <p className="text-white/40 text-[12px] uppercase font-bold tracking-widest leading-loose m-0 text-left">Every stitch is a signature of our archive. We don't follow trends.</p>
                <FiShield size={160} className="absolute -right-8 -bottom-8 opacity-5 rotate-12 text-white" />
              </div>
            </div>
          )}

          {activeTab === "FAQs" && (
            <div className="space-y-4 animate-fade-in-up text-left">
              {[{ q: "Wash guide?", a: "To maintain identity, wash cold and hang dry." }, { q: "Availability?", a: "Ready for immediate archive shipping." }].map((faq, i) => (
                <div key={i} className="p-8 border border-black/5 rounded-[25px] bg-[#FBFBFB] text-left group">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-3 text-black">
                    <HelpCircle size={16} className="opacity-20 group-hover:opacity-100 transition-opacity" /> {faq.q}
                  </h4>
                  <p className="text-[13px] text-black/50 font-medium italic m-0">"{faq.a}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-48 text-left">
        <h2 className="text-[32px] md:text-[50px] font-[1000] uppercase italic mb-20 tracking-tighter leading-none text-black text-center">You might also like</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {relatedProducts.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in-up text-left">
          <div className="bg-white w-full max-w-[500px] rounded-[45px] p-10 relative shadow-2xl border border-black/5 text-left">
            <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-8 right-8 text-black/20 border-none bg-transparent cursor-pointer hover:text-black transition-all"><X size={24} /></button>
            <div className="space-y-8 text-left">
              <div className="text-left">
                <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-1 text-black">Post Review</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-left">Archive your experience.</p>
              </div>
              <div className="flex gap-2 justify-center py-6 bg-[#FBFBFB] rounded-[25px] border border-black/5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })} className="bg-transparent border-none cursor-pointer transform hover:scale-125 transition-all outline-none">
                    <Star size={32} fill={s <= newReview.rating ? "#FFC633" : "none"} color={s <= newReview.rating ? "#FFC633" : "#EAEAEA"} strokeWidth={s <= newReview.rating ? 0 : 2} />
                  </button>
                ))}
              </div>
              <div className="space-y-3 text-left">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-2 text-black">Your Thoughts</label>
                <textarea rows={4} value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="DESCRIBE THE QUALITY..." className="w-full bg-[#FBFBFB] rounded-[25px] p-6 outline-none font-bold text-sm border border-black/5 focus:border-black transition-all resize-none uppercase text-black" />
              </div>
              <Button onClick={handlePostReview} className="w-full py-5 bg-black text-white font-[1000] rounded-full uppercase italic tracking-widest text-[10px] border-none cursor-pointer shadow-2xl">POST TO ARCHIVES</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IdentitySpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-black/[0.03] pb-3 text-left">
      <span className="text-[9px] font-black uppercase text-black/30 tracking-widest">{label}</span>
      <span className="text-[11px] font-black uppercase text-black">{value}</span>
    </div>
  );
}