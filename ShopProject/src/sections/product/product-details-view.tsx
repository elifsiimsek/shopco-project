import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Star,
  Check,
  SlidersHorizontal,
  Trash2,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../hooks/useProducts";
import { productService } from "../../data/products";
import ImageGallery from "../../components/product/ImageGallery";
import ReviewModal from "./review-modal";
import ProductInfo from "./product-info";

import ProductDetailsTab from "./tabs/product-details";
import ProductFaqsTab from "./tabs/product-faqs";

interface Review {
  id: string;
  name: string;
  email: string;
  date: string;
  comment: string;
  rating: number;
}

interface ExtendedProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  img: string;
  category: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviews?: Review[];
}

export default function ProductDetailsView() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, setNotification } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const { product, loading } = useProducts(id) as {
    product: ExtendedProduct | null;
    loading: boolean;
  };

  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState("Rating & Reviews");
  const [sortOption, setSortOption] = useState("Latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const defaultReviews: Review[] = [
    {
      id: "1",
      name: "Samantha D.",
      email: "sam@vault.com",
      date: "AUGUST 14, 2023",
      rating: 5,
      comment:
        "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
    },
    {
      id: "2",
      name: "Alex M.",
      email: "alex@vault.com",
      date: "AUGUST 15, 2023",
      rating: 5,
      comment:
        "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
    },
    {
      id: "3",
      name: "Ethan R.",
      email: "ethan@vault.com",
      date: "AUGUST 16, 2023",
      rating: 4,
      comment:
        "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
    },
    {
      id: "4",
      name: "Olivia P.",
      email: "olivia@vault.com",
      date: "AUGUST 17, 2023",
      rating: 4,
      comment:
        "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.",
    },
    {
      id: "5",
      name: "Liam K.",
      email: "liam@vault.com",
      date: "AUGUST 18, 2023",
      rating: 5,
      comment:
        "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion.",
    },
    {
      id: "6",
      name: "Ava H.",
      email: "ava@vault.com",
      date: "AUGUST 19, 2023",
      rating: 5,
      comment:
        "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
    },
  ];

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      productService.getRelatedProducts(product.id);

      const saved = localStorage.getItem(`reviews_${product.id}`);
      if (saved) {
        setProductReviews(JSON.parse(saved) as Review[]);
      } else {
        setProductReviews(product.reviews || defaultReviews);
      }
    }
  }, [product, id]);

  const sortedReviews = useMemo(() => {
    const list = [...productReviews];
    if (sortOption === "Oldest")
      list.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    else
      list.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    return list;
  }, [productReviews, sortOption]);

  const handleWriteReviewClick = () => {
    if (!user) {
      setNotification("PLEASE LOGIN TO SHARE YOUR EXPERIENCE! 🔐");
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handlePostReview = () => {
    if (!user) return;
    const reviewData: Review = {
      id: `REV-${Date.now()}`,
      name: user.name,
      email: user.email,
      date: new Date()
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase(),
      comment: newReview.comment,
      rating: newReview.rating,
    };
    const updated = [reviewData, ...productReviews];
    setProductReviews(updated);
    if (product)
      localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
    setIsReviewModalOpen(false);
    setNewReview({ rating: 5, comment: "" });
  };

  const handleDeleteReview = (reviewId: string) => {
    const updated = productReviews.filter((r) => r.id !== reviewId);
    setProductReviews(updated);
    if (product)
      localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-black uppercase opacity-10 tracking-widest text-3xl">
        Syncing Vault...
      </div>
    );

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 bg-white min-h-screen font-satoshi text-left">
      <nav className="flex items-center gap-2 text-[10px] text-black/30 mb-10 font-black uppercase tracking-widest">
        <Link
          to="/"
          className="no-underline text-black/30 hover:text-black transition"
        >
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-black ">{product?.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
        <div className="lg:col-span-6">
          {product && (
            <ImageGallery images={[product.img, product.img, product.img]} />
          )}
        </div>
        <div className="lg:col-span-6">
          {product && (
            <ProductInfo
              product={product as unknown as ExtendedProduct}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={() =>
                addToCart({ ...product, selectedSize, selectedColor }, quantity)
              }
              onToggleWishlist={() =>
                toggleWishlist(product as unknown as ExtendedProduct)
              }
              isFavorite={isInWishlist(product.id)}
            />
          )}
        </div>
      </div>

      <div className="mt-24">
        <div className="flex border-b border-black/[0.08] mb-12 overflow-x-auto no-scrollbar">
          {["Product Details", "Rating & Reviews", "FAQs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-6 text-[16px] tracking-widest border-b-2 transition-all whitespace-nowrap px-8 ${activeTab === tab ? "text-black border-black font-black" : "text-black/20 border-transparent font-bold"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-[500px]">
          {activeTab === "Rating & Reviews" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black tracking-tighter text-black">
                    All Reviews
                  </h3>
                  <span className="text-black/20 font-bold">
                    ({productReviews.length})
                  </span>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end text-black font-bold">
                  <button className="p-3 bg-[#F0F0F0] rounded-full hover:bg-black/5 transition-all border-none cursor-pointer">
                    <SlidersHorizontal size={20} />
                  </button>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="flex items-center gap-4 bg-[#F0F0F0] px-6 py-3 rounded-full font-bold text-[14px] cursor-pointer border-none text-black"
                    >
                      {sortOption}{" "}
                      <ChevronDown
                        size={16}
                        className={isSortOpen ? "rotate-180" : ""}
                      />
                    </button>
                    {isSortOpen && (
                      <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-black/5 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 text-black font-black">
                        {["Latest", "Oldest"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setSortOption(opt);
                              setIsSortOpen(false);
                            }}
                            className="w-full text-left px-6 py-3 hover:bg-[#F0F0F0] font-bold text-sm border-none bg-white cursor-pointer transition-colors text-black"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleWriteReviewClick}
                    className="bg-black text-white px-8 py-3 rounded-full font-black text-[12px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all border-none cursor-pointer whitespace-nowrap tracking-widest"
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {sortedReviews.slice(0, visibleCount).map((review) => (
                  <div
                    key={review.id}
                    className="p-8 border border-black/[0.08] rounded-[32px] bg-[#FBFBFB] relative group hover:bg-white hover:shadow-xl transition-all h-full flex flex-col justify-between text-left"
                  >
                    <div>
                      <div className="absolute top-8 right-8 flex items-center gap-2">
                        {user?.email === review.email && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <MoreHorizontal
                          size={20}
                          className="text-black/10 group-hover:text-black cursor-pointer"
                        />
                      </div>
                      <div className="flex text-[#FFC633] mb-4 scale-110 origin-left">
                        {[...Array(5)].map((_, s) => (
                          <Star
                            key={s}
                            size={16}
                            fill={
                              s < Math.floor(review.rating) ? "#FFC633" : "none"
                            }
                            strokeWidth={s < Math.floor(review.rating) ? 0 : 2}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="font-black text-[18px] tracking-tighter text-black">
                          {review.name}
                        </span>
                        <div className="bg-green-500 rounded-full p-0.5 flex items-center justify-center shadow-sm">
                          <Check
                            size={8}
                            className="text-white"
                            strokeWidth={5}
                          />
                        </div>
                      </div>
                      <p className="text-black/50 text-[15px] leading-relaxed m-0 break-words">
                        "
                        {review.comment.charAt(0).toUpperCase() +
                          review.comment.slice(1).toLowerCase()}
                        "
                      </p>
                    </div>
                    <p className="mt-8 text-[11px] font-black text-black/20 tracking-widest border-t border-black/[0.03] pt-6 text-black">
                      Posted on {review.date}
                    </p>
                  </div>
                ))}
              </div>

              {visibleCount < sortedReviews.length && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 2)}
                    className="px-14 py-4 border border-black/10 rounded-full bg-white font-black tracking-widest text-[12px] hover:bg-black hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer text-black"
                  >
                    Load More Reviews
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "Product Details" && <ProductDetailsTab />}
          {activeTab === "FAQs" && <ProductFaqsTab />}
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        newReview={newReview}
        setNewReview={setNewReview}
        onPost={handlePostReview}
      />
    </div>
  );
}
