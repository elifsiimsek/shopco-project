import { useState } from "react";
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: RegisterFormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = "IDENTITY REQUIRED";
    if (!emailRegex.test(formData.email)) newErrors.email = "INVALID ACCESS MAIL";

    const birthYear = new Date(formData.birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    
    if (!formData.birthDate) {
      newErrors.birthDate = "DATE REQUIRED";
    } else if (currentYear - birthYear < 18) {
      newErrors.birthDate = "ACCESS DENIED: 18+ ONLY 🔞";
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