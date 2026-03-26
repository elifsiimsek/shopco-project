import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

export default function NavbarBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-black text-white py-2.5 px-6 relative flex items-center justify-center w-full min-h-[35px]">
      <p className="text-[12px] md:text-sm font-normal text-center m-0 tracking-tight">
        Sign up and get 20% off to your first order.{" "}
        <Link to="/register" className="font-bold underline text-white ml-1">
          Sign Up Now
        </Link>
      </p>
      <button
        onClick={onClose}
        className="absolute right-4 md:right-16 opacity-50 text-white bg-transparent border-none cursor-pointer flex items-center hover:opacity-100 transition-all"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}
