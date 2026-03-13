import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiGlobe } from "react-icons/fi";
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
  const { login } = useAuth();
  const navigate = useNavigate();

  const passwordChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };
  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;
  const isMatch =
    formData.password.length > 0 &&
    formData.password === formData.confirmPassword;

  const calculateAge = (date: string) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

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

    if (!formData.fullName.trim())
      newErrors.fullName = "Full identity required";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Valid access mail required";

    if (!formData.birthDate) {
      newErrors.birthDate = "Birth date required";
    } else {
      if (calculateAge(formData.birthDate) < 18) {
        newErrors.birthDate = "Vault access denied: You must be 18+ 🔞";
        setErrors(newErrors);
        return;
      }
    }

    if (strengthScore < 5)
      newErrors.password = "Security too weak (Use harf, rakam, sembol)";
    if (!isMatch) newErrors.confirmPassword = "Passwords mismatch";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setTimeout(() => {
      login({
        name: formData.fullName.toUpperCase(),
        email: formData.email,
        birthDate: formData.birthDate,
      });
      setNotification(`Identity established! 🎉 25% Voucher Active.`);
      setIsLoading(false);
      navigate("/account");
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-white font-satoshi text-black overflow-hidden relative text-left">
      <div className="hidden lg:flex w-5/12 bg-black p-16 flex-col justify-between relative overflow-hidden text-left">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border border-white/10 rounded-full" />
        </div>
        <div className="relative z-10 text-left text-white">
          <FiGlobe className="text-white/20 mb-4" size={32} />
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em]">
            Shop.co / Archive
          </p>
        </div>
        <div className="relative z-10 text-left text-white">
          <h1 className="text-white text-[80px] font-[1000] uppercase italic tracking-tighter leading-[0.75] mb-8">
            Access
            <br />
            The
            <br />
            Vault.
          </h1>
        </div>
        <p className="relative z-10 text-white/10 text-[9px] font-black uppercase tracking-widest italic text-left">
          Verification v8.0
        </p>
      </div>

      <div className="w-full lg:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-[#FBFBFB] overflow-y-auto">
        <div className="max-w-[500px] mx-auto w-full space-y-8 py-10">
          <h2 className="text-[40px] font-[1000] uppercase italic tracking-tighter leading-none text-left text-black">
            Register
          </h2>
          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-left"
          >
            <div className="md:col-span-2 relative">
              <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-2 block">
                Full Identity
              </label>
              <input
                name="fullName"
                type="text"
                placeholder="NAME SURNAME"
                className="w-full py-3 bg-transparent border-b-2 border-black/5 outline-none font-bold text-base focus:border-black text-black"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && (
                <p className="absolute -bottom-5 text-[10px] font-bold italic tracking-tight text-red-600">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="md:col-span-2 relative text-left">
              <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-2 block">
                Date of Birth (18+ Only)
              </label>
              <input
                name="birthDate"
                type="date"
                className="w-full py-3 bg-transparent border-b-2 border-black/5 outline-none font-bold text-base focus:border-black text-black uppercase cursor-pointer"
                value={formData.birthDate}
                onChange={handleInputChange}
              />
              {errors.birthDate && (
                <p className="absolute -bottom-5 text-[10px] font-bold italic tracking-tight text-red-600">
                  {errors.birthDate}
                </p>
              )}
            </div>

            <div className="md:col-span-2 relative text-left text-black">
              <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-2 block">
                Access Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="STYLE@SHOPCO.COM"
                className="w-full py-3 bg-transparent border-b-2 border-black/5 outline-none font-bold text-base focus:border-black text-black"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="absolute -bottom-5 text-[10px] font-bold italic tracking-tight text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative text-left text-black">
              <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-2 block">
                Security Code
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full py-3 bg-transparent border-b-2 border-black/5 outline-none font-bold text-base focus:border-black text-black"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="flex gap-1 mt-2 h-[2px]">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 transition-all duration-500 ${i < strengthScore ? (strengthScore <= 2 ? "bg-red-400" : strengthScore <= 4 ? "bg-orange-400" : "bg-green-500") : "bg-black/5"}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative text-left text-black">
              <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-2 block">
                Verify Code
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold text-base transition-all ${formData.confirmPassword ? (isMatch ? "border-green-500 text-green-600" : "border-red-500 text-red-600") : "border-black/5 focus:border-black"}`}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <p className="absolute -bottom-5 text-[10px] font-bold italic tracking-tight text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="md:col-span-2 pt-6 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-black/5 mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-16 py-5 bg-black text-white rounded-full font-[1000] uppercase italic tracking-widest text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all border-none cursor-pointer"
              >
                {isLoading ? "Validating..." : "Establish Identity"}{" "}
                <FiArrowRight className="ml-2" />
              </Button>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/30 text-left text-black">
                Member?{" "}
                <Link
                  to="/login"
                  className="text-black underline-offset-8 ml-2 font-black no-underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
