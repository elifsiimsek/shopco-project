import { Link } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import Button from "../../../components/ui/Button";

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
}

interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  birthDate?: string;
}

interface Props {
  formData: RegisterFormData;
  errors: RegisterFormErrors;
  isLoading: boolean;
  showPassword: boolean;
  strengthScore: number;
  passwordChecks: {
    length: boolean;
    upper: boolean;
    number: boolean;
    special: boolean;
  };
  setShowPassword: (val: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterForm({
  formData,
  errors,
  isLoading,
  showPassword,
  strengthScore,
  passwordChecks,
  setShowPassword,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center text-left">
      <div className="max-w-[420px] mx-auto w-full space-y-8">
        <h2 className="text-[44px] font-[1000] uppercase italic tracking-tighter text-black">
          Register
        </h2>

        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <div className="relative">
            <label
              htmlFor="fullName"
              className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block cursor-pointer"
            >
              Full Identity
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="NAME SURNAME"
              value={formData.fullName}
              onChange={onChange}
              className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold transition-all ${errors.fullName ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
            />
            {errors.fullName && (
              <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 flex items-center gap-1">
                <FiAlertCircle /> {errors.fullName}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="relative">
              <label
                htmlFor="birthDate"
                className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block cursor-pointer"
              >
                Birth Date
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                autoComplete="bday"
                value={formData.birthDate}
                onChange={onChange}
                className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold transition-all ${errors.birthDate ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
              />
              {errors.birthDate && (
                <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 leading-none">
                  {errors.birthDate}
                </span>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="email"
                className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block cursor-pointer"
              >
                Access Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="MAIL@VAULT.COM"
                value={formData.email}
                onChange={onChange}
                className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold transition-all ${errors.email ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
              />
              {errors.email && (
                <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 leading-none">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <label
                htmlFor="password"
                className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block cursor-pointer"
              >
                Security Code
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={onChange}
                  className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold transition-all ${errors.password ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-black/20 hover:text-black bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-1 h-1 w-full bg-black/5 rounded-full overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 transition-all duration-500 ${
                    i < strengthScore
                      ? strengthScore <= 2
                        ? "bg-red-500"
                        : strengthScore === 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      : "bg-black/5"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3 text-[8px] font-black uppercase tracking-tighter">
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
                  passwordChecks.special ? "text-green-500" : "text-black/10"
                }
              >
                SYMBOL
              </span>
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 block cursor-pointer"
            >
              Verify Code
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={onChange}
              className={`w-full py-3 bg-transparent border-b-2 outline-none font-bold transition-all ${errors.confirmPassword ? "border-red-500 text-red-500" : "border-black/5 focus:border-black text-black"}`}
            />
            {errors.confirmPassword && (
              <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="pt-8 flex flex-col gap-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-black text-white rounded-full font-[1000] uppercase italic tracking-widest text-[11px] shadow-2xl hover:scale-[1.02] border-none cursor-pointer flex items-center justify-center"
            >
              {isLoading ? "PROCESSING..." : "Establish Identity"}{" "}
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
  );
}
