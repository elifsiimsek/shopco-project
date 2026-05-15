import { useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminUserList from "./admin-user-list";
import AdminProductManager from "./admin-product-manager";
import { AdminOrders } from "./admin-orders";
import type { Product } from "../../../types/product";

type SectionType = "dashboard" | "customers" | "products" | "orders";

interface AdminNavButtonProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface StatsData {
  customers: number;
  products: number;
  orders: number;
}

interface ApiUser {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

interface LocalUser {
  email: string;
}

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<SectionType>("dashboard");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#F3F3F3] font-sans selection:bg-black selection:text-white text-left flex flex-col overflow-x-hidden">
      <nav className="w-full bg-black text-white px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6 sticky top-0 z-[100] shadow-2xl">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-white" size={20} />
            <h2 className="text-base md:text-lg font-[1000] italic tracking-tighter uppercase leading-none">
              VAULT ADMIN
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
              Live
            </span>
          </div>
        </div>

        <div className="flex items-center bg-white/5 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center min-w-max">
            <AdminNavButton
              icon={<LayoutDashboard size={16} />}
              label="Overview"
              active={activeSection === "dashboard"}
              onClick={() => setActiveSection("dashboard")}
            />
            <AdminNavButton
              icon={<ShoppingBag size={16} />}
              label="Inventory"
              active={activeSection === "products"}
              onClick={() => setActiveSection("products")}
            />
            <AdminNavButton
              icon={<Package size={16} />}
              label="Orders"
              active={activeSection === "orders"}
              onClick={() => setActiveSection("orders")}
            />
            <AdminNavButton
              icon={<Users size={16} />}
              label="Identities"
              active={activeSection === "customers"}
              onClick={() => setActiveSection("customers")}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t border-white/10 md:border-none pt-4 md:pt-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  className="w-full h-full object-cover"
                  alt="Operator"
                />
              ) : (
                <UserIcon size={14} />
              )}
            </div>
            <p className="text-[10px] font-black uppercase truncate max-w-[80px] hidden sm:block">
              {user?.name || "OPERATOR"}
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-white hover:text-black transition-all font-black text-[9px] uppercase tracking-widest border-none cursor-pointer shadow-lg active:scale-95"
          >
            <LogOut size={12} /> TERMINATE
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-[1400px] mx-auto">
          <header className="mb-10 text-left">
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.4em] mb-1 italic">
              Active Sector
            </p>
            <h1 className="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-black leading-none">
              {activeSection === "customers"
                ? "IDENTITIES"
                : activeSection === "products"
                  ? "INVENTORY"
                  : activeSection.toUpperCase()}
            </h1>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeSection === "dashboard" && (
              <DashboardHome
                onNavigate={(section) => setActiveSection(section)}
              />
            )}
            {activeSection === "orders" && <AdminOrders />}
            {activeSection === "customers" && <AdminUserList />}
            {activeSection === "products" && <AdminProductManager />}
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminNavButton({ icon, label, active, onClick }: AdminNavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all border-none cursor-pointer whitespace-nowrap shrink-0 ${
        active
          ? "bg-white text-black font-black shadow-lg"
          : "text-white/40 hover:text-white hover:bg-white/5 font-bold"
      }`}
    >
      {icon}
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </button>
  );
}

function DashboardHome({
  onNavigate,
}: {
  onNavigate: (section: SectionType) => void;
}) {
  const [stats, setStats] = useState<StatsData>({
    customers: 0,
    products: 0,
    orders: 0,
  });

  const fetchStats = async () => {
    try {
      const usersResponse = await axios.get<ApiUser[]>(
        "https://api.escuelajs.co/api/v1/users",
      );
      const apiUsers = usersResponse.data;
      const localUsers: LocalUser[] = JSON.parse(
        localStorage.getItem("vault_all_users") || "[]",
      );
      const deletedEmails: string[] = JSON.parse(
        localStorage.getItem("vault_deleted_emails") || "[]",
      );
      const localProducts: Product[] = JSON.parse(
        localStorage.getItem("vault_admin_products") || "[]",
      );
      const ordersCount = parseInt(
        localStorage.getItem("vault_orders_count") || "0",
      );

      const uniqueEmails = new Set<string>();

      apiUsers.forEach((u) => {
        if (u.email && !deletedEmails.includes(u.email))
          uniqueEmails.add(u.email);
      });

      localUsers.forEach((u) => {
        if (u.email && !deletedEmails.includes(u.email))
          uniqueEmails.add(u.email);
      });

      setStats({
        customers: uniqueEmails.size,
        products: localProducts.length,
        orders: ordersCount,
      });
    } catch (error) {
      console.error("Dashboard Stats Sync Error:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    window.addEventListener("focus", fetchStats);
    return () => window.removeEventListener("focus", fetchStats);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 text-left">
        <StatCard
          label="Live Inventory"
          value={stats.products}
          onClick={() => onNavigate("products")}
        />

        <StatCard
          label="Total Orders"
          value={stats.orders}
          onClick={() => onNavigate("orders")}
        />

        <StatCard
          label="Identities"
          value={stats.customers}
          onClick={() => onNavigate("customers")}
        />
      </div>

      <div className="bg-black text-white rounded-[32px] md:rounded-[40px] p-8 md:p-12 relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full border border-green-500/30 flex items-center justify-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter">
                System Online
              </h3>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-1 italic">
                Vault Core Connection Established
              </p>
            </div>
          </div>
          <div className="bg-white/10 px-8 py-3 rounded-2xl border border-white/10">
            <p className="text-[10px] font-black tracking-widest uppercase">
              No Alerts Detected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white p-8 rounded-[32px] border border-black/5 transition-all overflow-hidden shadow-sm text-left ${
        onClick
          ? "hover:border-black hover:scale-[1.02] active:scale-95 cursor-pointer"
          : "cursor-default"
      }`}
    >
      <div className="relative z-10">
        <p className="text-black/30 font-black uppercase text-[10px] tracking-widest mb-2 group-hover:text-black transition-colors italic">
          {label}
        </p>
        <h3 className="text-5xl md:text-7xl font-[1000] text-black tracking-tighter italic leading-none tabular-nums">
          {value}
        </h3>
      </div>
    </button>
  );
}
