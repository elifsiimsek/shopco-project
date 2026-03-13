import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar"; 
import Footer from "../components/layout/Footer"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";

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
      toast(notification, {
        style: {
          background: "#000",
          color: "#fff",
          borderRadius: "100px",
          fontSize: "12px",
          fontWeight: "900",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          padding: "16px 24px",
          fontFamily: "Satoshi, sans-serif"
        }
      });
      setNotification(null);
    }
  }, [notification, setNotification]);
  return null;
}

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-satoshi">
      <ScrollToTop />
      <NotificationHandler />
      
      <ToastContainer 
        position="bottom-right" 
        autoClose={2000} 
        theme="dark" 
        hideProgressBar={true}
        icon={false} 
        closeButton={false} 
      />
      
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}