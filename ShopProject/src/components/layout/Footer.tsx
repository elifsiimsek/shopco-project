import { useState } from "react";
import {
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiGithub,
  FiMail,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay,
  FaGooglePay,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setNotification } = useCart();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(cleanEmail)) {
      setNotification("Invalid format. Example: vault@shop.co ❌");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSubscribed(true);
    setNotification("Welcome to the Vault! 📩");

    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 5000);
  };

  return (
    <footer className="bg-[#F0F0F0] pt-48 md:pt-32 pb-8 mt-48 relative w-full font-satoshi">
      <div className="max-w-[1240px] mx-auto px-4 absolute left-0 right-0 -top-36 md:-top-20 z-[100]">
        <div className="bg-black rounded-[20px] py-9 px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          {!isSubscribed ? (
            <>
              <h2 className="text-white text-[32px] md:text-[40px] font-[1000] uppercase tracking-tighter leading-[1.1] text-left w-full lg:max-w-[550px]">
                STAY UPTO DATE ABOUT OUR LATEST OFFERS
              </h2>
              <div className="w-full lg:w-[350px] flex flex-col gap-3">
                <form onSubmit={handleSubscribe} className="space-y-3">
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
                      disabled={isSubmitting}
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

      <div className="max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-4 border-b border-black/10 pb-12 mt-12 md:mt-0 text-left">
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <h2 className="text-[32px] font-[1000] uppercase tracking-tighter text-black leading-none">
              SHOP.CO
            </h2>
            <p className="text-black/60 text-[14px] leading-relaxed max-w-[250px]">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="flex items-center gap-3">
              {[FiTwitter, FiFacebook, FiInstagram, FiGithub].map((Icon, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border border-black/10 transition-all cursor-pointer ${
                    i === 1
                      ? "bg-black text-white border-black"
                      : "bg-white text-black hover:bg-black hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: "Company",
              links: ["About", "Features", "Works", "Career"],
            },
            {
              title: "Help",
              links: [
                "Customer Support",
                "Delivery Details",
                "Terms & Conditions",
                "Privacy Policy",
              ],
            },
            {
              title: "FAQ",
              links: ["Account", "Manage Deliveries", "Orders", "Payments"],
            },
            {
              title: "Resources",
              links: [
                "Free eBooks",
                "Development Tutorial",
                "How to - Blog",
                "Youtube Playlist",
              ],
            },
          ].map((section, i) => (
            <div key={i} className="space-y-6">
              <h3 className="font-bold uppercase tracking-[3px] text-[14px] text-black">
                {section.title}
              </h3>
              <ul className="space-y-4 text-black/60 text-[15px]">
                {section.links.map((link) => (
                  <li
                    key={link}
                    className="hover:text-black cursor-pointer transition-colors"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-black/60 text-[14px]">
            Shop.co © 2000-2023, All Rights Reserved
          </p>
          <div className="flex items-center gap-2">
            {[
              FaCcVisa,
              FaCcMastercard,
              FaCcPaypal,
              FaCcApplePay,
              FaGooglePay,
            ].map((Icon, i) => (
              <div
                key={i}
                className="bg-white border border-[#D6D6D6] rounded-[6px] w-[46px] h-[30px] flex items-center justify-center shadow-sm"
              >
                <Icon
                  size={30}
                  className={
                    i === 0
                      ? "text-[#1A1971]"
                      : i === 1
                        ? "text-[#EB001B]"
                        : "text-black"
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
