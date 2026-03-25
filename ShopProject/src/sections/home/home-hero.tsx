import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AnimatedNumber = ({ value, duration = 800 }: { value: string; duration?: number; }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[,+]/g, ""));

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{count.toLocaleString()}+</span>;
};

export default function HomeHero() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#F2F0F1] overflow-hidden">
      <div className="max-w-[1440px] mx-auto md:h-[663px] flex flex-col md:flex-row items-center relative px-6 md:px-16">
        <div className="w-full md:w-1/2 z-20 pt-10 md:pt-0 animate-fade-in-up">
          <h1 className="text-[36px] md:text-[72px] font-[1000] leading-[1.1] md:leading-[76px] tracking-tighter uppercase text-black">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>

          <p className="mt-4 md:mt-6 text-black/60 text-[14px] md:text-[16px] max-w-[540px]">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of style.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-6 md:mt-8 w-full md:w-auto bg-black text-white px-12 py-4 rounded-full font-bold uppercase hover:bg-black/80 transition-all active:scale-95 shadow-lg"
          >
            Shop Now
          </button>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-6 mt-10 md:mt-14 pb-8 text-black">
            <StatItem value="200" label="International Brands" />
            <div className="hidden md:block w-[1px] h-12 bg-black/10" />
            <StatItem value="2000" label="High-Quality Products" />
            <div className="hidden md:block w-[1px] h-12 bg-black/10" />
            <StatItem value="30000" label="Happy Customers" />
          </div>
        </div>

        <div className="w-full md:w-1/2 relative h-[420px] md:h-full flex items-end overflow-visible">
          <img
            src="/hero-model.png"
            alt="fashion models"
            className="absolute bottom-0 right-[-15%] h-[100%] scale-[1.15] md:right-0 md:h-[663px] md:scale-100 md:w-auto max-w-none origin-bottom transition-all duration-700"
          />
          <div className="absolute right-2 md:right-10 top-[12%] w-[56px] h-[56px] md:w-[104px] md:h-[104px] z-30 animate-pulse transition-opacity duration-1000">
             <StarIcon />
          </div>
          <div className="absolute left-4 md:left-0 top-[40%] w-[32px] h-[32px] md:w-[56px] md:h-[56px] z-30 animate-pulse delay-700">
             <StarIcon />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <h3 className="text-[24px] md:text-[36px] font-bold">
        <AnimatedNumber value={value} />
      </h3>
      <p className="text-black/50 text-[12px] md:text-sm">{label}</p>
    </div>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 104 104" fill="black">
      <path d="M52 0C52 28.7 23.2 52 0 52C23.2 52 52 75.2 52 104C52 75.2 80.7 52 104 52C80.7 52 52 28.7 52 0Z" />
    </svg>
  );
}