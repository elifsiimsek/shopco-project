import { useState, useEffect } from "react";
import {
  Star,
  Check,
  HelpCircle,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { FiShield } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../types/product";

interface Review {
  id: string;
  name: string;
  email: string;
  date: string;
  comment: string;
  rating: number;
}

interface ProductTabsProps {
  product: Product;
  setIsReviewModalOpen: (val: boolean) => void;
}

export default function ProductTabs({
  product,
  setIsReviewModalOpen,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("Rating & Reviews");
  const { user } = useAuth();
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const tabs = ["Product Details", "Rating & Reviews", "FAQs"];

  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${product.id}`);
    if (savedReviews) {
      setProductReviews(JSON.parse(savedReviews));
    } else {
      const initialReviews: Review[] = [
        {
          id: "1",
          name: "SAMANTHA D.",
          email: "sam@example.com",
          date: "MARCH 12, 2026",
          comment: "THE QUALITY IS BEYOND ARCHIVE STANDARDS. PERFECT FIT.",
          rating: 5,
        },
        {
          id: "2",
          name: "ETHAN K.",
          email: "ethan@example.com",
          date: "FEBRUARY 28, 2026",
          comment:
            "FINALLY A BRAND THAT UNDERSTANDS SILHOUETTE. DEEP COLOR TONES.",
          rating: 5,
        },
        {
          id: "3",
          name: "OLIVIA M.",
          email: "olivia@example.com",
          date: "MARCH 02, 2026",
          comment:
            "THE FABRIC QUALITY IS AMAZING AND THE FIT IS PERFECT. I WILL DEFINITELY ORDER AGAIN.",
          rating: 4,
        },
        {
          id: "4",
          name: "JACOB L.",
          email: "jacob@example.com",
          date: "MARCH 05, 2026",
          comment:
            "FAST DELIVERY AND GREAT PACKAGING. THE COLORS LOOK EVEN BETTER IN REAL LIFE.",
          rating: 5,
        },
      ];
      setProductReviews(initialReviews);
      localStorage.setItem(
        `reviews_${product.id}`,
        JSON.stringify(initialReviews),
      );
    }
  }, [product.id]);

  const handleDeleteReview = (reviewId: string) => {
    const updated = productReviews.filter((r) => r.id !== reviewId);
    setProductReviews(updated);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
  };

  const faqs = [
    {
      q: "How should I maintain the garment's identity?",
      a: "To preserve the vault-grade quality, wash cold inside out and hang dry.",
    },
    {
      q: "Is this item part of a limited release?",
      a: "Correct. Every piece in the 2026 Archive is produced in strictly limited runs.",
    },
    {
      q: "What defines the Blueprint Material?",
      a: "It is a custom-engineered 280 GSM organic cotton, designed for a structured fit.",
    },
  ];

  return (
    <div className="mt-24">
      <div className="flex border-b border-black/5 mb-12 overflow-x-auto no-scrollbar">
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
          <div className="animate-in slide-in-from-bottom-4 duration-500 text-left">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
              <h3 className="text-xl md:text-2xl font-[1000] uppercase italic tracking-tighter text-black">
                Verified Experiences{" "}
                <span className="text-black/20 text-sm not-italic ml-2">
                  ({productReviews.length})
                </span>
              </h3>
              <div className="flex gap-3">
                <button className="p-4 bg-[#F0F0F0] rounded-full border-none cursor-pointer">
                  <SlidersHorizontal size={18} />
                </button>
                <button
                  onClick={() => {
                    if (!user) alert("Please login to post a review!");
                    else setIsReviewModalOpen(true);
                  }}
                  className="bg-black text-white px-8 py-4 rounded-full font-[1000] uppercase italic tracking-widest text-[10px] shadow-xl border-none cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-8 border border-black/5 rounded-[30px] space-y-4 bg-white text-left transition-all hover:border-black/20 relative group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex text-[#FFC633] gap-1">
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          size={14}
                          fill={s < review.rating ? "#FFC633" : "none"}
                          strokeWidth={s < review.rating ? 0 : 2}
                          color="#EAEAEA"
                        />
                      ))}
                    </div>
                    {user?.email === review.email && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-black/10 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <p className="font-[1000] text-lg uppercase italic tracking-tighter flex items-center gap-2 m-0 text-black">
                    {review.name}{" "}
                    <Check
                      size={14}
                      className="bg-green-500 text-white rounded-full p-0.5"
                    />
                  </p>
                  <p className="text-black/50 text-[13px] font-medium leading-relaxed italic m-0">
                    "{review.comment}"
                  </p>
                  <p className="text-black/20 text-[9px] font-black uppercase tracking-widest pt-2 m-0">
                    ESTABLISHED {review.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Product Details" && (
          <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500 text-left">
            <div className="space-y-6">
              <IdentitySpec label="Collection Identity" value="2026 ARCHIVE" />
              <IdentitySpec
                label="Blueprint Material"
                value="100% ORGANIC COTTON"
              />
              <IdentitySpec label="Weight Class" value="280 GSM PREMIUM" />
              <IdentitySpec
                label="Style Specification"
                value={product.style?.toUpperCase() || "CASUAL"}
              />
            </div>
            <div className="bg-black text-white p-10 rounded-[35px] flex flex-col justify-center relative overflow-hidden shadow-2xl">
              <h4 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-4 text-white">
                VAULT QUALITY
              </h4>
              <p className="text-white/40 text-[12px] uppercase font-bold tracking-widest leading-loose m-0">
                Every stitch is a signature of our archive. We don't follow
                trends.
              </p>
              <FiShield
                size={160}
                className="absolute -right-8 -bottom-8 opacity-5 rotate-12 text-white"
              />
            </div>
          </div>
        )}

        {activeTab === "FAQs" && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-400 text-left">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-8 border border-black/5 rounded-[25px] bg-[#FBFBFB] group hover:border-black/20 transition-all"
              >
                <h4 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-3 text-black">
                  <HelpCircle
                    size={18}
                    className="opacity-20 group-hover:opacity-100"
                  />{" "}
                  {faq.q}
                </h4>
                <p className="text-[13px] text-black/50 font-medium italic m-0 leading-relaxed">
                  "{faq.a}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IdentitySpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-black/[0.03] pb-3 text-left">
      <span className="text-[9px] font-black uppercase text-black/30 tracking-widest">
        {label}
      </span>
      <span className="text-[11px] font-black uppercase text-black">
        {value}
      </span>
    </div>
  );
}
