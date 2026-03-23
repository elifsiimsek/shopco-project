import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/products";
import { FiMinus, FiClock } from "react-icons/fi";

export default function OnSalePage() {
  const [timeLeft, setTimeLeft] = useState({ hrs: 24, min: 0, sec: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeLeft({
        hrs: 23 - now.getHours(),
        min: 59 - now.getMinutes(),
        sec: 59 - now.getSeconds(),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const saleProducts = useMemo(() => {
    const onSaleIds = ["2", "4", "5", "7", "11", "12", "13"];
    return products.filter((p) => onSaleIds.includes(String(p.id)));
  }, []);

  return (
    <div className="min-h-screen bg-white pb-40 font-satoshi text-left text-black">
      <div className="py-3 bg-black overflow-hidden flex">
        <div className="flex whitespace-nowrap animate-marquee-fixed">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 mx-5 text-white">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">
                Flash Sale Live
              </span>
              <span className="w-1.5 h-1.5 bg-vault-red rounded-full"></span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-20 mt-20">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12 border-b border-black/5 pb-16">
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4">
              <span className="flex h-2 w-2 rounded-full bg-vault-red animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 leading-none">
                Sale Live
              </span>
              <FiMinus className="text-black/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 leading-none">
                Limited
              </span>
            </div>
            <h1 className="text-[55px] md:text-[110px] font-[1000] uppercase tracking-[-0.06em] leading-[0.8] italic text-black">
              Final <br />
              <span className="text-black/5 not-italic font-serif font-light lowercase">
                reductions
              </span>
            </h1>
          </div>

          <div className="bg-white border border-black/10 p-8 rounded-[40px] flex flex-col gap-6 min-w-[320px] shadow-sm self-start">
            <div className="flex items-center gap-3 text-red-500">
              <FiClock size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Ends In:
              </span>
            </div>
            <div className="flex gap-6 items-baseline font-black text-black">
              <div className="flex flex-col">
                <span className="text-5xl tabular-nums italic">
                  {timeLeft.hrs < 10 ? `0${timeLeft.hrs}` : timeLeft.hrs}
                </span>
                <span className="text-[8px] opacity-30 mt-2 uppercase">
                  Hours
                </span>
              </div>
              <span className="text-3xl opacity-10">:</span>
              <div className="flex flex-col">
                <span className="text-5xl tabular-nums italic">
                  {timeLeft.min < 10 ? `0${timeLeft.min}` : timeLeft.min}
                </span>
                <span className="text-[8px] opacity-30 mt-2 uppercase">
                  Mins
                </span>
              </div>
              <span className="text-3xl opacity-10">:</span>
              <div className="flex flex-col text-red-600">
                <span className="text-5xl tabular-nums italic">
                  {timeLeft.sec < 10 ? `0${timeLeft.sec}` : timeLeft.sec}
                </span>
                <span className="text-[8px] opacity-50 mt-2 uppercase">
                  Secs
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24">
          {saleProducts.map((product, index) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className={`group relative flex flex-col no-underline ${index % 2 !== 0 ? "lg:translate-y-20" : ""}`}
            >
              <div className="relative aspect-[3/4] bg-[#F8F8F8] rounded-[48px] overflow-hidden mb-6">
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-vault-red text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase">
                    {product.discount || "-20%"}
                  </span>
                </div>
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                />
              </div>
              <div className="text-left flex flex-col items-start px-2">
                <h3 className="font-black text-[18px] text-black uppercase italic group-hover:text-red-600">
                  {product.name}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-black text-[26px] text-black">
                    ${product.price}
                  </span>
                  <span className="text-black/10 line-through text-[16px] font-black italic">
                    ${product.oldPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes marquee-fixed { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee-fixed { animation: marquee-fixed 25s linear infinite; }`,
        }}
      />
    </div>
  );
}
