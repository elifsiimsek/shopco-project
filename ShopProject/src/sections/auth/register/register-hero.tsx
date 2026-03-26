import { FiGlobe, FiShield } from "react-icons/fi";

export default function RegisterHero() {
  return (
    <div className="hidden lg:flex w-1/2 bg-black p-16 flex-col justify-between relative text-left">
      <div className="absolute inset-0 opacity-10">
        <FiShield
          size={400}
          className="absolute -right-20 -bottom-20 text-white"
        />
      </div>
      <div className="relative z-10">
        <FiGlobe className="text-white/20 mb-4" size={32} />
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em]">
          Shop.co / Archive
        </p>
      </div>
      <div className="relative z-10">
        <h1 className="text-white text-[70px] font-[1000] uppercase italic tracking-tighter leading-[0.8] mb-8">
          Establish <br /> Global <br /> Identity.
        </h1>
      </div>
      <div className="bg-white/5 p-8 rounded-[30px] border border-white/10 backdrop-blur-md">
        <p className="text-white text-xs font-black uppercase tracking-widest mb-2">
          First Entry Bonus
        </p>
        <p className="text-white/40 text-[10px] uppercase leading-relaxed font-bold">
          Register today to unlock 25% voucher and vault-only archives.
        </p>
      </div>
    </div>
  );
}
