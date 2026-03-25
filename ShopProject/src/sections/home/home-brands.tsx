import { useNavigate } from "react-router-dom";

export default function HomeBrands() {
  const navigate = useNavigate();

  const brandList = [
    {
      name: "VERSACE",
      style: { fontFamily: "Playfair Display, serif" },
      className: "tracking-[0.2em] text-[24px] md:text-[32px]",
    },
    {
      name: "ZARA",
      style: { fontFamily: "Playfair Display, serif" },
      className: "tracking-tight text-[26px] md:text-[34px]",
    },
    {
      name: "GUCCI",
      style: { fontFamily: "Playfair Display, serif" },
      className: "font-semibold tracking-wide text-[24px] md:text-[32px]",
    },
    {
      name: "PRADA",
      style: { fontFamily: "Montserrat, sans-serif" },
      className: "font-bold tracking-widest text-[22px] md:text-[28px]",
    },
    {
      name: "CALVIN KLEIN",
      style: { fontFamily: "Montserrat, sans-serif" },
      className: "font-light tracking-[0.4em] text-[18px] md:text-[24px]",
    },
  ];

  return (
    <section
      onClick={() => navigate("/brands")}
      className="bg-black py-8 md:py-12 overflow-hidden cursor-pointer group relative border-y border-white/5"
    >
      <div className="flex whitespace-nowrap animate-marquee-brands group-hover:[animation-play-state:paused]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-12 md:gap-24 px-6 md:px-12"
          >
            {brandList.map((brand, index) => (
              <span
                key={index}
                className={`text-white transition-opacity duration-300 group-hover:opacity-100 opacity-80 ${brand.className}`}
                style={brand.style}
              >
                {brand.name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}