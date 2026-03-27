import { useState } from "react";
import * as Yup from "yup";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import LoginHero from "./login-hero";
import LoginForm from "./login-form";

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("INVALID ACCESS MAIL")
    .required("IDENTIFIER REQUIRED"),
  password: Yup.string().required("SECURITY KEY REQUIRED"),
});

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const { setNotification } = useCart();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });

      setIsLoading(true);

      setTimeout(() => {
        if (login(email, password)) {
          setNotification(`WELCOME BACK TO THE VAULT. 👋`);
          window.location.href = "/account";
        } else {
          setErrors({ general: "INVALID CREDENTIALS: ACCESS DENIED" });
          setIsLoading(false);
        }
      }, 1200);
    } catch (err) {
      const validationErrors: LoginFormErrors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof LoginFormErrors] =
              error.message;
          }
        });
      }

      setErrors(validationErrors);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F6F6F6] font-satoshi text-black p-4 md:p-10">
      <div className="max-w-[1100px] mx-auto w-full flex flex-col lg:flex-row bg-white rounded-[50px] overflow-hidden shadow-2xl border border-black/5">
        <LoginHero />
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isLoading={isLoading}
          errors={errors}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
}
