import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_DATA = [
  { q: "How to maintain archive quality?", a: "Wash cold (30°C) inside out and hang dry to preserve print density and fabric integrity." },
  { q: "Global vault shipping?", a: "Standard delivery takes 3-5 business days across all regions with digital tracking." },
  { q: "Is the fit true to specification?", a: "The blueprint is designed for a boxy, oversized silhouette. Stay true to your size for the intended look." }
];

export default function ProductFaqsTab() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 w-full max-w-4xl">
      {FAQ_DATA.map((faq, i) => (
        <div 
          key={i} 
          className={`border rounded-[30px] transition-all cursor-pointer ${openIndex === i ? "border-black bg-white shadow-xl" : "border-black/5 bg-[#FBFBFB]"}`}
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
        >
          <div className="p-8 flex justify-between items-center">
            <p className="font-black text-[16px] flex items-center gap-3 m-0">
              <HelpCircle size={18} className="opacity-20" /> {faq.q}
            </p>
            <ChevronDown size={18} className={`transition-transform duration-300 ${openIndex === i ? "rotate-180" : "opacity-30"}`} />
          </div>
          {openIndex === i && (
            <p className="px-20 pb-8 text-black/40 text-[14px]  border-l-4 border-black/10 ml-8 leading-relaxed">
              "{faq.a}"
            </p>
          )}
        </div>
      ))}
    </div>
  );
}