import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import LoginHero from "./login-hero";
import LoginForm from "./login-form";

export default function LoginView() {
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
        <LoginHero />
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isLoading={isLoading}
          error={error}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
}
