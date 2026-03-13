import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#F2F0F1] overflow-hidden">
      <div className="max-w-[1440px] mx-auto md:h-[663px] flex flex-col md:flex-row items-center relative px-6 md:px-16">
        <div className="w-full md:w-1/2 z-20 pt-10 md:pt-0">
          <h1 className="text-[36px] md:text-[72px] font-[1000] leading-[1.1] md:leading-[76px] tracking-tighter uppercase text-black">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>

          <p className="mt-4 md:mt-6 text-black/60 text-[14px] md:text-[16px] max-w-[540px]">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-6 md:mt-8 w-full md:w-auto bg-black text-white px-12 py-4 rounded-full font-bold uppercase hover:bg-black/80 transition-all active:scale-95 shadow-lg"
          >
            Shop Now
          </button>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-6 mt-10 md:mt-14 pb-8">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-[24px] md:text-[36px] font-bold">200+</h3>
              <p className="text-black/50 text-[12px] md:text-sm">
                International Brands
              </p>
            </div>

            <div className="hidden xs:block md:hidden w-[1px] h-12 bg-black/10" />

            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-[24px] md:text-[36px] font-bold">2,000+</h3>
              <p className="text-black/50 text-[12px] md:text-sm">
                High-Quality Products
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col items-center md:items-start">
              <h3 className="text-[24px] md:text-[36px] font-bold">30,000+</h3>
              <p className="text-black/50 text-[12px] md:text-sm">
                Happy Customers
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative h-[420px] md:h-full flex items-end overflow-visible">
          <img
            src="/hero-model.png"
            alt="fashion models"
            className="absolute bottom-0 right-[-15%] h-[100%] scale-[1.15] md:right-0 md:h-[663px] md:scale-100 md:w-auto max-w-none origin-bottom transition-all duration-300"
          />
          <div className="absolute right-2 md:right-10 top-[12%] w-[56px] h-[56px] md:w-[104px] md:h-[104px] z-30">
            <svg viewBox="0 0 104 104" fill="black">
              <path d="M52 0C52 28.7 23.2 52 0 52C23.2 52 52 75.2 52 104C52 75.2 80.7 52 104 52C80.7 52 52 28.7 52 0Z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
