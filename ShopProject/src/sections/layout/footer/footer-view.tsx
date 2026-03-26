import { FiTwitter, FiFacebook, FiInstagram, FiGithub } from "react-icons/fi";
import { useCart } from "../../../context/CartContext";
import FooterNewsletter from "./footer-newsletter";
import FooterBottom from "./footer-bottom";

export default function FooterView() {
  const { setNotification } = useCart();

  const handleSubscribe = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(cleanEmail)) {
      setNotification("Invalid format. Example: vault@shop.co ❌");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setNotification("Welcome to the Vault! 📩");
  };

  const footerLinks = [
    { title: "Company", links: ["About", "Features", "Works", "Career"] },
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
  ];

  return (
    <footer className="bg-[#F0F0F0] pt-48 md:pt-32 pb-8 mt-48 relative w-full font-satoshi text-left">
      <FooterNewsletter onSubscribe={handleSubscribe} />

      <div className="max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-4 pb-12">
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <h2 className="text-[32px] font-[1000] uppercase tracking-tighter text-black">
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
                  className={`w-9 h-9 rounded-full flex items-center justify-center border border-black/10 transition-all cursor-pointer ${i === 1 ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"}`}
                >
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          {footerLinks.map((section, i) => (
            <div key={i} className="space-y-6">
              <h3 className="font-bold uppercase tracking-[3px] text-[14px] text-black">
                {section.title}
              </h3>
              <ul className="space-y-4 text-black/60 text-[15px] list-none p-0">
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

        <FooterBottom />
      </div>
    </footer>
  );
}
