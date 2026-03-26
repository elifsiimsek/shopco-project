import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setNotification } = useCart();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("IDENTIFIER AND KEY REQUIRED");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (login(email, password)) {
        setNotification(`Welcome back to the Vault. 👋`);
        window.location.href = "/account";
      } else {
        setError("INVALID CREDENTIALS: ACCESS DENIED");
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-[#F6F6F6] font-satoshi text-black p-4 md:p-10">
      <div className="max-w-[1100px] mx-auto w-full flex bg-white rounded-[50px] overflow-hidden shadow-2xl border border-black/5">
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
              Access
              <br />
              Your
              <br />
              Vault.
            </h1>
          </div>
          <p className="text-white/10 text-[9px] font-black uppercase tracking-widest italic">
            Secure Access v5.3
          </p>
        </div>

        <div className="w-full lg:w-7/12 p-8 md:p-20 flex flex-col justify-center text-left">
          <div className="max-w-[400px] mx-auto w-full space-y-12 py-10">
            <h2 className="text-[44px] font-[1000] uppercase italic tracking-tighter leading-none">
              Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-10">
              {error && (
                <div className="bg-red-500/10 p-4 rounded-2xl flex items-center gap-3 text-red-600 border border-red-500/20">
                  <FiAlertCircle size={18} />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {error}
                  </p>
                </div>
              )}
              <div className="relative group text-left">
                <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-1 block">
                  Identifier
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="STYLE@SHOPCO.COM"
                    className="w-full py-4 bg-transparent border-b-2 border-black/5 outline-none font-bold text-base focus:border-black transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FiMail
                    size={18}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-black/10 transition-colors"
                  />
                </div>
              </div>
              <div className="relative group text-left">
                <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-1 block">
                  Security Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full py-4 bg-transparent border-b-2 border-black/5 outline-none font-bold text-base focus:border-black transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-black/20 hover:text-black bg-transparent border-none cursor-pointer transition-all"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-10 flex flex-col gap-8">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-black text-white rounded-full font-[1000] uppercase italic tracking-widest text-[11px] shadow-2xl border-none cursor-pointer"
                >
                  {isLoading ? "VALIDATING..." : "Access Vault"}{" "}
                  <FiArrowRight className="ml-2" />
                </Button>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/30 text-center">
                  New?{" "}
                  <Link
                    to="/register"
                    className="text-black font-black ml-2 underline underline-offset-4"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
