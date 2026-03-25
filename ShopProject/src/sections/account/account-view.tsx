import {
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiLogOut,
  FiActivity,
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
    <div className="min-h-screen bg-[#FAFAFA] font-satoshi text-black text-left">
      {a.deleteConfirm && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-[380px] rounded-[40px] p-12 text-center shadow-2xl animate-in zoom-in-95">
            <FiAlertCircle size={48} className="text-red-500 mb-6 mx-auto" />
            <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-2">
              Remove Entry?
            </h3>
            <p className="text-[11px] text-black/40 font-black uppercase tracking-widest mb-8">
              This {a.deleteConfirm.type} will be purged from the archive.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={a.handleConfirmDelete}
                className="w-full bg-black text-white py-4 rounded-full font-black text-[11px] uppercase border-none cursor-pointer hover:bg-neutral-800 transition-all"
              >
                Confirm Removal
              </button>
              <button
                onClick={() => a.setDeleteConfirm(null)}
                className="w-full bg-transparent text-black/20 py-2 font-black uppercase text-[10px] border-none cursor-pointer hover:text-black"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-black/[0.03] py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-end">
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20 mb-2 flex items-center gap-2">
              <FiActivity size={12} /> Authorized Access
            </p>
            <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter m-0">
              Identity Control
            </h1>
          </div>
          <button
            onClick={a.logout}
            className="text-black/30 hover:text-red-500 font-black text-[10px] uppercase tracking-widest bg-transparent border-none cursor-pointer flex items-center gap-2 transition-all pb-1"
          >
            Terminate <FiLogOut size={14} />
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-64 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => a.setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border-none cursor-pointer ${
                a.activeTab === tab.id
                  ? "bg-black text-white shadow-2xl scale-105"
                  : "bg-white text-black/30 hover:text-black border border-black/[0.03]"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-black text-[11px] uppercase tracking-widest">
                {tab.label}
              </span>
            </button>
          ))}
        </aside>

        <div className="flex-1 w-full">
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
              setEditingId={(id) => a.setEditingId(id as string | null)}
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
  );
}

function EmptyState({ icon, text }: EmptyStateProps) {
  return (
    <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-black/[0.03] animate-pulse">
      <div className="text-5xl mb-6 text-black/5 flex justify-center">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/10 italic">
        {text}
      </p>
    </div>
  );
}