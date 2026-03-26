import {
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiLogOut,
  FiShield,
  FiChevronRight,
  FiAlertCircle,
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
    <div className="min-h-screen bg-[#FBFBFB] font-satoshi text-black text-left p-4 md:p-12">
      {a.deleteConfirm && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/20 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-[360px] rounded-[35px] p-10 text-center shadow-2xl border border-black/5 animate-in zoom-in-95">
            <FiAlertCircle size={28} className="text-black mb-4 mx-auto" />
            <h3 className="text-xl font-[1000] uppercase italic tracking-tighter mb-2 text-black">
              Purge Entry?
            </h3>
            <p className="text-[10px] text-black/30 font-black uppercase tracking-widest mb-8">
              Permanently remove this {a.deleteConfirm.type}?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={a.handleConfirmDelete}
                className="w-full bg-black text-white py-4 rounded-full font-black text-[10px] uppercase italic tracking-widest border-none cursor-pointer"
              >
                Confirm
              </button>
              <button
                onClick={() => a.setDeleteConfirm(null)}
                className="w-full bg-transparent text-black/20 py-2 font-black uppercase text-[9px] border-none cursor-pointer hover:text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-black/[0.05] pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[9px] font-[1000] uppercase tracking-[0.4em] text-black/20">
                System / Authorized
              </p>
            </div>
            <h1 className="text-5xl md:text-7xl font-[1000] uppercase italic tracking-tighter m-0 leading-[0.85]">
              Identity <br /> Control
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-[9px] font-black uppercase tracking-widest text-black/20 mb-1">
                Established User
              </p>
              <p className="text-sm font-[1000] uppercase italic tracking-tighter">
                {a.user?.name}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center p-1 bg-white shadow-sm">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-black italic text-xl">
                {a.user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <aside className="lg:col-span-3 space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20 mb-6 pl-4">
              Navigation Protocol
            </p>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => a.setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-none cursor-pointer group ${
                  a.activeTab === tab.id
                    ? "bg-black text-white shadow-xl translate-x-2"
                    : "bg-transparent text-black/30 hover:text-black hover:bg-black/[0.02]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-black text-[10px] uppercase tracking-widest">
                    {tab.label}
                  </span>
                </div>
                {a.activeTab === tab.id && <FiChevronRight />}
              </button>
            ))}
            <button
              onClick={a.logout}
              className="w-full flex items-center gap-4 p-4 mt-12 rounded-2xl text-red-500/40 hover:text-red-500 hover:bg-red-50 transition-all border-none bg-transparent cursor-pointer"
            >
              <FiLogOut className="text-lg" />
              <span className="font-black text-[10px] uppercase tracking-widest">
                Terminate Session
              </span>
            </button>
          </aside>

          <main className="lg:col-span-9 bg-white rounded-[45px] p-8 md:p-16 shadow-sm border border-black/[0.02] relative overflow-hidden">
            <FiShield
              size={300}
              className="absolute -right-20 -top-20 text-black/[0.01] pointer-events-none"
            />

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
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-6 text-black/10">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 italic mb-8">
        {text}
      </p>
      <button className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-8 py-3 rounded-full border-none cursor-pointer hover:scale-105 transition-all">
        Access Archive
      </button>
    </div>
  );
}
