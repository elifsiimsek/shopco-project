import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; 

export default function TopBanner() {
  const { user } = useAuth(); 
  const [isVisible, setIsVisible] = useState(true);

  if (user || !isVisible) {
    return null;
  }

  return (
    <div className="bg-black text-white py-2.5 px-4 relative flex items-center justify-center w-full z-[9999] border-b border-white/10">
      <div className="flex items-center gap-2">
        <p className="text-[12px] md:text-sm font-normal">
          Sign up and get 20% off to your first order.
        </p>
        <Link
          to="/auth"
          className="text-[12px] md:text-sm font-bold underline underline-offset-4 hover:opacity-80 transition-all"
        >
          Sign Up Now
        </Link>
      </div>

      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 md:right-16 hidden md:block opacity-60 hover:opacity-100 transition-all cursor-pointer bg-transparent border-none text-white"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}