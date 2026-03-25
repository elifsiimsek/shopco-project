import { useState } from "react";
import {
  FiPackage, FiUser, FiMapPin, FiCreditCard, FiLogOut,
  FiShoppingBag, FiEdit3, FiPlus, FiTrash2, FiActivity, FiAlertCircle
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import type { Order, Address, Card } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { TURKEY_CITIES } from "../data/cities";
import Button from "../components/ui/Button";

export default function AccountPage() {
  const {
    user, logout, updateProfile, saveAddress, saveCard,
    deleteAddress, deleteCard, updateAddress, updateCard,
  } = useAuth();
  const { addToCart, setNotification } = useCart();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: 'address' | 'card' } | null>(null);

  const [editData, setEditData] = useState({ birthDate: user?.birthDate || "" });
  const [addrForm, setAddrForm] = useState<Omit<Address, "id">>({
    title: "", city: "", district: "", fullAddress: "",
  });
  const [cardForm, setCardForm] = useState<Omit<Card, "id"> & { cvc: string }>({
    number: "", holder: "", expiry: "", cvc: "",
  });

  // --- IDENTITY (PROFİL) MANTIĞI ---
  const calculateAge = (date: string | undefined) => {
    if (!date) return "N/A";
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age;
  };

  const handleProfileUpdate = () => {
    const age = calculateAge(editData.birthDate);
    if (typeof age === "number" && age < 18) {
      setNotification("Archive requires age 18+. 🔞");
      return;
    }
    updateProfile(editData);
    setIsEditingProfile(false);
    setNotification("Identity Updated. ✨");
  };

  // --- KART (VAULT PAY) MANTIĞI ---
  const handleSaveCard = () => {
    const [month, year] = cardForm.expiry.split('/').map(Number);
    const fullYear = 2000 + year;

    if (!cardForm.expiry.includes('/') || cardForm.expiry.length < 5) {
      setNotification("Format MM/YY required. 📅");
      return;
    }
    if (month < 1 || month > 12) {
      setNotification("Invalid Month (1-12). ❌");
      return;
    }
    if (fullYear < 2026) {
      setNotification("Card Expired (Min 2026). 🔞");
      return;
    }
    if (fullYear > 2036) {
      setNotification("Vault Limit: Max 10 Years. 🔒");
      return;
    }
    if (cardForm.number.length < 16 || cardForm.cvc.length < 3) {
      setNotification("Verify Card/CVC Specs. ❌");
      return;
    }
    if (!cardForm.holder.trim().includes(" ")) {
      setNotification("Full Signature Required. ✍️");
      return;
    }

    if (editingId) updateCard(editingId, { number: cardForm.number, holder: cardForm.holder, expiry: cardForm.expiry });
    else saveCard({ number: cardForm.number, holder: cardForm.holder, expiry: cardForm.expiry });

    setIsAddingCard(false);
    setEditingId(null);
    setCardForm({ number: "", holder: "", expiry: "", cvc: "" });
    setNotification("Vault Pay Secured. 💳");
  };

  const handleHolderInput = (val: string) => {
    const cleanValue = val.replace(/[0-9]/g, "").replace(/\s\s+/g, " ");
    setCardForm({ ...cardForm, holder: cleanValue.toUpperCase() });
  };

  // --- LOJİSTİK (ADRES) MANTIĞI ---
  const handleSaveAddress = () => {
    if (!addrForm.city || !addrForm.district || !addrForm.fullAddress) {
      setNotification("Missing logistics details. ❌");
      return;
    }
    if (editingId) updateAddress(editingId, addrForm);
    else saveAddress(addrForm);

    setIsAddingAddress(false);
    setEditingId(null);
    setAddrForm({ title: "", city: "", district: "", fullAddress: "" });
    setNotification("Location Established. 📍");
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'address') deleteAddress(deleteConfirm.id);
    else deleteCard(deleteConfirm.id);
    setDeleteConfirm(null);
    setNotification("Entry Purged. 🗑️");
  };

  const handleReOrder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.id, name: item.name, price: item.price,
        img: item.img, selectedSize: item.size, selectedColor: item.color
      }, item.quantity);
    });
    setNotification("Restored to Bag. 🛍️");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-satoshi text-black text-left">
      {/* 🛡️ DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-[380px] rounded-[40px] p-12 text-center shadow-2xl animate-in zoom-in-95">
            <FiAlertCircle size={48} className="text-red-500 mb-6 mx-auto" />
            <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-2">Remove Entry?</h3>
            <p className="text-[11px] text-black/40 font-black uppercase tracking-widest mb-8">This {deleteConfirm.type} will be purged.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleConfirmDelete} className="w-full bg-black text-white py-4 rounded-full font-black text-[11px] uppercase border-none cursor-pointer">Confirm</button>
              <button onClick={() => setDeleteConfirm(null)} className="w-full bg-transparent text-black/20 py-2 font-black uppercase text-[10px] border-none cursor-pointer">Abort</button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-black/[0.03] py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-end">
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20 mb-2 flex items-center gap-2"><FiActivity size={12} /> Authorized Access</p>
            <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter m-0">Identity Control</h1>
          </div>
          <button onClick={logout} className="text-black/30 hover:text-red-500 font-black text-[10px] uppercase tracking-widest bg-transparent border-none cursor-pointer flex items-center gap-2 transition-all">Terminate <FiLogOut size={14} /></button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 space-y-2">
          {[
            { id: "profile", label: "Identity", icon: <FiUser /> }, 
            { id: "orders", label: "Archive", icon: <FiPackage /> }, 
            { id: "address", label: "Logistics", icon: <FiMapPin /> }, 
            { id: "payment", label: "Vault Pay", icon: <FiCreditCard /> }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border-none cursor-pointer ${activeTab === tab.id ? "bg-black text-white shadow-2xl scale-105" : "bg-white text-black/30 hover:text-black"}`}>
              {tab.icon} <span className="font-black text-[11px] uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* CONTENT AREA */}
        <div className="flex-1 w-full">
          {/* 🆔 IDENTITY TAB */}
          {activeTab === "profile" && (
            <div className="bg-white border border-black/5 p-8 rounded-[35px] shadow-sm max-w-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-[1000] uppercase italic tracking-tighter m-0">Core Specs</h3>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-black/20 bg-transparent border-none cursor-pointer"><FiEdit3 size={20} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <IdentityItem label="Signatory" value={user?.name} />
                <IdentityItem label="Vault Email" value={user?.email} />
                <IdentityItem label="Origin" value={user?.birthDate} />
                <IdentityItem label="Age Status" value={`${calculateAge(user?.birthDate)} Years`} />
              </div>
              {isEditingProfile && (
                <div className="mt-8 pt-8 border-t border-black/5 animate-in slide-in-from-top-4">
                  <p className="text-[10px] font-black uppercase text-black/20 mb-4 tracking-widest">Update Origin Date</p>
                  <div className="flex gap-4">
                    <input type="date" className="flex-1 bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none" value={editData.birthDate} onChange={(e) => setEditData({ birthDate: e.target.value })} />
                    <Button onClick={handleProfileUpdate} className="px-8 py-4 text-[10px]">Verify</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 📍 LOGISTICS TAB */}
          {activeTab === "address" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-[1000] uppercase italic tracking-tighter m-0">Logistics Nodes</h3>
                <button onClick={() => { setIsAddingAddress(true); setEditingId(null); setAddrForm({ title: "", city: "", district: "", fullAddress: "" }); }} className="bg-black text-white px-6 py-3 rounded-full font-black text-[10px] uppercase border-none cursor-pointer flex items-center gap-2 shadow-xl"><FiPlus /> New Link</button>
              </div>
              {isAddingAddress && (
                <div className="bg-white border-2 border-dashed border-black/10 p-8 rounded-[35px] max-w-lg space-y-4 animate-in zoom-in-95">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="LABEL (E.G. HOME)" className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none uppercase" value={addrForm.title} onChange={(e) => setAddrForm({...addrForm, title: e.target.value.toUpperCase()})} />
                    <select className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none cursor-pointer" value={addrForm.city} onChange={(e) => setAddrForm({...addrForm, city: e.target.value})}>
                      <option value="">CITY</option>
                      {TURKEY_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <input type="text" placeholder="DISTRICT" className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none uppercase" value={addrForm.district} onChange={(e) => setAddrForm({...addrForm, district: e.target.value.toUpperCase()})} />
                  <textarea placeholder="FULL ARCHIVE ADDRESS" className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none h-24 resize-none uppercase" value={addrForm.fullAddress} onChange={(e) => setAddrForm({...addrForm, fullAddress: e.target.value.toUpperCase()})} />
                  <div className="flex gap-4"><Button onClick={handleSaveAddress} className="flex-1 py-4 text-[10px]">Secure Node</Button><button onClick={() => setIsAddingAddress(false)} className="text-[10px] font-black uppercase text-black/20 bg-transparent border-none cursor-pointer">Abort</button></div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user?.addresses?.length ? user.addresses.map(addr => (
                  <div key={addr.id} className="group bg-white p-6 rounded-[30px] border border-black/5 hover:border-black/10 transition-all relative">
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(addr.id); setAddrForm(addr); setIsAddingAddress(true); }} className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center border-none cursor-pointer"><FiEdit3 size={14} /></button>
                      <button onClick={() => setDeleteConfirm({id: addr.id, type: 'address'})} className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center border-none cursor-pointer"><FiTrash2 size={14} /></button>
                    </div>
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 italic opacity-40">{addr.title || "SPEC"}</p>
                    <h4 className="text-xl font-[1000] uppercase italic tracking-tight m-0">{addr.city} / {addr.district}</h4>
                    <p className="text-[11px] font-bold text-black/40 mt-3 uppercase italic leading-relaxed">{addr.fullAddress}</p>
                  </div>
                )) : <EmptyState icon={<FiMapPin />} text="No Logistics Nodes Established." />}
              </div>
            </div>
          )}

          {/* 💳 VAULT PAY TAB */}
          {activeTab === "payment" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-[1000] uppercase italic tracking-tighter m-0">Vault Pay</h3>
                {!isAddingCard && (user?.savedCards?.length || 0) < 3 && (
                  <button onClick={() => setIsAddingCard(true)} className="bg-black text-white px-6 py-3 rounded-full font-black text-[10px] uppercase border-none cursor-pointer flex items-center gap-2 shadow-xl"><FiPlus /> New Link</button>
                )}
              </div>
              {isAddingCard && (
                <div className="bg-white border-2 border-dashed border-black/10 p-8 rounded-[35px] max-w-sm space-y-4 animate-in zoom-in-95">
                  <input type="text" placeholder="CARD NUMBER" maxLength={16} className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none" value={cardForm.number} onChange={(e) => setCardForm({...cardForm, number: e.target.value.replace(/\D/g, "")})} />
                  <input type="text" placeholder="HOLDER" className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs uppercase border-none outline-none" value={cardForm.holder} onChange={(e) => handleHolderInput(e.target.value)} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none" value={cardForm.expiry} onChange={(e) => {
                      let v = e.target.value.replace(/[^\d/]/g, "");
                      if (v.length === 2 && !v.includes('/')) v += '/';
                      setCardForm({...cardForm, expiry: v});
                    }} />
                    <input type="text" placeholder="CVC" maxLength={3} className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none" value={cardForm.cvc} onChange={(e) => setCardForm({...cardForm, cvc: e.target.value.replace(/\D/g, "")})} />
                  </div>
                  <Button onClick={handleSaveCard} className="w-full py-5 text-[10px]">Verify Link</Button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user?.savedCards?.map(card => (
                  <div key={card.id} className="group bg-black text-white p-8 rounded-[35px] relative aspect-[1.6/1] flex flex-col justify-between shadow-2xl">
                    <button onClick={() => setDeleteConfirm({id: card.id, type: 'card'})} className="absolute top-6 right-6 text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-transparent border-none cursor-pointer"><FiTrash2 size={18} /></button>
                    <FiCreditCard size={28} className="text-white/20" />
                    <p className="text-2xl font-black tracking-[0.3em] italic m-0">•••• {card.number.slice(-4)}</p>
                    <div className="flex justify-between items-end opacity-40">
                      <div className="text-[10px] font-black uppercase tracking-widest"><p className="m-0 text-[7px]">Signatory</p>{card.holder}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-right"><p className="m-0 text-[7px]">Exp</p>{card.expiry}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 📦 ARCHIVE TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-lg font-[1000] uppercase italic tracking-tighter m-0">Archive Vault</h3>
              {user?.orders?.length ? user.orders.map(order => (
                <div key={order.id} className="bg-white rounded-[35px] border border-black/5 p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-black/[0.03] gap-4 text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F9F9F9] rounded-2xl flex items-center justify-center"><FiPackage size={20} /></div>
                      <div><p className="text-[10px] font-black text-black/20 uppercase m-0">{order.date}</p><h4 className="text-sm font-black m-0 italic">{order.id}</h4></div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-black/20 uppercase m-0">Total Payload</p>
                      <span className="text-xl font-[1000] italic tracking-tighter">${order.total}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-[#F9F9F9] p-2 pr-4 rounded-2xl border border-black/[0.02]">
                        <img src={item.img} className="w-10 h-12 object-cover rounded-lg shadow-sm" alt={item.name} />
                        <div className="text-left">
                          <p className="text-[9px] font-black uppercase italic m-0">{item.name}</p>
                          <p className="text-[7px] font-black text-black/20 m-0">SIZE: {item.size} | QTY: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => handleReOrder(order)} className="bg-black text-white px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-xl active:scale-95 transition-all">Restore Bag <FiShoppingBag size={12} /></button>
                  </div>
                </div>
              )) : <EmptyState icon={<FiShoppingBag />} text="No Entries Archived." />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function IdentityItem({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="text-left space-y-1">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20 m-0">{label}</p>
      <p className="text-xl font-[1000] italic uppercase m-0 tracking-tighter text-black/90 truncate">{value || "---"}</p>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-black/[0.03]">
      <div className="text-5xl mb-6 text-black/5 flex justify-center">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/10 italic">{text}</p>
    </div>
  );
}