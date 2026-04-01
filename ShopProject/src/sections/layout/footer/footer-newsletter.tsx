import { useState } from "react";
import * as Yup from "yup";
import { FiMail, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface Props {
  onSubscribe: (email: string) => Promise<void>;
}

const newsletterSchema = Yup.string()
  .email("INVALID EMAIL FORMAT")
  .required("EMAIL IS REQUIRED");

export default function FooterNewsletter({ onSubscribe }: Props) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    try {
      const validatedEmail = await newsletterSchema.validate(email, {
        abortEarly: false,
      });

      setIsSubmitting(true);
      await onSubscribe(validatedEmail);

      setIsSubscribed(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 5000);
    } catch (err) {
      setIsSubmitting(false);

      if (err instanceof Yup.ValidationError) {
        setError(err.message);
      } else {
        setError("SUBSCRIPTION FAILED");
      }
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 absolute left-0 right-0 -top-36 md:-top-20 z-[100]">
      <div className="bg-black rounded-[20px] py-9 px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl border border-white/5">
        {!isSubscribed ? (
          <>
            <h2 className="text-white text-[32px] md:text-[40px] font-[1000] uppercase tracking-tighter leading-[1.1] text-left w-full lg:max-w-[550px]">
              STAY UP TO DATE ABOUT OUR LATEST OFFERS
            </h2>
            <div className="w-full lg:w-[350px] flex flex-col gap-3">
              <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                <div className="relative">
                  <FiMail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? "text-red-500" : "text-black/40"}`}
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your email address"
                    className={`w-full bg-white py-3.5 pl-12 pr-4 rounded-full outline-none text-[15px] border-2 transition-all text-black placeholder:text-black/40 ${
                      error
                        ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                        : "border-transparent focus:border-white/20"
                    }`}
                  />
                </div>

                {error && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1 pl-4 animate-in slide-in-from-top-1">
                    <FiAlertCircle size={12} /> {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-3.5 rounded-full font-[600] text-[15px] hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border-none cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    "Subscribe to Newsletter"
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="w-full py-4 flex flex-col items-center justify-center gap-2 text-white animate-in zoom-in duration-500">
            <FiCheckCircle size={48} />
            <span className="font-[1000] text-2xl italic uppercase tracking-tighter text-white">
              YOU'RE ON THE LIST!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
