import { useState } from "react";
import {
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiGithub,
  FiMail,
  FiCheckCircle,
} from "react-icons/fi";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaApplePay,
  FaGooglePay,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { setNotification } = useCart();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setIsSubscribed(true);
      setNotification("Subscribed successfully! 📩");
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 5000);
    } else {
      setNotification("Please enter a valid email. ❌");
    }
  };

  return (
    <footer className="bg-[#F0F0F0] pt-64 md:pt-40 pb-12 mt-40 md:mt-48 relative w-full">
      <div className="max-w-[1240px] mx-auto px-4 absolute left-0 right-0 -top-32 md:-top-24 z-[100]">
        <div className="bg-black rounded-[20px] py-8 px-6 md:py-10 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl min-h-[160px]">
          {!isSubscribed ? (
            <>
              <h2 className="text-white text-[28px] md:text-[40px] font-[1000] uppercase tracking-tighter leading-tight text-center lg:text-left w-full lg:max-w-[600px]">
                STAY UPTO DATE ABOUT OUR LATEST OFFERS
              </h2>
              <form
                onSubmit={handleSubscribe}
                className="w-full lg:w-[350px] space-y-3"
              >
                <div className="relative">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-white py-4 pl-12 pr-4 rounded-full outline-none text-sm font-medium border-none text-black"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black py-3.5 rounded-full font-[1000] text-sm hover:bg-gray-100 transition-all uppercase"
                >
                  Subscribe to Newsletter
                </button>
              </form>
            </>
          ) : (
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 animate-in zoom-in duration-500 text-center md:text-left">
              <FiCheckCircle className="text-white" size={40} />
              <div>
                <h2 className="text-white text-2xl font-[1000] uppercase tracking-tighter">
                  YOU'RE ON THE LIST!
                </h2>
                <p className="text-white/60 font-medium">
                  Check your inbox for exclusive offers soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-4 border-b border-black/10 pb-12 text-left">
          <div className="col-span-2 lg:col-span-1 space-y-6 flex flex-col items-center lg:items-start">
            <h2 className="text-[32px] font-[1000] uppercase tracking-tighter text-black leading-none">
              SHOP.CO
            </h2>
            <p className="text-black/60 text-sm leading-relaxed max-w-[250px] text-center lg:text-left">
              We have clothes that suits your style and which you're proud to
              wear.
            </p>
            <div className="flex items-center gap-3">
              {[FiTwitter, FiFacebook, FiInstagram, FiGithub].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-white border border-black/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer"
                >
                  <Icon size={20} />
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
              links: ["Customer Support", "Delivery Details", "Privacy Policy"],
            },
            { title: "FAQ", links: ["Account", "Orders", "Payments"] },
            { title: "Resources", links: ["Free eBooks", "Tutorials", "Blog"] },
          ].map((section, i) => (
            <div key={i} className="space-y-4">
              <h3 className="font-bold uppercase tracking-[2px] text-sm text-black">
                {section.title}
              </h3>
              <ul className="space-y-3 text-black/60 text-sm font-medium">
                {section.links.map((link) => (
                  <li key={link} className="hover:text-black cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center">
          <p className="text-black/60 text-sm font-medium">
            Shop.co © 2000-2023, All Rights Reserved
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {[
              FaCcVisa,
              FaCcMastercard,
              FaCcPaypal,
              FaApplePay,
              FaGooglePay,
            ].map((Icon, i) => (
              <div
                key={i}
                className="bg-white px-2 py-1 rounded-md border border-gray-100 flex items-center justify-center w-[45px] h-7 shadow-sm"
              >
                <Icon
                  size={i > 2 ? 32 : 28}
                  className={
                    i === 0
                      ? "text-[#1434CB]"
                      : i === 1
                        ? "text-[#EB001B]"
                        : i === 2
                          ? "text-[#003087]"
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
