import { useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import { Check, Star, ArrowLeft, ArrowRight } from "lucide-react";
import Title from "../../components/title";

import "swiper/css";

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
  const swiperRef = useRef<SwiperRef>(null);

  const handlePrev = useCallback(() => {
    swiperRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.swiper.slideNext();
  }, []);

  return (
    <section className="w-full bg-white pt-20 pb-28 font-satoshi selection:bg-black selection:text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-left relative">
        <div className="flex justify-between items-end mb-10 md:mb-12">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <Title title="OUR HAPPY CUSTOMERS" />
          </div>

          <div className="flex gap-3 md:gap-4 items-center mb-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-black border-none bg-transparent hover:scale-110 transition-transform active:scale-90 cursor-pointer z-50"
            >
              <ArrowLeft size={28} strokeWidth={2} />
            </button>
            <button
              onClick={() => handleNext()}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-black border-none bg-transparent hover:scale-110 transition-transform active:scale-90 cursor-pointer z-50"
            >
              <ArrowRight size={28} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={"auto"}
            loop={true}
            centeredSlides={false}
            initialSlide={0}
            speed={800}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="!overflow-visible cursor-grab active:cursor-grabbing"
          >
            {TESTIMONIALS.map((t) => (
              <SwiperSlide
                key={t.id}
                className="!w-[340px] md:!w-[400px] !h-auto"
              >
                <div className="border border-black/[0.1] rounded-[24px] md:rounded-[32px] p-7 md:p-9 flex flex-col gap-5 text-left bg-white transition-all duration-500 hover:border-black/20 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] h-full min-h-[240px]">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill="#FFC633"
                        className="text-[#FFC633]"
                        strokeWidth={0}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-[1000] text-[18px] md:text-[22px] tracking-tighter text-black">
                      {t.name}
                    </span>
                    {t.verified && (
                      <div className="w-5 h-5 bg-[#01AB31] rounded-full flex items-center justify-center shadow-sm">
                        <Check
                          size={12}
                          className="text-white"
                          strokeWidth={4}
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-black/60 leading-relaxed text-[15px] md:text-[16px] font-medium m-0">
                    "{t.text}"
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-0 right-[-100px] h-full w-[250px] md:w-[450px] bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-40 hidden md:block" />
        </div>
      </div>
    </section>
  );
}
