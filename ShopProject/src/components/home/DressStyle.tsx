import { useNavigate } from "react-router-dom";
import Title from "../title";

export default function DressStyle() {
  const navigate = useNavigate();

  const styles = [
    {
      title: "Casual",
      desc: "Everyday comfort with a modern edge.",
      image: "products/casual.png",
      gridSpan: "md:col-span-1 col-span-3",
    },
    {
      title: "Formal",
      desc: "Sharp silhouettes for professional excellence.",
      image: "products/formal.png",
      gridSpan: "md:col-span-2 col-span-3",
    },
    {
      title: "Party",
      desc: "Bold designs that own the night.",
      image: "products/party.png",
      gridSpan: "md:col-span-2 col-span-3",
    },
    {
      title: "Gym",
      desc: "High-performance wear for your peak.",
      image: "products/gym.png",
      gridSpan: "md:col-span-1 col-span-3",
    },
  ];

  const handleStyleClick = (title: string) => {
    navigate(`/shop?style=${title}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-10 text-black font-satoshi">
      <div className="bg-[#F0F0F0] rounded-[40px] p-6 md:p-16">
        <Title title="BROWSE BY DRESS STYLE" />

        <div className="grid grid-cols-3 gap-5">
          {styles.map((style, index) => (
            <div
              key={index}
              onClick={() => handleStyleClick(style.title)}
              className={`relative h-[190px] md:h-[289px] bg-white rounded-[20px] overflow-hidden cursor-pointer group transition-all duration-500 ${style.gridSpan}`}
            >
              <div className="absolute top-6 left-6 md:top-8 md:left-10 z-20 transition-all duration-500 group-hover:-translate-y-2">
                <h3 className="text-[24px] md:text-[36px] font-black leading-none uppercase tracking-tighter transition-all duration-500 group-hover:text-white">
                  {style.title}
                </h3>
                <p className="mt-2 text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-white/0 group-hover:text-white/70 transition-all duration-500 leading-relaxed max-w-[180px]">
                  {style.desc}
                </p>
              </div>

              <img
                src={style.image}
                alt={style.title}
                className="w-full h-full object-cover object-center md:object-right-top transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
