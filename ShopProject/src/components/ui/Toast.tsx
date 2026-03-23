import { useCart } from "../../context/CartContext";
import { FiCheckCircle } from "react-icons/fi";

export default function Toast() {
  const { notification } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-10 duration-500">
      <div className="bg-white text-black px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 border border-white/10 min-w-[320px] justify-center">
        <FiCheckCircle className="text-[#01AB31]" size={20} strokeWidth={3} />
        <span className="text-sm font-black uppercase italic tracking-widest leading-none">
          {notification}
        </span>
      </div>
    </div>
  );
}
