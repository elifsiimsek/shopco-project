import {
  FiX,
  FiMapPin,
  FiChevronDown,
  FiCreditCard,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
} from "react-icons/fi";
import { TURKEY_CITIES } from "../../data/cities";
import type {
  CartModalsProps,
  Address,
  PaymentCard,
} from "../../types/account";

export const CartModals = ({
  checkoutStep,
  setCheckoutStep,
  address,
  setAddress,
  card,
  setCard,
  user,
  showAddrList,
  setShowAddrList,
  showCardList,
  setShowCardList,
  setIsSavedAddrUsed,
  setIsSavedCardUsed,
  isSavedAddrUsed,
  isSavedCardUsed,
  saveAddressDetails,
  setSaveAddressDetails,
  saveCardDetails,
  setSaveCardDetails,
  handleFinalOrder,
  deleteConfirm,
  setDeleteConfirm,
  handleConfirmDelete,
}: CartModalsProps) => {
  
  const handleHolderInput = (val: string) => {
    const clean = val
      .replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, "")
      .replace(/\s\s+/g, " ");
    setCard({ ...card, holder: clean.toUpperCase() });
  };

  const handleExpiryInput = (val: string) => {
    let v = val.replace(/\D/g, "");
    if (v.length >= 2) {
      let month = parseInt(v.substring(0, 2));
      if (month > 12) month = 12;
      if (month === 0) month = 1;
      v = (month < 10 ? "0" + month : month) + v.substring(2, 4);
      v = v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
    }
    setCard({ ...card, expiry: v });
  };

  const validatePayment = () => {
    if (!card.number || card.number.length < 16)
      return alert("Check Card Number: Must be 16 digits.");
    if (!card.holder) return alert("Check Holder: Identity required.");
    if (!card.expiry || card.expiry.length < 5)
      return alert("Check Expiry: MM/YY format required.");
    if (!card.cvc || card.cvc.length < 3)
      return alert("Check CVC: Secure code required.");

    const [m, y] = card.expiry.split("/").map(Number);
    const currentYearShort = 26; 
    const currentMonth = 5;     

    if (y < currentYearShort || (y === currentYearShort && m < currentMonth)) {
      return alert("Invalid Expiry: Date has passed.");
    }

    handleFinalOrder();
  };

  return (
    <>
      {deleteConfirm && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-[380px] rounded-[32px] p-10 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black uppercase italic mb-3 text-black tracking-tighter">
              Purge from Bag?
            </h3>
            <p className="text-[11px] font-bold text-black/30 uppercase mb-8 leading-relaxed">
              This item will be removed from your current session.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 text-white py-4 rounded-full font-black uppercase text-[11px] tracking-widest hover:bg-red-700 transition-colors"
              >
                Yes, Purge
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-full bg-transparent text-black/30 py-4 rounded-full font-black uppercase text-[11px] hover:text-black transition-colors"
              >
                Retain Item
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutStep === "logistics" && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left animate-in fade-in">
          <div className="bg-white w-full max-w-[500px] rounded-[45px] p-10 md:p-12 relative shadow-2xl">
            <button
              onClick={() => setCheckoutStep("cart")}
              className="absolute top-8 right-8 text-black/20 hover:text-black cursor-pointer bg-transparent border-none p-2 transition-colors"
            >
              <FiX size={28} />
            </button>
            <h3 className="text-3xl font-[1000] uppercase italic mb-8 flex items-center gap-3 font-satoshi tracking-tighter">
              <FiMapPin className="text-black/10" /> Logistics
            </h3>

            {(user?.addresses?.length ?? 0) > 0 && (
              <div className="relative mb-6">
                <button
                  onClick={() => setShowAddrList(!showAddrList)}
                  className="w-full bg-[#FBFBFB] border-2 border-black/5 p-5 rounded-2xl flex justify-between items-center cursor-pointer hover:border-black/10 transition-all"
                >
                  <span className="text-[11px] font-black uppercase text-black/40 italic">
                    Access Linked Archives
                  </span>
                  <FiChevronDown className={`transition-transform duration-300 ${showAddrList ? "rotate-180" : ""}`} />
                </button>
                {showAddrList && (
                  <div className="absolute top-full left-0 w-full bg-white border border-black/10 mt-2 rounded-2xl shadow-2xl z-[60] max-h-[180px] overflow-y-auto">
                    {user?.addresses?.map((a: Address) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setAddress({ title: a.title, city: a.city, district: a.district, full: a.fullAddress });
                          setIsSavedAddrUsed(true);
                          setShowAddrList(false);
                        }}
                        className="p-5 hover:bg-black/5 cursor-pointer border-b border-black/[0.03] transition-colors"
                      >
                        <p className="text-[11px] font-black uppercase m-0">{a.title}</p>
                        <p className="text-[10px] font-bold text-black/30 m-0 uppercase mt-1">
                          {a.city} / {a.district}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="LABEL (E.G. RESIDENCE)"
                className="w-full bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] uppercase placeholder:text-black/20"
                value={address.title}
                onChange={(e) => {
                  setAddress({ ...address, title: e.target.value.toUpperCase() });
                  setIsSavedAddrUsed(false);
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] uppercase cursor-pointer appearance-none"
                  value={address.city}
                  onChange={(e) => {
                    setAddress({ ...address, city: e.target.value });
                    setIsSavedAddrUsed(false);
                  }}
                >
                  <option value="">SELECT CITY</option>
                  {TURKEY_CITIES.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="DISTRICT"
                  className="bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] uppercase"
                  value={address.district}
                  onChange={(e) => {
                    setAddress({ ...address, district: e.target.value.toUpperCase() });
                    setIsSavedAddrUsed(false);
                  }}
                />
              </div>
              <textarea
                placeholder="STREET / BLOCK / APARTMENT"
                className="w-full bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] h-24 resize-none uppercase"
                value={address.full}
                onChange={(e) => {
                  setAddress({ ...address, full: e.target.value.toUpperCase() });
                  setIsSavedAddrUsed(false);
                }}
              />

              {!isSavedAddrUsed && (
                <div 
                  className="flex items-center gap-3 cursor-pointer py-2 group"
                  onClick={() => setSaveAddressDetails(!saveAddressDetails)}
                >
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${saveAddressDetails ? "bg-black border-black" : "border-black/10 group-hover:border-black/30"}`}>
                    {saveAddressDetails && <FiCheckCircle className="text-white text-[12px]" />}
                  </div>
                  <span className="text-[10px] font-black uppercase text-black/40">Secure to Vault</span>
                </div>
              )}

              <button
                onClick={() => address.city && address.full ? setCheckoutStep("payment") : alert("Incomplete Logistics.")}
                className="w-full bg-black text-white py-6 rounded-full font-black uppercase italic text-xs mt-4 shadow-xl active:scale-95 transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutStep === "payment" && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left animate-in fade-in">
          <div className="bg-white w-full max-w-[500px] rounded-[45px] p-10 md:p-12 relative shadow-2xl">
            <button
              onClick={() => setCheckoutStep("logistics")}
              className="absolute top-8 right-8 text-black/20 hover:text-black cursor-pointer bg-transparent border-none p-2 transition-colors"
            >
              <FiX size={28} />
            </button>
            <h3 className="text-3xl font-[1000] uppercase italic mb-8 flex items-center gap-3 font-satoshi tracking-tighter">
              <FiCreditCard className="text-black/10" /> Vault Payment
            </h3>

            {(user?.savedCards?.length ?? 0) > 0 && (
              <div className="relative mb-6">
                <button
                  onClick={() => setShowCardList(!showCardList)}
                  className="w-full bg-[#FBFBFB] border-2 border-black/5 p-5 rounded-2xl flex justify-between items-center cursor-pointer hover:border-black/10 transition-all"
                >
                  <span className="text-[11px] font-black uppercase text-black/40 italic">Linked Vault Cards</span>
                  <FiChevronDown className={`transition-transform duration-300 ${showCardList ? "rotate-180" : ""}`} />
                </button>
                {showCardList && (
                  <div className="absolute top-full left-0 w-full bg-white border border-black/10 mt-2 rounded-2xl shadow-2xl z-[60] max-h-[180px] overflow-y-auto">
                    {user?.savedCards?.map((c: PaymentCard) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setCard({ number: c.number, holder: c.holder, expiry: c.expiry, cvc: "" });
                          setIsSavedCardUsed(true);
                          setShowCardList(false);
                        }}
                        className="p-5 hover:bg-black/5 cursor-pointer border-b border-black/[0.03]"
                      >
                        <p className="text-[11px] font-black m-0">**** **** **** {c.number.slice(-4)}</p>
                        <p className="text-[10px] font-bold text-black/30 m-0 uppercase mt-1 italic">{c.holder}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="CARD NUMBER"
                  maxLength={16}
                  className="w-full bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] tracking-widest"
                  value={card.number}
                  onChange={(e) => {
                    setCard({ ...card, number: e.target.value.replace(/\D/g, "") });
                    setIsSavedCardUsed(false);
                  }}
                />
                <FiLock className="absolute right-5 top-1/2 -translate-y-1/2 text-black/10" />
              </div>
              <input
                type="text"
                placeholder="CARDHOLDER NAME"
                className="w-full bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] uppercase"
                value={card.holder}
                onChange={(e) => {
                  handleHolderInput(e.target.value);
                  setIsSavedCardUsed(false);
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className="bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px]"
                  value={card.expiry}
                  onChange={(e) => {
                    handleExpiryInput(e.target.value);
                    setIsSavedCardUsed(false);
                  }}
                />
                <input
                  type="password"
                  placeholder="CVC"
                  maxLength={3}
                  className="bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px]"
                  value={card.cvc}
                  onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "") })}
                />
              </div>

              {!isSavedCardUsed && (
                <div 
                  className="flex items-center gap-3 cursor-pointer py-2 group"
                  onClick={() => setSaveCardDetails(!saveCardDetails)}
                >
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${saveCardDetails ? "bg-black border-black" : "border-black/10 group-hover:border-black/30"}`}>
                    {saveCardDetails && <FiCheckCircle className="text-white text-[12px]" />}
                  </div>
                  <span className="text-[10px] font-black uppercase text-black/40">Secure Card to Vault</span>
                </div>
              )}

              <button
                onClick={validatePayment}
                className="w-full bg-black text-white py-6 rounded-full font-black uppercase italic text-xs mt-4 shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Establish Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};