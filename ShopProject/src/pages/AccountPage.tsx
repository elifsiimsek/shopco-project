import {
  useAuth,
  type Order,
  type Address,
  type Card,
} from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import {
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiLogOut,
  FiChevronRight,
  FiShoppingBag,
  FiEdit3,
  FiPlus,
  FiTrash2,
  FiActivity,
} from "react-icons/fi";
import { TURKEY_CITIES } from "../data/cities";
import Button from "../components/ui/Button";

export default function AccountPage() {
  const {
    user,
    logout,
    updateProfile,
    saveAddress,
    saveCard,
    deleteAddress,
    deleteCard,
    updateAddress,
    updateCard,
  } = useAuth();
  const { addToCart, setNotification } = useCart();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editData, setEditData] = useState({
    birthDate: user?.birthDate || "",
  });
  const [addrForm, setAddrForm] = useState<Omit<Address, "id">>({
    title: "",
    city: "",
    district: "",
    fullAddress: "",
  });
  const [cardForm, setCardForm] = useState<Omit<Card, "id"> & { cvc: string }>({
    number: "",
    holder: "",
    expiry: "",
    cvc: "",
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
      setNotification("Archive requires age 18+. 🔞");
      return;
    }
    updateProfile(editData);
    setIsEditingProfile(false);
    setNotification("Identity Parameters Updated. ✨");
  };

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

  const handleSaveCard = () => {
    if (cardForm.number.length < 16 || cardForm.cvc.length < 3) {
      setNotification("Verify payment specs. ❌");
      return;
    }
    if (editingId)
      updateCard(editingId, {
        number: cardForm.number,
        holder: cardForm.holder,
        expiry: cardForm.expiry,
      });
    else {
      if ((user?.savedCards?.length || 0) >= 3) {
        setNotification("Vault limit: 3 cards 🔒");
        return;
      }
      saveCard({
        number: cardForm.number,
        holder: cardForm.holder,
        expiry: cardForm.expiry,
      });
    }
    setIsAddingCard(false);
    setEditingId(null);
    setCardForm({ number: "", holder: "", expiry: "", cvc: "" });
    setNotification("Vault Pay Secured. 💳");
  };

  const handleReOrder = (order: Order) => {
    order.items.forEach((item) => addToCart(item, item.quantity));
    setNotification("Archives restored to bag! 🛍️");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-satoshi text-black text-left">
      <header className="bg-white border-b border-black/[0.03] py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <div className="text-left">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 mb-0.5 flex items-center gap-2">
              <FiActivity size={10} /> Authorized Access
            </p>
            <h1 className="text-2xl font-[1000] uppercase italic tracking-tighter m-0 leading-none">
              Identity Control
            </h1>
          </div>
          <button
            onClick={logout}
            className="text-black/30 hover:text-red-500 font-black text-[9px] uppercase tracking-widest bg-transparent border-none cursor-pointer flex items-center gap-2 transition-colors"
          >
            Terminate <FiLogOut size={12} />
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <aside className="w-full lg:w-56 space-y-4">
            <nav className="flex flex-col gap-1">
              {[
                { id: "profile", label: "Identity", icon: <FiUser /> },
                { id: "orders", label: "Archive", icon: <FiPackage /> },
                { id: "address", label: "Logistics", icon: <FiMapPin /> },
                { id: "payment", label: "Vault Pay", icon: <FiCreditCard /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl transition-all border-none cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-black text-white shadow-lg"
                      : "bg-transparent text-black/40 hover:text-black"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span className="font-black text-[10px] uppercase tracking-widest">
                    {tab.label}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 w-full text-left">
            {activeTab === "profile" && (
              <div className="animate-fade-in space-y-6 max-w-xl">
                <div className="bg-white border border-black/5 p-6 rounded-[24px] shadow-sm">
                  <div className="flex justify-between items-center mb-8 px-2">
                    <h3 className="text-sm font-[1000] uppercase italic tracking-widest m-0">
                      Core Specs
                    </h3>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="text-black/20 hover:text-black bg-transparent border-none cursor-pointer transition-colors"
                    >
                      <FiEdit3 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 px-2">
                    <IdentityItem label="Full Signature" value={user?.name} />
                    <IdentityItem label="Vault Email" value={user?.email} />
                    <IdentityItem label="Established" value={user?.birthDate} />
                    <IdentityItem
                      label="Age Status"
                      value={`${calculateAge(user?.birthDate)} Years`}
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="bg-white border border-black/5 p-6 rounded-[24px] animate-in zoom-in-95 max-w-xs shadow-md">
                    <p className="text-[8px] font-black uppercase text-black/20 mb-3 tracking-widest">
                      Update Date
                    </p>
                    <input
                      type="date"
                      className="w-full bg-[#F9F9F9] p-3 rounded-lg font-black text-[10px] border-none outline-none mb-4"
                      value={editData.birthDate}
                      onChange={(e) =>
                        setEditData({ birthDate: e.target.value })
                      }
                    />
                    <Button
                      onClick={handleProfileUpdate}
                      className="w-full py-3.5 text-[9px] uppercase"
                    >
                      Verify Changes
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "address" && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-[1000] uppercase italic tracking-widest m-0">
                    Logistics Nodes
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingAddress(true);
                      setEditingId(null);
                      setAddrForm({
                        title: "",
                        city: "",
                        district: "",
                        fullAddress: "",
                      });
                    }}
                    className="bg-black text-white px-4 py-2 rounded-full font-black text-[8px] uppercase tracking-widest border-none cursor-pointer hover:scale-105 transition-transform flex items-center gap-1.5 shadow-md"
                  >
                    <FiPlus /> New Link
                  </button>
                </div>

                {isAddingAddress && (
                  <div className="bg-white border border-black/10 p-6 rounded-[24px] max-w-md mb-6 space-y-4 shadow-sm text-left">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="LABEL (E.G. LAB)"
                        className="w-full bg-[#F9F9F9] p-3 rounded-lg font-black text-[10px] border-none outline-none uppercase"
                        value={addrForm.title}
                        onChange={(e) =>
                          setAddrForm({
                            ...addrForm,
                            title: e.target.value.toUpperCase(),
                          })
                        }
                      />
                      <select
                        className="w-full bg-[#F9F9F9] p-3 rounded-lg font-black text-[10px] border-none outline-none cursor-pointer"
                        value={addrForm.city}
                        onChange={(e) =>
                          setAddrForm({ ...addrForm, city: e.target.value })
                        }
                      >
                        <option value="">CITY</option>
                        {TURKEY_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="DISTRICT"
                      className="w-full bg-[#F9F9F9] p-3 rounded-lg font-black text-[10px] border-none outline-none uppercase"
                      value={addrForm.district}
                      onChange={(e) =>
                        setAddrForm({
                          ...addrForm,
                          district: e.target.value
                            .replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, "")
                            .toUpperCase(),
                        })
                      }
                    />
                    <textarea
                      placeholder="FULL ARCHIVE ADDRESS"
                      className="w-full bg-[#F9F9F9] p-3 rounded-lg font-black text-[10px] border-none outline-none h-16 resize-none uppercase"
                      value={addrForm.fullAddress}
                      onChange={(e) =>
                        setAddrForm({
                          ...addrForm,
                          fullAddress: e.target.value.toUpperCase(),
                        })
                      }
                    />
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleSaveAddress}
                        className="flex-1 py-3 text-[9px]"
                      >
                        Establish
                      </Button>
                      <button
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 text-[9px] font-black uppercase text-black/20 bg-transparent border-none"
                      >
                        Abort
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user?.addresses?.length ? (
                    user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="group bg-white p-5 rounded-[20px] border border-black/5 hover:border-black/10 transition-all relative text-left"
                      >
                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(addr.id);
                              setAddrForm(addr);
                              setIsAddingAddress(true);
                            }}
                            className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center border-none cursor-pointer transition-transform hover:scale-110"
                          >
                            <FiEdit3 size={12} />
                          </button>
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center border-none cursor-pointer transition-transform hover:scale-110"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                        <p className="text-[7px] font-black text-red-500 uppercase tracking-widest mb-2 italic opacity-60">
                          {addr.title || "SPEC"}
                        </p>
                        <h4 className="text-sm font-[1000] uppercase italic tracking-tight m-0">
                          {addr.city} / {addr.district}
                        </h4>
                        <p className="text-[9px] font-bold text-black/30 mt-2 leading-relaxed uppercase">
                          {addr.fullAddress}
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<FiMapPin />}
                      text="No Nodes Established."
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-[1000] uppercase italic tracking-widest m-0">
                    Vault Pay
                  </h3>
                  {!isAddingCard && (user?.savedCards?.length || 0) < 3 && (
                    <button
                      onClick={() => {
                        setIsAddingCard(true);
                        setEditingId(null);
                        setCardForm({
                          number: "",
                          holder: "",
                          expiry: "",
                          cvc: "",
                        });
                      }}
                      className="bg-black text-white px-4 py-2 rounded-full font-black text-[8px] uppercase tracking-widest border-none cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <FiPlus /> Secure New
                    </button>
                  )}
                </div>

                {isAddingCard && (
                  <div className="bg-white border border-black/10 p-6 rounded-[24px] max-w-xs mb-6 space-y-3 shadow-sm">
                    <input
                      type="text"
                      placeholder="CARD NUMBER"
                      maxLength={16}
                      className="w-full bg-[#F9F9F9] p-3 rounded-lg font-black text-[10px] border-none outline-none"
                      value={cardForm.number}
                      onChange={(e) =>
                        setCardForm({
                          ...cardForm,
                          number: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="HOLDER"
                      className="w-full bg-[#F9F9F9] p-3 rounded-lg font-black text-[10px] uppercase border-none outline-none"
                      value={cardForm.holder}
                      onChange={(e) =>
                        setCardForm({
                          ...cardForm,
                          holder: e.target.value
                            .toUpperCase()
                            .replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, ""),
                        })
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-[#F9F9F9] p-3 rounded-lg font-black text-[10px] border-none outline-none"
                        value={cardForm.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "");
                          if (v.length >= 2)
                            v =
                              v.substring(0, 2) +
                              (v.substring(2, 4)
                                ? "/" + v.substring(2, 4)
                                : "");
                          setCardForm({ ...cardForm, expiry: v });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        maxLength={3}
                        className="w-full bg-[#F9F9F9] p-3 rounded-lg font-black text-[10px] border-none outline-none"
                        value={cardForm.cvc}
                        onChange={(e) =>
                          setCardForm({
                            ...cardForm,
                            cvc: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </div>
                    <Button
                      onClick={handleSaveCard}
                      className="w-full py-3.5 text-[9px] mt-2"
                    >
                      Secure Link
                    </Button>
                    <button
                      onClick={() => setIsAddingCard(false)}
                      className="w-full text-[9px] font-black text-black/20 uppercase bg-transparent border-none mt-1"
                    >
                      Abort
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user?.savedCards?.length ? (
                    user.savedCards.map((card) => (
                      <div
                        key={card.id}
                        className="group bg-white p-5 rounded-[24px] border border-black/5 hover:border-black/10 transition-all relative aspect-[1.7/1] flex flex-col justify-between shadow-sm"
                      >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => deleteCard(card.id)}
                            className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center border-none shadow-sm cursor-pointer"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                        <FiCreditCard size={24} className="text-black/10" />
                        <p className="text-base font-black tracking-[0.2em] m-0 text-black/80">
                          •••• •••• •••• {card.number.slice(-4)}
                        </p>
                        <div className="flex justify-between items-end opacity-30">
                          <div className="text-left space-y-0.5">
                            <p className="text-[6px] font-black uppercase m-0 tracking-widest">
                              Signatory
                            </p>
                            <p className="text-[9px] font-black uppercase m-0">
                              {card.holder}
                            </p>
                          </div>
                          <div className="text-right space-y-0.5">
                            <p className="text-[6px] font-black uppercase m-0 tracking-widest">
                              Archive
                            </p>
                            <p className="text-[9px] font-black uppercase m-0">
                              {card.expiry}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<FiCreditCard />}
                      text="No Secure Links."
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-sm font-[1000] uppercase italic tracking-widest px-1 m-0">
                  Archive Vault
                </h3>
                {user?.orders?.length ? (
                  user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-[20px] border border-black/5 p-5 hover:border-black/10 transition-all"
                    >
                      <div className="flex justify-between items-center mb-5 pb-3 border-b border-black/[0.02]">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-8 h-8 bg-[#F9F9F9] rounded-lg flex items-center justify-center">
                            <FiPackage size={14} />
                          </div>
                          <div className="text-left">
                            <p className="text-[7px] font-black text-black/20 uppercase tracking-widest m-0 leading-tight">
                              {order.date}
                            </p>
                            <h4 className="text-[10px] font-black tracking-tight uppercase m-0 leading-tight">
                              {order.id}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-black italic text-black/80">
                            ${order.total}
                          </span>
                          <span className="text-[7px] font-black uppercase text-green-500 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100">
                            Secured
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-[#F9F9F9] p-1.5 pr-3 rounded-lg border border-black/[0.02]"
                          >
                            <img
                              src={item.img}
                              className="w-5 h-7 object-cover rounded shadow-sm"
                            />
                            <span className="text-[8px] font-black uppercase italic opacity-30">
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 flex justify-end">
                        <button
                          onClick={() => handleReOrder(order)}
                          className="text-black/40 font-black text-[8px] uppercase tracking-widest flex items-center gap-1 bg-transparent border-none cursor-pointer hover:text-black hover:underline transition-all"
                        >
                          Restore <FiChevronRight size={10} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={<FiShoppingBag />} text="Vault Empty." />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function IdentityItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="text-left">
      <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/20 m-0 mb-1.5">
        {label}
      </p>
      <p className="text-lg font-[1000] italic uppercase m-0 tracking-tighter text-black/90 truncate">
        {value || "---"}
      </p>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-black/5">
      <div className="text-3xl mb-3 text-black/5 flex justify-center">
        {icon}
      </div>
      <p className="text-[8px] font-black uppercase tracking-widest text-black/10">
        {text}
      </p>
    </div>
  );
}
