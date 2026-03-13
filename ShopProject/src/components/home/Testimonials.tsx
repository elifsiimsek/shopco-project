import { useRef } from "react";
import { Check, Star, ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece has exceeded my expectations.",
    verified: true,
  },
  {
    id: 2,
    name: "Alex K.",
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.",
    verified: true,
  },
  {
    id: 3,
    name: "James L.",
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is on-point and diverse.",
    verified: true,
  },
  {
    id: 4,
    name: "Mooen H.",
    text: "The selection of clothes is not only diverse but also on-point with the latest trends. I'm highly impressed with the fast delivery and service!",
    verified: true,
  },
  {
    id: 5,
    name: "Samantha D.",
    text: "Finally a brand that gets it! The minimalist design and the premium feel of the organic cotton t-shirts are exactly what I've been searching for.",
    verified: true,
  },
  {
    id: 6,
    name: "Michael B.",
    text: "The quality of the fabric is just next level. I was worried about the fit, but the size guide was incredibly accurate. This is now my go-to fashion spot!",
    verified: true,
  },
  {
    id: 7,
    name: "Emily R.",
    text: "Absolutely love the packaging and the attention to detail. It feels like a luxury experience from the moment you open the box.",
    verified: true,
  },
  {
    id: 8,
    name: "David W.",
    text: "Best customer service I've experienced in a long time. They helped me pick the right size and it fits like a glove. Highly recommended!",
    verified: true,
  },
  {
    id: 9,
    name: "Olivia P.",
    text: "The prices are unbeatable for this level of quality. I've already recommended Shop.co to all my friends. Keep up the amazing work!",
    verified: true,
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 768 ? 450 : clientWidth * 0.85;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-white pt-24 pb-24 font-satoshi overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-16">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-black/30">
              <span className="w-8 h-[1px] bg-black/10"></span> Community
            </span>
            <h2 className="text-[44px] md:text-[64px] font-[1000] uppercase tracking-[-0.06em] leading-[0.85] text-left">
              Our Happy Customers
            </h2>
          </div>

          <div className="flex gap-4 mb-2">
            <button
              onClick={() => scroll("left")}
              className="w-14 h-14 rounded-full border border-black/[0.06] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all duration-300 active:scale-90 shadow-sm"
            >
              <ArrowLeft size={22} strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-14 h-14 rounded-full border border-black/[0.06] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all duration-300 active:scale-90 shadow-sm"
            >
              <ArrowRight size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute inset-0 z-20 pointer-events-none hidden md:block"
            style={{
              background:
                "linear-gradient(to right, white 0%, rgba(255,255,255,0) 15%, rgba(255,255,255,0) 85%, white 100%)",
            }}
          />

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-12 px-2"
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="min-w-[320px] md:min-w-[420px] border border-black/[0.04] rounded-[32px] p-10 flex flex-col gap-6 snap-center text-left bg-[#FBFBFB] transition-all duration-700 hover:bg-white hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.08)] hover:border-black/5 group cursor-default"
              >
                <div className="flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="#FFC633"
                      color="#FFC633"
                      strokeWidth={0}
                    />
                  ))}
                </div>

                <p className="text-black/50 leading-relaxed text-[16px] md:text-[17px] font-medium italic group-hover:text-black transition-colors duration-500">
                  "{t.text}"
                </p>

                <div className="mt-auto flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center font-black text-[10px] text-black/40 group-hover:bg-black group-hover:text-white transition-all">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-black text-[15px] uppercase tracking-tighter">
                      {t.name}
                      {t.verified && (
                        <div className="bg-[#01AB31] rounded-full p-0.5">
                          <Check size={8} color="white" strokeWidth={6} />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-black text-black/20 uppercase tracking-[0.2em]">
                      Verified Buyer
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `,
        }}
      />
    </section>
  );
}
