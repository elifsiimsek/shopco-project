import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ToastContainer, toast } from "react-toastify";
import { FiX, FiTag } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "./context/CartContext";
import "./index.css";

function CouponModal() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const hasSeen = localStorage.getItem("shopco_coupon_seen");
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    localStorage.setItem("shopco_coupon_seen", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-[40px] p-10 max-w-[400px] w-full text-center relative shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={close}
          className="absolute top-6 right-6 text-black/20 hover:text-black transition-colors border-none bg-transparent cursor-pointer"
        >
          <FiX size={24} />
        </button>
        <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-12">
          <FiTag size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter leading-none mb-2">
          Exclusive
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-8">
          First order discount code
        </p>
        <div className="bg-[#F6F6F6] p-6 rounded-3xl border-2 border-dashed border-black/10 mb-8">
          <p className="text-4xl font-[1000] italic tracking-tighter mb-1 uppercase">
            SHOPCO20
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest text-black/40">
            20% OFF AT CHECKOUT
          </p>
        </div>
        <button
          onClick={close}
          className="w-full py-5 bg-black text-white rounded-full font-black uppercase italic tracking-widest text-xs hover:scale-105 transition-all cursor-pointer"
        >
          Claim Discount
        </button>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotificationHandler() {
  const { notification, setNotification } = useCart();
  useEffect(() => {
    if (notification) {
      toast(notification);
      setNotification(null);
    }
  }, [notification, setNotification]);
  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScrollToTop />
      <NotificationHandler />
      <CouponModal />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        theme="dark"
        limit={1}
        hideProgressBar={true}
        closeOnClick
      />
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
