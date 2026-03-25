import { useRef } from "react";
import { Check, Star, ArrowLeft, ArrowRight } from "lucide-react";
import Title from "../../components/title";

interface Testimonial {
  id: number;
  name: string;
  text: string;
  verified: boolean;
}

const TESTIMONIALS: Testimonial[] = [
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
];

export default function HomeTestimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 768 ? 420 : clientWidth * 0.85;
      
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-white pt-24 pb-24 font-satoshi overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-16">
        
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4 text-left">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-black/30">
              <span className="w-8 h-[1px] bg-black/10"></span> Community
            </span>
            <Title title="Our Happy Customers" />
          </div>

          <div className="flex gap-4 mb-2">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-black/[0.06] flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500 active:scale-90"
            >
              <ArrowLeft size={22} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-black/[0.06] flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500 active:scale-90"
            >
              <ArrowRight size={22} />
            </button>
          </div>
        </div>

        <div className="relative -mx-4 md:-mx-16">
          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 md:px-16 pb-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ cursor: 'grab' }}
          >
            {TESTIMONIALS.map((t: Testimonial) => ( 
              <div
                key={t.id}
                className="min-w-[320px] md:min-w-[400px] border border-black/[0.04] rounded-[32px] p-8 md:p-10 flex flex-col gap-6 snap-start text-left bg-[#FBFBFB] transition-all duration-700 hover:bg-white hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.08)] group cursor-default"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="#FFC633"
                      className="text-[#FFC633]"
                      strokeWidth={0}
                    />
                  ))}
                </div>

                <p className="text-black/50 leading-relaxed text-[16px] md:text-[17px] font-medium italic group-hover:text-black transition-colors duration-500 m-0">
                  "{t.text}"
                </p>

                <div className="mt-auto flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center font-black text-[10px] text-black/40 group-hover:bg-black group-hover:text-white transition-all">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5 font-black text-[15px] uppercase tracking-tighter text-black">
                      {t.name}
                      {t.verified && (
                        <div className="bg-green-500 rounded-full p-0.5 flex items-center justify-center">
                          <Check size={8} className="text-white" strokeWidth={5} />
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
            <div className="min-w-[1px] pr-4 md:pr-16" />
          </div>
        </div>
      </div>
    </section>
  );
}