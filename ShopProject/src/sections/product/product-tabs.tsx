import { useState, useMemo } from "react";
import {
  Star,
  Check,
  ChevronDown,
  SlidersHorizontal,
  Info,
  HelpCircle,
} from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: string;
}

interface ProductTabsProps {
  product: Product | null;
  setIsReviewModalOpen: (isOpen: boolean) => void;
  reviews?: Review[];
}

export default function ProductTabs({
  product,
  setIsReviewModalOpen,
  reviews = [],
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("Rating & Reviews");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const sortedReviews = useMemo(() => {
    const list = Array.isArray(reviews) ? reviews : [];
    return [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [reviews]);

  return (
    <div className="mt-16 font-satoshi text-left max-w-[1240px] mx-auto px-4 md:px-0">
      <div className="flex border-b border-black/[0.08] mb-10">
        {["Product Details", "Rating & Reviews", "FAQs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 pb-6 text-[16px] md:text-[20px] transition-all border-b-2 tracking-tight cursor-pointer ${
              activeTab === tab
                ? "text-black border-black font-bold"
                : "text-black/20 border-transparent font-medium hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "Rating & Reviews" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] md:text-[24px] font-black tracking-tighter">
                  All Reviews
                </h3>
                <span className="text-black/30 text-sm font-bold">
                  ({reviews.length})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-11 h-11 flex items-center justify-center bg-[#F0F0F0] rounded-full border-none cursor-pointer hover:bg-black/5 transition-all text-black">
                  <SlidersHorizontal size={18} />
                </button>
                <div className="hidden md:flex items-center gap-4 bg-[#F0F0F0] px-5 py-3 rounded-full font-bold text-[14px] cursor-pointer text-black">
                  Latest <ChevronDown size={16} />
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-black text-white px-8 py-3 rounded-full font-black text-[12px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg border-none cursor-pointer"
                >
                  Write Review
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sortedReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-8 border border-black/[0.08] rounded-[24px] bg-white transition-all hover:shadow-xl relative group"
                >
                  <div className="flex text-[#FFC633] mb-4 scale-95 origin-left">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        size={16}
                        fill={s < review.rating ? "#FFC633" : "none"}
                        strokeWidth={s < review.rating ? 0 : 2}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-black text-[16px] md:text-[18px] tracking-tight text-black">
                      {review.name}
                    </span>
                    <div className="bg-green-500 rounded-full p-0.5 flex items-center justify-center">
                      <Check size={8} className="text-white" strokeWidth={5} />
                    </div>
                  </div>
                  <p className="text-black/60 text-[14px] md:text-[15px] leading-relaxed m-0 first-letter:capitalize">
                    "{review.comment.toLowerCase()}"
                  </p>
                  <p className="mt-6 text-[15px] text-black/70 tracking-[0.2em] border-t pt-5">
                    Posted on {review.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Product Details" && (
          <div className="animate-in fade-in duration-500 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-1">
                <h4 className="text-[18px] font-black tracking-tighter mb-6 flex items-center gap-3 text-black">
                  <Info size={20} className="text-black/20" /> Technical identity
                </h4>
                <div className="space-y-4">
                  <SpecRow
                    label="Fabric Blueprint"
                    value="100% GOTS Organic Cotton"
                  />
                  <SpecRow label="Weight Class" value="280 GSM Heavyweight" />
                  <SpecRow label="Silhouette" value="Boxy / Drop Shoulder" />
                  <SpecRow
                    label="Style Code"
                    value={`ARCH-${product?.id || "2026"}`}
                  />
                  <SpecRow label="Manufacturing" value="Premium Garment Dye" />
                </div>
              </div>
              <div className="bg-black text-white p-10 rounded-[32px] flex flex-col justify-center relative overflow-hidden shadow-2xl min-h-[280px]">
                <h4 className="text-3xl font-black tracking-tighter mb-4 text-white">
                  Vault Standard
                </h4>
                <p className="text-white/40 text-[12px] font-bold tracking-widest leading-loose">
                  Each stitch is a signature of our archive, engineered for a
                  lifetime of silhouette integrity. We don't follow trends.
                </p>
                <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12 bg-white/20 p-20 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "FAQs" && (
          <div className="animate-in fade-in duration-500 space-y-3 max-w-3xl">
            {[
              {
                q: "How should I maintain the garment's identity?",
                a: "To preserve the archive quality, wash cold (30°C) inside out with similar colors. Avoid tumble drying to maintain fabric density.",
              },
              {
                q: "Is the fit true to the size specification?",
                a: "The blueprint is designed for a boxy, oversized silhouette. Stay true to your size for the intended archive look, or size down for standard.",
              },
              {
                q: "Global shipping and vault delivery?",
                a: "Standard delivery takes 3-5 business days. Once your order is archived, you will receive a digital tracking code via email.",
              },
              {
                q: "What is your return policy for archives?",
                a: "We accept returns within 14 days of delivery, provided the security seal and original packaging are intact.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className={`border rounded-[20px] transition-all duration-300 cursor-pointer ${
                  openFaqIndex === i
                    ? "border-black bg-white shadow-xl"
                    : "border-black/5 bg-[#FBFBFB] hover:border-black/20"
                }`}
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              >
                <button className="w-full p-6 flex justify-between items-center bg-transparent border-none cursor-pointer">
                  <span className="text-[14px] md:text-[15px] font-black tracking-wide text-black text-left flex items-center gap-3">
                    <HelpCircle
                      size={18}
                      className={`transition-opacity ${
                        openFaqIndex === i ? "opacity-100" : "opacity-20"
                      }`}
                    />{" "}
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-500 ${
                      openFaqIndex === i ? "rotate-180 text-black" : "text-black/20"
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openFaqIndex === i ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-14 pb-8 text-[14px] text-black/50 font-medium border-l-2 border-black/10 ml-6 leading-relaxed">
                    "{faq.a}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-black/[0.04] pb-4 group hover:border-black transition-colors py-2">
      <span className="text-[11px] font-black text-black/30 tracking-[0.15em]">
        {label}
      </span>
      <span className="text-[14px] font-bold text-black">
        {value}
      </span>
    </div>
  );
}