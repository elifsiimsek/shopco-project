import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "./context/CartContext";
import "./index.css";

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
      const timer = setTimeout(() => setNotification(null), 100);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);
  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScrollToTop />
      <NotificationHandler />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        theme="dark"
        limit={1}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover={false}
      />
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}