type Props = {
  marqueeBrands: {
    name: string;
    className: string;
  }[];
};

const BrandsSelectedPartners = ({ marqueeBrands }: Props) => {
  return (
    <div className="bg-black py-3 md:py-4 overflow-hidden border-b border-white/5 group">
      <div className="flex whitespace-nowrap animate-marquee-slow group-hover:[animation-play-state:paused]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-12 md:gap-24 px-6 md:px-12"
          >
            {marqueeBrands.map((brand, index) => (
              <span
                key={index}
                className={`text-white/40 hover:text-white transition-colors duration-500 cursor-default font-serif ${brand.className}`}
              >
                {brand.name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsSelectedPartners;
