import {
  useAuth,
  type Order,
  type Card,
  type Address,
} from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import {
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiLogOut,
  FiCheckCircle,
  FiPlus,
  FiChevronRight,
  FiShoppingBag,
  FiShield,
  FiCalendar,
  FiMail,
  FiEdit3,
} from "react-icons/fi";
import { TURKEY_CITIES } from "../data/cities"; 
import Button from "../components/ui/Button";

export default function AccountPage() {
  const { user, logout, saveCard, saveAddress, updateProfile } = useAuth();
  const { addToCart, setNotification } = useCart();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ birthDate: user?.birthDate || "" });
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [newCard, setNewCard] = useState<Card & { cvc: string }>({ 
    number: "", holder: "", expiry: "", cvc: "" 
  });
  const [newAddress, setNewAddress] = useState<Address>({ 
    title: "", city: "", district: "", fullAddress: "" 
  });

  const calculateAge = (date: string | undefined): number | string => {
    if (!date) return "N/A";
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleProfileUpdate = () => {
    const age = calculateAge(editData.birthDate);
    if (typeof age === "number" && age < 18) {
      setNotification("Access requires age 18+. 🔞");
      return;
    }
    updateProfile(editData);
    setIsEditing(false);
    setNotification("Profile updated. ✨");
  };

  const handleReOrder = (order: Order) => {
    order.items.forEach((item: any) => addToCart(item, item.quantity));
    setNotification("Items added to bag! 🛍️");
  };

  const handleCardSave = () => {
    if (newCard.number.length === 16 && newCard.holder.trim() !== "" && newCard.expiry.length === 5 && newCard.cvc.length === 3) {
      saveCard({ number: newCard.number, holder: newCard.holder, expiry: newCard.expiry });
      setIsAddingCard(false);
      setNotification("Card secured! 💳");
      setNewCard({ number: "", holder: "", expiry: "", cvc: "" });
    } else {
      setNotification("Invalid card details. ❌");
    }
  };

  const handleAddressSave = () => {
    if (newAddress.fullAddress.trim() && newAddress.city !== "" && newAddress.district.trim() !== "") {
      saveAddress(newAddress);
      setIsAddingAddress(false);
      setNewAddress({ title: "", city: "", district: "", fullAddress: "" });
      setNotification("Location linked! 📍");
    } else {
      setNotification("Please fill all fields. ❌");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-12 md:py-20 font-satoshi text-left text-black min-h-screen bg-white">
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">Vault Terminal</p>
          <h1 className="text-[40px] md:text-[52px] font-black uppercase italic tracking-tighter leading-none m-0">Identity Hub</h1>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-black/40 hover:text-red-500 font-bold text-[11px] uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer">
          <FiLogOut /> Terminate Session
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        <aside className="w-full lg:w-64 space-y-8">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black italic shadow-xl">
              {user?.name?.substring(0,1)}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm uppercase italic tracking-tight">{user?.name}</span>
              <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Premium Badge</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {[
              { id: "profile", label: "Specs", icon: <FiUser /> },
              { id: "orders", label: "History", icon: <FiPackage /> },
              { id: "address", label: "Logistics", icon: <FiMapPin /> },
              { id: "payment", label: "Vault Pay", icon: <FiCreditCard /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all border-none cursor-pointer ${
                  activeTab === tab.id ? "bg-black text-white shadow-2xl scale-[1.02]" : "bg-transparent text-black/40 hover:text-black"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 w-full bg-[#F9F9F9] rounded-[40px] p-8 md:p-12 border border-black/[0.03] shadow-inner">
          
          {activeTab === "profile" && (
            <div className="animate-fade-in-up space-y-12">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                    <FiShield className="text-black/20" /> Identity Specs
                  </h3>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-black/40 hover:text-black font-black text-[10px] uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer underline underline-offset-4">
                      <FiEdit3 /> Edit Establishing
                    </button>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
                  <IdentityItem icon={<FiUser />} label="Full Signature" value={user?.name} />
                  <IdentityItem icon={<FiMail />} label="Secure Email" value={user?.email} />
                  <IdentityItem icon={<FiCalendar />} label="Established Date" value={user?.birthDate} />
                  <IdentityItem icon={<FiShield />} label="Verified Age" value={`${calculateAge(user?.birthDate)} Years`} />
               </div>

               {isEditing && (
                <div className="bg-white p-8 rounded-3xl space-y-6 animate-in zoom-in-95 text-left shadow-sm border border-black/5">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30">Identity Modification</p>
                  <input type="date" className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-black border-none outline-none focus:ring-1 focus:ring-black transition-all" value={editData.birthDate} onChange={(e) => setEditData({ birthDate: e.target.value })} />
                  <div className="flex gap-3">
                    <Button onClick={handleProfileUpdate} className="flex-1 py-4 bg-black text-white rounded-full font-black text-[10px] uppercase border-none cursor-pointer hover:scale-105 transition-all shadow-xl">Apply Changes</Button>
                    <button onClick={() => setIsEditing(false)} className="px-6 text-[10px] font-black uppercase text-black/30 border-none bg-transparent cursor-pointer">Discard</button>
                  </div>
                </div>
               )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="animate-fade-in-up space-y-8">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Order Archive</h3>
              {user?.orders?.length ? (
                user.orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl border border-black/[0.05] p-6 md:p-8 hover:shadow-md transition-all mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-black/[0.03]">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center shadow-lg"><FiPackage size={18} /></div>
                          <div>
                            <p className="text-[8px] font-bold text-black/20 uppercase tracking-widest">{order.date}</p>
                            <h4 className="text-sm font-black tracking-tight m-0 uppercase">{order.id}</h4>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-lg font-black italic">${order.total}</span>
                          <span className="text-[9px] font-bold uppercase text-green-500 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                            <FiCheckCircle size={10} /> Verified
                          </span>
                       </div>
                    </div>
                    <div className="space-y-4">
                       {order.items?.map((item: any, idx: number) => (
                         <div key={idx} className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-all">
                            <div className="w-12 h-14 bg-[#F5F5F5] rounded-lg overflow-hidden shrink-0"><img src={item.img} className="w-full h-full object-cover" alt="" /></div>
                            <div className="flex-1">
                               <h5 className="font-bold text-[11px] uppercase italic tracking-tight m-0">{item.name}</h5>
                               <p className="text-[9px] font-bold opacity-30 uppercase">Qty: {item.quantity} | {item.size}</p>
                            </div>
                         </div>
                       ))}
                       <div className="pt-6 flex justify-end">
                          <button onClick={() => handleReOrder(order)} className="flex items-center gap-2 bg-transparent text-black font-black text-[10px] uppercase tracking-widest hover:underline border-none cursor-pointer">Re-Establish Drop <FiChevronRight /></button>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon={<FiShoppingBag />} text="Your archive is currently empty." />
              )}
            </div>
          )}

          {activeTab === "payment" && (
            <div className="animate-fade-in-up space-y-8">
               <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Vault Pay</h2>
                {!isAddingCard && (
                  <button onClick={() => setIsAddingCard(true)} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase border-none cursor-pointer hover:scale-105 transition-all shadow-xl">
                    <FiPlus /> Establish Card
                  </button>
                )}
              </div>
              
              {user?.savedCard && !isAddingCard ? (
                <div className="max-w-sm bg-white p-8 rounded-[30px] border border-black/5 flex flex-col justify-between shadow-sm relative overflow-hidden group aspect-[1.6/1]">
                  <div className="flex justify-between items-start relative z-10 text-black">
                    <FiCreditCard size={28} />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/20 italic">Authorised</p>
                  </div>
                  <p className="text-lg font-black tracking-[0.2em] z-10 m-0">•••• •••• •••• {user.savedCard.number.slice(-4)}</p>
                  <div className="flex justify-between items-end relative z-10">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Holder</p>
                      <p className="text-[10px] font-black uppercase">{user.savedCard.holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Expiry</p>
                      <p className="text-[10px] font-black uppercase">{user.savedCard.expiry}</p>
                    </div>
                  </div>
                </div>
              ) : (
                isAddingCard && (
                  <div className="bg-white p-10 rounded-[35px] border border-black/5 max-w-md space-y-6 animate-in zoom-in-95 shadow-sm">
                    <div className="space-y-4">
                      <input type="text" placeholder="CARD NUMBER" maxLength={16} className="w-full bg-[#F5F5F5] p-4 rounded-xl outline-none font-black text-[11px] border-none" value={newCard.number} onChange={(e) => setNewCard({...newCard, number: e.target.value.replace(/\D/g, "")})} />
                      <input type="text" placeholder="HOLDER SIGNATURE" className="w-full bg-[#F5F5F5] p-4 rounded-xl outline-none font-black text-[11px] border-none uppercase" value={newCard.holder} 
                        onChange={(e) => setNewCard({...newCard, holder: e.target.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, "").toUpperCase()})} />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-[#F5F5F5] p-4 rounded-xl outline-none font-black text-[11px] border-none" value={newCard.expiry} 
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "");
                            if (v.length >= 2) {
                              let m = v.substring(0, 2);
                              if (parseInt(m) > 12) m = "12";
                              v = m + (v.substring(2, 4) ? "/" + v.substring(2, 4) : "");
                            }
                            setNewCard({ ...newCard, expiry: v });
                          }} 
                        />
                        <input type="text" placeholder="CVC" maxLength={3} className="w-full bg-[#F5F5F5] p-4 rounded-xl outline-none font-black text-[11px] border-none" value={newCard.cvc} onChange={(e) => setNewCard({...newCard, cvc: e.target.value.replace(/\D/g, "")})} />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleCardSave} className="flex-1 py-4 bg-black text-white rounded-full font-black text-[10px] uppercase border-none cursor-pointer shadow-xl">Secure Card</button>
                      <button onClick={() => setIsAddingCard(false)} className="px-6 text-[10px] font-black uppercase text-black/30 border-none bg-transparent cursor-pointer">Cancel</button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "address" && (
            <div className="animate-fade-in-up space-y-8">
               <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Logistics</h2>
                {!isAddingAddress && (
                  <button onClick={() => setIsAddingAddress(true)} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase border-none cursor-pointer hover:scale-105 transition-all shadow-xl"><FiPlus /> New Location</button>
                )}
              </div>

              {user?.address && !isAddingAddress ? (
                <div className="bg-white p-10 rounded-[35px] border border-black/5 flex justify-between items-center shadow-sm relative overflow-hidden group">
                  <div className="space-y-4 relative z-10 text-left">
                    <p className="text-[9px] font-black text-shopRed uppercase tracking-[0.4em] italic m-0">{user.address.title || "PRIMARY"}</p>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter m-0">{user.address.city} / {user.address.district}</h3>
                    <p className="text-xs font-bold text-black/40 max-w-sm leading-relaxed uppercase m-0">{user.address.fullAddress}</p>
                  </div>
                  <FiMapPin size={40} className="text-black/5 group-hover:scale-110 transition-transform" />
                </div>
              ) : (
                isAddingAddress && (
                  <div className="bg-white p-10 rounded-[35px] border border-black/5 max-w-xl space-y-6 animate-in zoom-in-95 shadow-sm">
                    <div className="space-y-4">
                      <input type="text" placeholder="ADDRESS LABEL (E.G. WORK)" className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-[11px] border-none outline-none uppercase" value={newAddress.title} onChange={(e) => setNewAddress({...newAddress, title: e.target.value.toUpperCase()})} />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative text-left">
                          <select className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-[11px] border-none outline-none appearance-none cursor-pointer" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}>
                            <option value="">SELECT CITY</option>
                            {TURKEY_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <FiChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 opacity-20 pointer-events-none" />
                        </div>
                        <input type="text" placeholder="DISTRICT" className="bg-[#F5F5F5] p-4 rounded-xl font-black text-[11px] border-none outline-none uppercase" value={newAddress.district} 
                          onChange={(e) => setNewAddress({...newAddress, district: e.target.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, "").toUpperCase()})} />
                      </div>
                      <textarea placeholder="FULL LOGISTICS DETAILS" className="w-full bg-[#F5F5F5] p-6 rounded-2xl font-black text-[11px] border-none outline-none h-32 resize-none uppercase" value={newAddress.fullAddress} onChange={(e) => setNewAddress({...newAddress, fullAddress: e.target.value.toUpperCase()})} />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleAddressSave} className="flex-1 py-4 bg-black text-white rounded-full font-black text-[10px] uppercase border-none cursor-pointer hover:scale-[1.02] transition-all shadow-xl">Link Location</button>
                      <button onClick={() => setIsAddingAddress(false)} className="px-6 text-[10px] font-black uppercase text-black/30 border-none bg-transparent cursor-pointer">Cancel</button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IdentityItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | undefined }) {
  return (
    <div className="space-y-2 text-left group">
      <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
        <span className="text-xs">{icon}</span>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] m-0">{label}</p>
      </div>
      <p className="text-xl font-black italic uppercase m-0 leading-none truncate tracking-tighter">{value || "---"}</p>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-center py-24 opacity-10 italic">
      <div className="text-6xl mb-4 flex justify-center">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center leading-none m-0 italic">{text}</p>
    </div>
  );
}