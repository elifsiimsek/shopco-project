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
  FiEdit2,
  FiChevronRight,
  FiShoppingBag,
} from "react-icons/fi";
import Button from "../components/ui/Button";

const TURKEY_CITIES = [
  "ADANA",
  "ANKARA",
  "ANTALYA",
  "BURSA",
  "DENIZLI",
  "DIYARBAKIR",
  "ERZURUM",
  "ESKISEHIR",
  "GAZIANTEP",
  "ISTANBUL",
  "IZMIR",
  "KAYSERI",
  "KOCAELI",
  "KONYA",
  "MERSIN",
  "SAMSUN",
  "TRABZON",
];

export default function AccountPage() {
  const { user, logout, saveCard, saveAddress, updateProfile } = useAuth();
  const { addToCart, setNotification } = useCart();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    birthDate: user?.birthDate || "",
  });
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [newCard, setNewCard] = useState<Card>({
    number: "",
    holder: "",
    expiry: "",
  });
  const [newAddress, setNewAddress] = useState<Address>({
    title: "",
    city: "",
    district: "",
    fullAddress: "",
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
      setNotification("Vault access requires age 18+. 🔞");
      return;
    }
    updateProfile(editData);
    setIsEditing(false);
    setNotification("Birth date updated! 🔐");
  };

  const handleReOrder = (order: Order) => {
    order.items.forEach((item: any) => addToCart(item, item.quantity));
    setNotification("Order contents added to bag! 🛍️");
  };

  const handleCardSave = () => {
    if (
      newCard.number.length === 16 &&
      newCard.holder.trim() !== "" &&
      newCard.expiry.length === 5
    ) {
      saveCard(newCard);
      setIsAddingCard(false);
      setNotification("Card secured! 💳");
      setNewCard({ number: "", holder: "", expiry: "" });
    }
  };

  const handleAddressSave = () => {
    if (newAddress.fullAddress.trim() && newAddress.city !== "") {
      saveAddress(newAddress);
      setIsAddingAddress(false);
      setNewAddress({ title: "", city: "", district: "", fullAddress: "" });
      setNotification("Address linked! 📍");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-12 md:py-24 font-satoshi text-left text-black">
      <div className="flex flex-col lg:flex-row gap-12 text-left">
        <div className="w-full lg:w-80 space-y-6">
          <div className="p-8 bg-black rounded-[40px] text-white shadow-2xl relative overflow-hidden group text-left">
            <div className="relative z-10 text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2 italic">
                Vault Member
              </p>
              <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                {user?.name}
              </h1>
            </div>
            <FiUser
              size={120}
              className="absolute -right-4 -bottom-4 text-white/5 rotate-12"
            />
          </div>
          <nav className="flex flex-col gap-2">
            {[
              { id: "profile", label: "Identity", icon: <FiUser /> },
              { id: "orders", label: "Orders", icon: <FiPackage /> },
              { id: "address", label: "Addresses", icon: <FiMapPin /> },
              { id: "payment", label: "Payments", icon: <FiCreditCard /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 p-5 rounded-[24px] transition-all font-black text-xs uppercase tracking-widest border-none cursor-pointer ${activeTab === tab.id ? "bg-black text-white shadow-xl scale-[1.02]" : "bg-white text-black/40 hover:bg-[#F5F5F5] hover:text-black"}`}
              >
                <span className="text-xl">{tab.icon}</span> {tab.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-4 p-5 rounded-[24px] text-red-500 bg-red-50 transition-all font-black text-xs uppercase tracking-widest border-none cursor-pointer mt-4"
            >
              <FiLogOut className="text-xl" /> Exit Vault
            </button>
          </nav>
        </div>

        <div className="flex-1 bg-white border border-black/5 rounded-[48px] p-8 md:p-12 shadow-sm min-h-[600px] text-left">
          {activeTab === "profile" && (
            <div className="animate-fade-in-up space-y-12">
              <div className="flex justify-between items-center border-b border-black/5 pb-8 text-left">
                <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-black">
                  Security Profile
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black text-white px-5 py-2 rounded-full border-none cursor-pointer hover:scale-105 transition-all"
                  >
                    <FiEdit2 /> Edit birth
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                <InfoCard label="Full Name" value={user?.name} />
                <InfoCard label="Email Identifier" value={user?.email} />
                <InfoCard label="Birth Date" value={user?.birthDate} />
                <div className="space-y-3 border-b border-black/5 pb-8 group text-left">
                  <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em]">
                    Vault Age
                  </p>
                  <p className="text-xl font-[1000] tracking-tight text-black italic uppercase leading-none">
                    {calculateAge(user?.birthDate)}{" "}
                    <span className="text-[10px] not-italic opacity-20 ml-1">
                      Years Old
                    </span>
                  </p>
                </div>
                {isEditing && (
                  <div className="col-span-2 bg-[#FBFBFB] p-10 rounded-[40px] border border-black/5 space-y-6 animate-in zoom-in-95 text-left">
                    <label className="text-[10px] font-black uppercase opacity-40 ml-2 text-black">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white p-4 rounded-2xl font-black text-[14px] border-none outline-none shadow-sm text-black"
                      value={editData.birthDate}
                      onChange={(e) =>
                        setEditData({ birthDate: e.target.value })
                      }
                    />
                    <div className="flex gap-4">
                      <Button
                        onClick={handleProfileUpdate}
                        className="flex-1 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase border-none"
                      >
                        Save Changes
                      </Button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-10 text-[10px] font-black uppercase opacity-30 border-none bg-transparent cursor-pointer text-black"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="animate-fade-in-up space-y-10 text-left">
              <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-black">
                Order Archive
              </h2>
              {user?.orders?.length ? (
                user.orders.map((order: Order) => (
                  <div
                    key={order.id}
                    className="bg-[#FBFBFB] rounded-[48px] border border-black/5 overflow-hidden group hover:border-black/10 transition-all shadow-sm mb-8"
                  >
                    <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/[0.03]">
                      <div className="flex items-center gap-6 text-left text-black">
                        <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl">
                          <FiPackage size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-black/20 uppercase tracking-widest">
                            {order.date}
                          </p>
                          <h4 className="text-xl font-[1000] italic tracking-tighter uppercase leading-none">
                            {order.id}
                          </h4>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2 text-right">
                        <p className="text-3xl font-[1000] italic leading-none text-black">
                          ${order.total}
                        </p>
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                          <FiCheckCircle /> Confirmed
                        </span>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 space-y-6 text-left">
                      <div className="grid grid-cols-1 gap-4">
                        {order.items?.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-6 bg-white p-4 rounded-3xl border border-black/[0.02]"
                          >
                            <div className="w-16 h-20 bg-shopGray-light rounded-xl overflow-hidden shrink-0">
                              <img
                                src={item.img}
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <h5 className="font-black text-[13px] uppercase italic tracking-tight text-black">
                                {item.name}
                              </h5>
                              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-black">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-[1000] italic text-lg text-black">
                              ${item.price}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-4">
                        <p className="text-[10px] font-black uppercase text-black/20 italic">
                          {order.itemsCount} pieces
                        </p>
                        <button
                          onClick={() => handleReOrder(order)}
                          className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-black text-[11px] uppercase italic tracking-widest hover:scale-105 transition-all cursor-pointer shadow-xl border-none"
                        >
                          Re-Order drop <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<FiShoppingBag />}
                  text="Your archive is empty."
                />
              )}
            </div>
          )}

          {activeTab === "payment" && (
            <div className="animate-fade-in-up space-y-10 text-left">
              <div className="flex justify-between items-center border-b border-black/5 pb-8">
                <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-black text-left">
                  Payment Vault
                </h2>
                {!isAddingCard && (
                  <button
                    onClick={() => setIsAddingCard(true)}
                    className="flex items-center gap-2 bg-black  px-6 py-3 rounded-full text-[10px] font-black uppercase border-none cursor-pointer hover:scale-105 transition-all text-white"
                  >
                    <FiPlus /> New Card
                  </button>
                )}
              </div>
              {user?.savedCard && !isAddingCard ? (
                <div className="max-w-sm bg-neutral-900 p-10 rounded-[40px] text-white aspect-[1.6/1] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-start relative z-10 text-white">
                    <FiCreditCard size={32} className="opacity-20 text-white" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic leading-none text-white text-left">
                      Shop.co Card
                    </p>
                  </div>
                  <p className="text-xl font-bold tracking-[0.25em] z-10 leading-none text-white text-left drop-shadow-md">
                    •••• •••• •••• {user.savedCard.number.slice(-4)}
                  </p>
                  <div className="flex justify-between items-end relative z-10 text-white text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">
                      {user.savedCard.holder}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">
                      {user.savedCard.expiry}
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:bg-white/10 transition-all" />
                </div>
              ) : (
                isAddingCard && (
                  <div className="bg-[#FBFBFB] p-10 rounded-[40px] border border-black/5 max-w-md space-y-6 animate-in zoom-in-95 text-left text-black">
                    <input
                      type="text"
                      placeholder="CARD NUMBER"
                      maxLength={16}
                      className="w-full bg-white p-4 rounded-2xl outline-none font-black text-[10px] border-none text-black shadow-sm"
                      value={newCard.number}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          number: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="HOLDER NAME"
                      className="w-full bg-white p-4 rounded-2xl outline-none font-black text-[10px] border-none text-black shadow-sm"
                      value={newCard.holder}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          holder: e.target.value.toUpperCase(),
                        })
                      }
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="flex-1 bg-white p-4 rounded-2xl outline-none font-black text-[10px] border-none text-black shadow-sm"
                        value={newCard.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "");
                          if (v.length >= 2)
                            v = v.substring(0, 2) + "/" + v.substring(2, 4);
                          setNewCard({ ...newCard, expiry: v });
                        }}
                      />
                      <button
                        onClick={handleCardSave}
                        className="flex-1 bg-black text-white rounded-2xl font-black text-[10px] border-none cursor-pointer uppercase shadow-xl"
                      >
                        Save
                      </button>
                    </div>
                    <button
                      onClick={() => setIsAddingCard(false)}
                      className="w-full text-[9px] font-black uppercase opacity-30 hover:opacity-100 border-none bg-transparent cursor-pointer text-black"
                    >
                      Cancel
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "address" && (
            <div className="animate-fade-in-up space-y-8 text-left text-black">
              <div className="flex justify-between items-center border-b border-black/5 pb-8 text-left text-black">
                <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-black text-left">
                  Shipping Vault
                </h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-2 bg-black px-6 py-3 rounded-full text-[10px] font-black uppercase border-none cursor-pointer hover:scale-105 transition-all text-white"
                  >
                    <FiPlus /> New Address
                  </button>
                )}
              </div>
              {user?.address && !isAddingAddress ? (
                <div className="bg-[#FBFBFB] p-10 rounded-[40px] border border-black/5 flex justify-between items-center text-left text-black">
                  <div className="space-y-4 text-left">
                    <p className="text-[10px] font-black text-shopRed uppercase tracking-[0.4em] text-left">
                      {user.address.title || "PRIMARY"}
                    </p>
                    <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter text-black text-left">
                      {user.address.city} / {user.address.district}
                    </h3>
                    <p className="text-sm font-bold opacity-40 max-w-sm leading-relaxed text-black text-left">
                      {user.address.fullAddress}
                    </p>
                  </div>
                  <FiMapPin size={50} className="text-black/5" />
                </div>
              ) : (
                isAddingAddress && (
                  <div className="bg-[#FBFBFB] p-10 rounded-[40px] border border-black/5 max-w-xl space-y-6 animate-in zoom-in-95 text-left text-black">
                    <input
                      type="text"
                      placeholder="TITLE (E.G. WORK)"
                      className="w-full bg-white p-5 rounded-2xl font-black text-[10px] border-none outline-none shadow-sm text-black"
                      value={newAddress.title}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          title: e.target.value.toUpperCase(),
                        })
                      }
                    />
                    <div className="grid grid-cols-2 gap-4 text-black text-left">
                      <select
                        className="bg-white p-5 rounded-2xl font-black text-[10px] border-none outline-none appearance-none shadow-sm cursor-pointer text-black"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                      >
                        <option value="">SELECT CITY</option>
                        {TURKEY_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="DISTRICT"
                        className="bg-white p-5 rounded-2xl font-black text-[10px] border-none outline-none shadow-sm text-black text-left"
                        value={newAddress.district}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            district: e.target.value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                    <textarea
                      placeholder="FULL DETAILS"
                      className="w-full bg-white p-5 rounded-2xl font-black text-[10px] border-none outline-none h-32 resize-none shadow-sm text-black text-left"
                      value={newAddress.fullAddress}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          fullAddress: e.target.value.toUpperCase(),
                        })
                      }
                    />
                    <div className="flex gap-4 pt-4 text-left">
                      <Button
                        onClick={handleAddressSave}
                        className="flex-1 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase border-none"
                      >
                        Link Address
                      </Button>
                      <button
                        onClick={() => setIsAddingAddress(false)}
                        className="px-8 text-[10px] font-black uppercase opacity-30 border-none bg-transparent cursor-pointer text-black"
                      >
                        Cancel
                      </button>
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

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="space-y-3 border-b border-black/5 pb-8 group text-left text-black">
      <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] group-hover:text-black transition-colors text-left">
        {label}
      </p>
      <p className="text-xl font-[1000] tracking-tight text-black italic uppercase leading-none text-left">
        {value || "---"}
      </p>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-center py-32 opacity-10 italic text-black">
      <div className="text-7xl mb-6 flex justify-center text-black">{icon}</div>
      <p className="text-sm font-black uppercase tracking-[0.4em] text-black text-center leading-none">
        {text}
      </p>
    </div>
  );
}
