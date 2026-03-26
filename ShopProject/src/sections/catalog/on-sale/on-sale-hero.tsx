import { useState, useEffect } from "react";
import { FiMinus, FiClock } from "react-icons/fi";

export default function OnSaleHero() {
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

  return (
    <div className="px-6 md:px-20 mt-20">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12 border-b border-black/5 pb-16">
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-4">
            <span className="flex h-2 w-2 rounded-full bg-vault-red animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">
              Sale Live
            </span>
            <FiMinus className="text-black/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">
              Limited
            </span>
          </div>
          <h1 className="text-[55px] md:text-[110px] font-[1000] uppercase tracking-[-0.06em] leading-[0.8] italic text-black m-0">
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
            <TimeUnit value={timeLeft.hrs} label="Hours" />
            <span className="text-3xl opacity-10">:</span>
            <TimeUnit value={timeLeft.min} label="Mins" />
            <span className="text-3xl opacity-10">:</span>
            <TimeUnit value={timeLeft.sec} label="Secs" isRed />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({
  value,
  label,
  isRed,
}: {
  value: number;
  label: string;
  isRed?: boolean;
}) {
  return (
    <div className={`flex flex-col ${isRed ? "text-red-600" : ""}`}>
      <span className="text-5xl tabular-nums italic">
        {value < 10 ? `0${value}` : value}
      </span>
      <span className="text-[8px] opacity-30 mt-2 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
