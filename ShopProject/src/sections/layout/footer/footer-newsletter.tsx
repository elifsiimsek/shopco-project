import { useState } from "react";
import { FiMail, FiLoader, FiCheckCircle } from "react-icons/fi";

interface Props {
  onSubscribe: (email: string) => Promise<void>;
}

export default function FooterNewsletter({ onSubscribe }: Props) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubscribe(email);
    setIsSubmitting(false);
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 5000);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 absolute left-0 right-0 -top-36 md:-top-20 z-[100]">
      <div className="bg-black rounded-[20px] py-9 px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
        {!isSubscribed ? (
          <>
            <h2 className="text-white text-[32px] md:text-[40px] font-[1000] uppercase tracking-tighter leading-[1.1] text-left w-full lg:max-w-[550px]">
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </h2>
            <div className="w-full lg:w-[350px] flex flex-col gap-3">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
                    size={20}
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-white py-3.5 pl-12 pr-4 rounded-full outline-none text-[15px] border-none text-black placeholder:text-black/40"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-3.5 rounded-full font-bold text-[15px] hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
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
          <div className="w-full py-4 flex items-center justify-center gap-4 text-white animate-fade-in-up">
            <FiCheckCircle size={32} />
            <span className="font-black text-xl italic uppercase tracking-tighter">
              YOU'RE ON THE LIST!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
