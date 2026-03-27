import { Link } from "react-router-dom";
import {
  FiMail,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import Button from "../../../components/ui/Button";

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface Props {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  errors: LoginFormErrors;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  errors,
  onSubmit,
}: Props) {
  const firstError = errors.general || Object.values(errors)[0];

  return (
    <div className="w-full lg:w-7/12 p-8 md:p-20 flex flex-col justify-center text-left text-black">
      <div className="max-w-[400px] mx-auto w-full space-y-12 py-10">
        <h2 className="text-[44px] font-[1000] uppercase italic tracking-tighter leading-none">
          Login
        </h2>

        <form onSubmit={onSubmit} className="space-y-10" noValidate>
          {firstError && (
            <div className="bg-red-500/10 p-4 rounded-2xl flex items-center gap-3 text-red-600 border border-red-500/20 animate-fade-in-up">
              <FiAlertCircle size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                {firstError}
              </p>
            </div>
          )}

          <div className="relative group text-left">
            <label
              htmlFor="login-email"
              className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 block cursor-pointer transition-colors ${errors.email ? "text-red-500" : "text-black/30"}`}
            >
              Identifier
            </label>
            <div className="relative">
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="STYLE@SHOPCO.COM"
                className={`w-full py-4 bg-transparent border-b-2 outline-none font-bold text-base transition-all text-black ${errors.email ? "border-red-500" : "border-black/5 focus:border-black"}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FiMail
                size={18}
                className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? "text-red-500" : "text-black/10"}`}
              />
            </div>
          </div>

          <div className="relative group text-left">
            <label
              htmlFor="login-password"
              className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 block cursor-pointer transition-colors ${errors.password ? "text-red-500" : "text-black/30"}`}
            >
              Security Key
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full py-4 bg-transparent border-b-2 outline-none font-bold text-base transition-all text-black ${errors.password ? "border-red-500" : "border-black/5 focus:border-black"}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-black/20 hover:text-black bg-transparent border-none cursor-pointer transition-all"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-10 flex flex-col gap-8">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-black text-white rounded-full font-[1000] uppercase italic tracking-widest text-[11px] shadow-2xl border-none cursor-pointer flex items-center justify-center transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "VALIDATING..." : "Access Vault"}{" "}
              <FiArrowRight className="ml-2" />
            </Button>

            <p className="text-[10px] font-black uppercase tracking-widest text-black/30 text-center">
              New?{" "}
              <Link
                to="/register"
                className="text-black font-black ml-2 underline underline-offset-4 hover:text-black/60 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
