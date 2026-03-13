import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMail,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { setNotification } = useCart();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[ğüşıöçĞÜŞİÖÇ\s]/g, "").toLowerCase();
    setEmail(val);
    if (emailError) setEmailError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email (e.g. .com)");
      return;
    }

    setIsLoading(true);

    const userName = email.split("@")[0];
    const capitalizedName =
      userName.charAt(0).toUpperCase() + userName.slice(1);

    setTimeout(() => {
      login({
        name: capitalizedName,
        email: email,
        birthDate: "",
      });

      setNotification(`Welcome back, ${capitalizedName}! 👋`);

      navigate(from, { replace: true });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-white font-satoshi text-black overflow-hidden relative text-left">
      <div className="hidden lg:flex w-5/12 bg-black p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border border-white/10 rounded-full" />
        </div>
        <div className="relative z-10 text-left">
          <FiShield className="text-white/20 mb-4" size={32} />
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em]">
            Shop.co / Identity
          </p>
        </div>
        <div className="relative z-10 text-left">
          <h1 className="text-white text-[80px] font-[1000] uppercase italic tracking-tighter leading-[0.75] mb-8">
            Access
            <br />
            Your
            <br />
            Vault.
          </h1>
        </div>
        <p className="relative z-10 text-white/10 text-[9px] font-black uppercase tracking-widest italic">
          Secure Access v5.3
        </p>
      </div>

      <div className="w-full lg:w-7/12 p-8 md:p-20 flex flex-col justify-center bg-[#FBFBFB] relative text-left">
        <div className="max-w-[450px] mx-auto w-full space-y-12 py-10">
          <h2 className="text-[44px] font-[1000] uppercase italic tracking-tighter leading-none text-black">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-12">
            <div className="relative group text-left">
              <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-2 block">
                Identifier
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@shopco.com"
                  className={`w-full py-4 bg-transparent border-b-2 outline-none font-bold text-base transition-all ${emailError ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
                  value={email}
                  onChange={handleEmailChange}
                />
                <FiMail
                  size={18}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${emailError ? "text-red-500" : "text-black/10"}`}
                />
              </div>
              {emailError && (
                <p className="absolute -bottom-5 text-[10px] font-bold text-red-600 italic tracking-tight">
                  {emailError}
                </p>
              )}
            </div>

            <div className="relative group text-left">
              <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-2 block">
                Security Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full py-3 bg-transparent border-b-2 border-black/5 outline-none font-bold text-base focus:border-black text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-black/20 hover:text-black"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-black/5">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-16 py-5 bg-black text-white rounded-full font-[1000] uppercase tracking-widest text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                {isLoading ? "Process..." : "Log İn"} <FiArrowRight />
              </Button>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/30">
                New?{" "}
                <Link
                  to="/register"
                  className="text-black underline underline-offset-8 ml-2 font-black"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
