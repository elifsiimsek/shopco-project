import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  birthDate?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { setNotification } = useCart();
  const { register } = useAuth();

  const passwordChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };
  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = "IDENTITY REQUIRED";
    if (!emailRegex.test(formData.email))
      newErrors.email = "INVALID ACCESS MAIL";

    const birthYear = new Date(formData.birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (!formData.birthDate) {
      newErrors.birthDate = "DATE REQUIRED";
    } else if (currentYear - birthYear < 18) {
      newErrors.birthDate = "ACCESS DENIED: 18+ ONLY 🔞";
    } else if (birthYear < 1920 || birthYear > currentYear) {
      newErrors.birthDate = "INVALID YEAR SPECIFICATION";
    }

    if (strengthScore < 4) newErrors.password = "SECURITY PROTOCOL WEAK";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "CODES MISMATCH";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setTimeout(() => {
      register({
        name: formData.fullName.toUpperCase(),
        email: formData.email,
        password: formData.password,
        birthDate: formData.birthDate,
        addresses: [],
        savedCards: [],
        orders: [],
        favorites: [],
        hasWelcomeCoupon: true,
      });
      setNotification(`WELCOME TO THE VAULT! 🧧 USE CODE: VAULT-WELCOME-25`);
      setIsLoading(false);
      window.location.href = "/account";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-[#F6F6F6] font-satoshi text-black p-4 md:p-10">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row bg-white rounded-[50px] overflow-hidden shadow-2xl border border-black/5">
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
              Establish
              <br />
              Global
              <br />
              Identity.
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

        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center text-left">
          <div className="max-w-[420px] mx-auto w-full space-y-8">
            <h2 className="text-[44px] font-[1000] uppercase italic tracking-tighter">
              Register
            </h2>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="relative">
                <label className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block">
                  Full Identity
                </label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="NAME SURNAME"
                  className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold transition-all ${errors.fullName ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && (
                  <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 flex items-center gap-1">
                    <FiAlertCircle /> {errors.fullName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="relative">
                  <label className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block">
                    Birth Date
                  </label>
                  <input
                    name="birthDate"
                    type="date"
                    className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold cursor-pointer transition-all ${errors.birthDate ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                  {errors.birthDate && (
                    <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 leading-none">
                      {errors.birthDate}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <label className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block">
                    Access Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="MAIL@VAULT.COM"
                    className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold transition-all ${errors.email ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 leading-none">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block">
                    Security Code
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold transition-all ${errors.password ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-black/20 hover:text-black bg-transparent border-none cursor-pointer"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 text-[8px] font-black uppercase tracking-tighter">
                  <span
                    className={
                      passwordChecks.length ? "text-green-500" : "text-black/10"
                    }
                  >
                    8+ CHARS
                  </span>
                  <span
                    className={
                      passwordChecks.upper ? "text-green-500" : "text-black/10"
                    }
                  >
                    UPPERCASE
                  </span>
                  <span
                    className={
                      passwordChecks.number ? "text-green-500" : "text-black/10"
                    }
                  >
                    NUMBER
                  </span>
                  <span
                    className={
                      passwordChecks.special
                        ? "text-green-500"
                        : "text-black/10"
                    }
                  >
                    SYMBOL
                  </span>
                </div>
              </div>

              <div className="relative">
                <label className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block">
                  Verify Code
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold transition-all ${errors.confirmPassword ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="pt-10 flex flex-col gap-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-black text-white rounded-full font-[1000] uppercase italic tracking-widest text-[11px] shadow-2xl hover:scale-[1.02] border-none cursor-pointer"
                >
                  {isLoading ? "PROCESING..." : "Establish Identity"}{" "}
                  <FiArrowRight className="ml-2" />
                </Button>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/30 text-center">
                  Already verified?{" "}
                  <Link
                    to="/login"
                    className="text-black font-black ml-2 underline underline-offset-4"
                  >
                    Log In
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
