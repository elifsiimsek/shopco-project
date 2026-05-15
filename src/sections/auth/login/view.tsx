import { useState, type FormEvent } from "react";
import * as Yup from "yup";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const { setNotification } = useCart();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });

      const success = await login(email, password);

      if (success) {
        setNotification(`ACCESS GRANTED. WELCOME TO THE VAULT. 👋`);
        
        if (email === "admin@mail.com") {
          navigate("/admin");
        } else {
          navigate("/account"); 
        }
      } else {
        setErrors({ general: "INVALID CREDENTIALS: ACCESS DENIED" });
      }
    } catch (err) {
      const validationErrors: LoginFormErrors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof LoginFormErrors] = error.message;
          }
        });
      } else {
        validationErrors.general = "VAULT CONNECTION FAILED.";
      }

      setErrors(validationErrors);
    } finally {
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