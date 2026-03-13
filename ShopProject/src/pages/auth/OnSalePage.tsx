import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/products";
import { FiClock } from "react-icons/fi";

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
    return products.filter((p) => {
      const productId = String(p.id).trim();
      return onSaleIds.includes(productId);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pb-40 font-satoshi text-left text-black overflow-x-hidden">
      <div className="py-4 bg-shopBlack overflow-hidden flex">
        <div className="flex whitespace-nowrap animate-marquee-infinite">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 mx-5 text-white">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">
                Flash Sale Live
              </span>
              <span className="w-1.5 h-1.5 bg-shopRed rounded-full"></span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-20 mt-20 text-left">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10 border-b border-shopGray-border pb-16">
          <div className="space-y-4 text-left animate-fade-in-up">
            <h1 className="text-[60px] md:text-[100px] font-[1000] uppercase tracking-tighter leading-[0.85] italic text-left text-black">
              Special <br />{" "}
              <span className="text-black/10 not-italic">Offers</span>
            </h1>
          </div>

          <div className="bg-shopBlack text-white p-8 rounded-[40px] flex flex-col gap-4 min-w-[300px] text-left animate-fade-in-up">
            <div className="flex items-center gap-2 text-shopRed justify-start">
              <FiClock size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                Limited Time:
              </span>
            </div>
            <div className="flex gap-4 font-[1000] text-4xl italic tabular-nums justify-start text-left text-white leading-none">
              <span>
                {timeLeft.hrs < 10 ? `0${timeLeft.hrs}` : timeLeft.hrs}
              </span>
              :
              <span>
                {timeLeft.min < 10 ? `0${timeLeft.min}` : timeLeft.min}
              </span>
              :
              <span className="text-shopRed">
                {timeLeft.sec < 10 ? `0${timeLeft.sec}` : timeLeft.sec}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
          {saleProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="group no-underline text-left flex flex-col items-start animate-fade-in-up"
            >
              <div className="relative aspect-[3/4] w-full bg-shopGray-muted rounded-[40px] overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all">
                <div className="absolute top-5 left-5 z-20">
                  <span className="bg-shopRed text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter animate-bounce inline-block">
                    {product.discount || "-25%"}
                  </span>
                </div>
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                />
              </div>
              <div className="space-y-2 px-2 text-left items-start flex flex-col">
                <h3 className="font-black text-lg uppercase tracking-tighter italic text-black group-hover:text-shopRed transition-colors leading-none text-left">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 justify-start text-left">
                  <span className="font-[1000] text-2xl tracking-tighter text-black leading-none">
                    ${product.price}
                  </span>
                  <span className="text-black/20 line-through text-sm font-bold italic leading-none">
                    ${product.oldPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
