import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import Button from "../../components/ui/Button";

export default function WishlistEmpty() {
  return (
    <div className="py-40 flex flex-col items-center justify-center text-center space-y-10 animate-fade-in-up">
      <div className="relative">
        <FiHeart size={100} className="text-black/[0.03]" />
        <FiHeart
          size={40}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/10 animate-ping"
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-[40px] font-[1000] uppercase italic tracking-tighter leading-none opacity-10">
          Your archive is empty
        </h2>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30">
          Start saving pieces you love
        </p>
      </div>
      <Link to="/shop">
        <Button className="px-16 py-6 bg-black text-white rounded-full font-[1000] uppercase italic tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all border-none cursor-pointer">
          Browse Collection
        </Button>
      </Link>
    </div>
  );
}
