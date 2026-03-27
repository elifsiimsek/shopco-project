import { useState } from "react";
import * as Yup from "yup";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import RegisterHero from "./register-hero";
import RegisterForm from "./register-form";

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

const registerSchema = Yup.object().shape({
  fullName: Yup.string().required("IDENTITY REQUIRED").min(3, "NAME TOO SHORT"),
  email: Yup.string().email("INVALID ACCESS MAIL").required("MAIL REQUIRED"),
  birthDate: Yup.date()
    .required("DATE REQUIRED")
    .nullable()
    .test("age", "ACCESS DENIED: 18+ ONLY 🔞", (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return age >= 18;
    }),
  password: Yup.string()
    .min(8, "8+ CHARS REQUIRED")
    .matches(/[A-Z]/, "UPPERCASE REQUIRED")
    .matches(/[0-9]/, "NUMBER REQUIRED")
    .matches(/[^A-Za-z0-9]/, "SYMBOL REQUIRED")
    .required("SECURITY CODE REQUIRED"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "CODES MISMATCH")
    .required("VERIFICATION REQUIRED"),
});

export default function RegisterView() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

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

    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await registerSchema.validate(formData, { abortEarly: false });

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
        setNotification(`WELCOME TO THE VAULT! 🧧`);
        setIsLoading(false);
        window.location.href = "/account";
      }, 1500);
    } catch (err) {
      const validationErrors: RegisterFormErrors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof RegisterFormErrors] =
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
      <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row bg-white rounded-[50px] overflow-hidden shadow-2xl border border-black/5">
        <RegisterHero />
        <RegisterForm
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          showPassword={showPassword}
          strengthScore={strengthScore}
          passwordChecks={passwordChecks}
          setShowPassword={setShowPassword}
          onChange={handleInputChange}
          onSubmit={handleRegister}
        />
      </div>
    </div>
  );
}
