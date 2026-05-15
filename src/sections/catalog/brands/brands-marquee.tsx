const marqueeList = [
  { name: "VERSACE", className: "tracking-[0.3em]" },
  { name: "ZARA", className: "tracking-tight" },
  { name: "GUCCI", className: "font-semibold tracking-wide" },
  { name: "PRADA", className: "font-bold tracking-widest" },
  { name: "CALVIN KLEIN", className: "font-light tracking-[0.4em]" },
];

export default function BrandsMarquee() {
  return (
    <div className="bg-black py-4 overflow-hidden border-b border-white/5 group">
      <div className="flex whitespace-nowrap animate-marquee-slow group-hover:[animation-play-state:paused]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-12 md:gap-24 px-6 md:px-12"
          >
            {marqueeList.map((brand, index) => (
              <span
                key={index}
                className={`text-white/40 hover:text-white transition-colors duration-500 cursor-default font-serif text-[12px] md:text-[14px] ${brand.className}`}
              >
                {brand.name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
