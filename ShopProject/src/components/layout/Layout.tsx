import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "../ui/Toast";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Toast />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
