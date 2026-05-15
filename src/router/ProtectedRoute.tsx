import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiAlertOctagon } from "react-icons/fi";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F6F6]">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.status === "restricted") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-[400px] w-full text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[24px] flex items-center justify-center mx-auto animate-bounce">
            <FiAlertOctagon size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter">
              Access Denied
            </h1>
            <p className="text-black/40 font-bold text-sm uppercase tracking-widest leading-relaxed">
              Your identity has been restricted by the terminal administrator.
            </p>
          </div>
          <button
            onClick={() => logout?.()}
            className="w-full py-4 bg-black text-white rounded-2xl font-black italic uppercase text-[11px] tracking-widest shadow-xl shadow-black/20 hover:bg-red-600 transition-all"
          >
            EXIT TERMINAL
          </button>
        </div>
      </div>
    );
  }

  if (adminOnly) {
    const isAdmin = user.role === "admin" || user.email === "admin@mail.com";
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
