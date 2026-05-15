import { FiShield } from "react-icons/fi";

export default function LoginHero() {
  return (
    <div className="hidden lg:flex w-5/12 bg-black p-16 flex-col justify-between relative text-left">
      <div className="absolute inset-0 opacity-10">
        <FiShield
          size={350}
          className="absolute -right-10 -bottom-10 text-white"
        />
      </div>
      <div className="relative z-10 text-white">
        <FiShield className="text-white/20 mb-4" size={32} />
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em]">
          Shop.co / Identity
        </p>
      </div>
      <div className="relative z-10 text-white">
        <h1 className="text-white text-[70px] font-[1000] uppercase italic tracking-tighter leading-[0.8] mb-8">
          Access <br /> Your <br /> Vault.
        </h1>
      </div>
      <p className="text-white/10 text-[9px] font-black uppercase tracking-widest italic">
        Secure Access v5.3
      </p>
    </div>
  );
}
