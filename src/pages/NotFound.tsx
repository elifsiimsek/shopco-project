import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag, FiZap, FiTarget } from "react-icons/fi";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-satoshi selection:bg-shopRed selection:text-white">
      <div className="max-w-[800px] w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-shopRed/5 blur-[120px] rounded-full scale-150" />

          <div className="relative flex items-center gap-2 md:gap-6">
            <div className="w-16 h-24 md:w-20 md:h-28 bg-shopBlack rounded-t-full flex items-end justify-center pb-4 rotate-[-12deg] shadow-2xl transition-transform hover:rotate-0 duration-500">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-darkRed rounded-full mb-2 animate-pulse shadow-[0_0_20px_rgba(139,0,0,0.4)]" />
            </div>

            <div className="bg-white border-[10px] border-shopBlack px-8 py-4 md:px-12 md:py-6 shadow-[15px_15px_0px_0px_#8B0000] -rotate-3 hover:rotate-0 transition-all duration-500 group">
              <h1 className="text-[80px] md:text-[120px] font-[1000] leading-none tracking-tighter m-0 italic text-shopBlack group-hover:scale-110 transition-transform">
                404
              </h1>
            </div>

            <div className="hidden md:flex w-20 h-20 bg-shopGray-light rounded-full items-center justify-center rotate-[15deg] border-2 border-shopBlack/5 shadow-sm hover:rotate-0 transition-transform">
              <FiTarget className="text-darkRed" size={32} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-block bg-darkRed text-white px-6 py-2 rounded-full text-[11px] font-[1000] uppercase tracking-[0.4em] italic shadow-lg animate-bounce-slow">
            System Error: Archive Not Found
          </div>

          <h2 className="text-[40px] md:text-[64px] font-[1000] uppercase italic leading-[0.9] tracking-tighter text-shopBlack">
            LOST IN THE <span className="text-darkRed">VAULT?</span>
          </h2>

          <p className="text-shopBlack/40 font-bold max-w-[450px] mx-auto text-sm md:text-base leading-relaxed">
            The coordinates you entered led to an empty vault. Redirect your
            terminal to our verified collections.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 pt-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-[500px]">
            <button
              onClick={() => navigate(-1)}
              className="group flex-1 px-8 py-5 bg-white border-4 border-shopBlack text-shopBlack rounded-full font-[1000] uppercase italic text-[12px] hover:bg-shopBlack hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex-1 px-8 py-5 bg-shopBlack text-white border-4 border-shopBlack rounded-full font-[1000] uppercase italic text-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-shopRed hover:border-shopRed transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Terminal <FiShoppingBag className="animate-bounce" />
            </button>
          </div>

          <div className="space-y-4 w-full">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-shopBlack/20 block">
              Quick Redirects
            </span>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/new-arrivals")}
                className="group px-6 py-3 bg-shopGray-light text-shopBlack text-[11px] font-[1000] uppercase rounded-full hover:bg-shopBlack hover:text-white transition-all border border-shopBlack/5 flex items-center gap-2"
              >
                <FiZap className="text-shopRed" /> New Arrivals
              </button>

              <button
                onClick={() => navigate("/on-sale")}
                className="group px-6 py-3 bg-shopGray-light text-shopBlack text-[11px] font-[1000] uppercase rounded-full hover:bg-shopBlack hover:text-white transition-all border border-shopBlack/5"
              >
                On Sale %
              </button>

              <button
                onClick={() => navigate("/brands")}
                className="group px-6 py-3 bg-shopGray-light text-shopBlack text-[11px] font-[1000] uppercase rounded-full hover:bg-shopBlack hover:text-white transition-all border border-shopBlack/5 flex items-center gap-2"
              >
                Brands <FiShoppingBag />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-[9px] font-black text-shopBlack/10 uppercase tracking-[0.6em]">
            ShopCo Terminal v3.0 // 404_NOT_FOUND
          </p>
        </div>
      </div>
    </div>
  );
};
