import {
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiLogOut,
  FiShield,
  FiChevronRight,
  FiAlertCircle,
  FiActivity,
} from "react-icons/fi";
import { useAccount } from "./use-account";
import AccountProfile from "./account-profile";
import AccountOrders from "./account-orders";
import AccountAddress from "./account-address";
import AccountPayment from "./account-payment";
import type { AccountTab, EmptyStateProps } from "../../types/account";

export default function AccountView() {
  const a = useAccount();

  const TABS: AccountTab[] = [
    { id: "profile", label: "Identity", icon: <FiUser /> },
    { id: "orders", label: "Archive", icon: <FiPackage /> },
    { id: "address", label: "Logistics", icon: <FiMapPin /> },
    { id: "payment", label: "Vault Pay", icon: <FiCreditCard /> },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4] font-satoshi text-black text-left p-4 md:p-12 selection:bg-black selection:text-white">
      {a.deleteConfirm && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[380px] rounded-[40px] p-12 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-black/5 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-3">
              Purge Entry?
            </h3>
            <p className="text-[11px] text-black/40 font-black uppercase tracking-widest mb-10 leading-relaxed">
              This action will permanently <br /> erase the{" "}
              {a.deleteConfirm.type} protocol.
            </p>
            <div className="space-y-3">
              <button
                onClick={a.handleConfirmDelete}
                className="w-full bg-red-500 text-white py-5 rounded-full font-[1000] text-[11px] uppercase italic tracking-widest border-none cursor-pointer shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
              >
                Confirm Purge
              </button>
              <button
                onClick={() => a.setDeleteConfirm(null)}
                className="w-full bg-transparent text-black/30 py-3 font-black uppercase text-[10px] border-none cursor-pointer hover:text-black transition-colors"
              >
                Cancel Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1300px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-black/[0.03] shadow-sm">
              <FiActivity className="text-green-500 animate-pulse" size={14} />
              <p className="text-[10px] font-[1000] uppercase tracking-[0.3em] text-black">
                System / <span className="opacity-40">Authorized Access</span>
              </p>
            </div>
            <h1 className="text-6xl md:text-[100px] font-[1000] uppercase italic tracking-tighter m-0 leading-[0.75] text-black">
              User <br />{" "}
              <span className="text-black/10 not-italic">Vault</span>
            </h1>
          </div>

          <div className="flex items-center gap-6 bg-white p-3 rounded-[32px] border border-black/[0.03] shadow-sm pr-8">
            <div className="w-20 h-20 rounded-[24px] bg-black flex items-center justify-center text-white font-[1000] italic text-3xl shadow-xl shadow-black/10 rotate-3">
              {a.user?.name?.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-1">
                Established Link
              </p>
              <p className="text-xl font-[1000] uppercase italic tracking-tighter">
                {a.user?.name}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          <aside className="lg:col-span-3 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mb-8 pl-4">
              Command Center
            </p>
            <div className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => a.setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-[24px] transition-all border-none cursor-pointer group relative overflow-hidden ${
                    a.activeTab === tab.id
                      ? "bg-black text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] translate-x-3"
                      : "bg-white/50 text-black/30 hover:text-black hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-5 relative z-10">
                    <span
                      className={`text-xl transition-transform group-hover:scale-110 ${a.activeTab === tab.id ? "opacity-100" : "opacity-40"}`}
                    >
                      {tab.icon}
                    </span>
                    <span className="font-[1000] text-[12px] uppercase tracking-tighter italic">
                      {tab.label}
                    </span>
                  </div>
                  {a.activeTab === tab.id && (
                    <FiChevronRight className="relative z-10" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={a.logout}
              className="w-full flex items-center gap-5 p-5 mt-16 rounded-[24px] text-red-500/40 hover:text-red-500 hover:bg-red-50 transition-all border-none bg-transparent cursor-pointer font-black text-[11px] uppercase tracking-widest"
            >
              <FiLogOut size={20} />
              Terminate Link
            </button>
          </aside>

          <main className="lg:col-span-9 bg-white rounded-[60px] p-10 md:p-20 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.05)] border border-black/[0.03] relative">
            <div className="absolute -right-20 -top-20 opacity-[0.02] pointer-events-none rotate-12">
              <FiShield size={500} />
            </div>

            <div className="relative z-10">
              {a.activeTab === "profile" && a.user && (
                <AccountProfile
                  user={a.user}
                  isEditing={a.isEditingProfile}
                  setIsEditing={a.setIsEditingProfile}
                  editData={a.editData}
                  setEditData={a.setEditData}
                  handleUpdate={a.handleProfileUpdate}
                  calculateAge={a.calculateAge}
                />
              )}

              {a.activeTab === "orders" && (
                <AccountOrders
                  orders={a.user?.orders}
                  handleReOrder={a.handleReOrder}
                  EmptyState={EmptyState}
                />
              )}

              {a.activeTab === "address" && a.user && (
                <AccountAddress
                  user={a.user}
                  isAdding={a.isAddingAddress}
                  setIsAdding={a.setIsAddingAddress}
                  addrForm={a.addrForm}
                  setAddrForm={a.setAddrForm}
                  handleSave={a.handleSaveAddress}
                  setEditingId={a.setEditingId}
                  setDeleteConfirm={a.setDeleteConfirm}
                  EmptyState={EmptyState}
                  formErrors={a.formErrors}
                />
              )}

              {a.activeTab === "payment" && a.user && (
                <AccountPayment
                  user={a.user}
                  isAdding={a.isAddingCard}
                  setIsAdding={a.setIsAddingCard}
                  cardForm={a.cardForm}
                  setCardForm={a.setCardForm}
                  handleSave={a.handleSaveCard}
                  handleHolderInput={a.handleHolderInput}
                  setDeleteConfirm={a.setDeleteConfirm}
                  EmptyState={EmptyState}
                  formErrors={a.formErrors}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-shopGray-light rounded-full flex items-center justify-center mb-10 text-black/5 ring-8 ring-black/[0.01]">
        <span className="text-5xl">{icon}</span>
      </div>
      <p className="text-[12px] font-black uppercase tracking-[0.5em] text-black/20 italic mb-12 max-w-[280px] leading-relaxed">
        {text}
      </p>
      <button className="text-[10px] font-[1000] uppercase italic tracking-[0.2em] bg-black text-white px-12 py-5 rounded-full border-none cursor-pointer shadow-2xl hover:bg-neutral-800 transition-all hover:-translate-y-1 active:scale-95">
        Explore Collection
      </button>
    </div>
  );
}
