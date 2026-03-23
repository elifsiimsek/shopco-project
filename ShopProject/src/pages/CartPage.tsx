import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowRight,
  FiShoppingBag,
  FiCheckCircle,
  FiTag,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth, type OrderItem } from "../context/AuthContext";
import { TURKEY_CITIES } from "../data/cities";

export default function CartPage() {
  const { cart, removeFromCart, addToCart, setNotification, clearCart } =
    useCart();
  const { user, addOrder, saveAddress, saveCard } = useAuth();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [promoInput, setPromoInput] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const [address, setAddress] = useState({
    title: "",
    city: "",
    district: "",
    full: "",
  });
  const [card, setCard] = useState({
    number: "",
    holder: "",
    expiry: "",
    cvc: "",
  });
  const [saveAddressDetails, setSaveAddressDetails] = useState(false);
  const [saveCardDetails, setSaveCardDetails] = useState(false);

  const [isSavedAddrUsed, setIsSavedAddrUsed] = useState(false);
  const [isSavedCardUsed, setIsSavedCardUsed] = useState(false);
  const [showAddrList, setShowAddrList] = useState(false);
  const [showCardList, setShowCardList] = useState(false);

  const currentSubtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const productSavings = cart.reduce((acc, item) => {
    if (item.oldPrice && item.oldPrice > item.price) {
      return acc + (item.oldPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  const promoDiscount = isPromoApplied ? Math.round(currentSubtotal * 0.2) : 0;
  const totalDiscount = productSavings + promoDiscount;
  const rawTotal = currentSubtotal + productSavings;
  const finalTotal = currentSubtotal - promoDiscount + 15;

  const handleApplyPromo = () => {
    if (promoInput.toUpperCase() === "SHOPCO20") {
      setIsPromoApplied(true);
      setPromoInput("");
      setNotification("SHOPCO20 Applied! ✨");
    }
  };

  const handleHolderChange = (val: string) => {
    const clean = val
      .replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, "")
      .replace(/\s\s+/g, " ");
    setCard({ ...card, holder: clean.toUpperCase() });
  };

  const handleCvcChange = (val: string) => {
    setCard({ ...card, cvc: val.replace(/\D/g, "").slice(0, 3) });
  };

  const handleFinalOrder = () => {
    if (!card.cvc || card.cvc.length < 3) {
      setNotification("Verify CVC (3 digits) ❌");
      return;
    }

    if (saveAddressDetails && !isSavedAddrUsed)
      saveAddress({
        title: address.title || "Home",
        city: address.city,
        district: address.district,
        fullAddress: address.full,
      });
    if (saveCardDetails && !isSavedCardUsed)
      saveCard({
        number: card.number,
        holder: card.holder,
        expiry: card.expiry,
      });

    const orderItems: OrderItem[] = cart.map((item) => ({
      id: String(item.id),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      img: item.img,
      size: item.selectedSize,
      color: item.selectedColor,
    }));

    addOrder({
      id: `ORD-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      date: new Date().toLocaleDateString(),
      total: finalTotal,
      itemsCount: cart.length,
      status: "Verified",
      items: orderItems,
    });

    clearCart();
    setNotification("Vault Archive Secured! 🚀");
    navigate("/");
  };

  if (cart.length === 0)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-satoshi">
        <FiShoppingBag size={80} className="mb-6 opacity-5" />
        <h1 className="text-3xl font-[1000] uppercase italic">Bag Empty</h1>
        <Link
          to="/shop"
          className="bg-black text-white px-10 py-4 rounded-full font-black text-[11px] no-underline mt-4"
        >
          Vault
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-satoshi text-black py-10 md:py-16 text-left">
      <main className="max-w-[1240px] mx-auto px-4 md:px-6">
        <h1 className="text-[36px] md:text-[52px] font-[1000] uppercase italic tracking-tighter mb-12 leading-none">
          Your Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full border border-black/5 rounded-[24px] p-4 md:p-8 bg-white shadow-sm">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-6 py-6 ${idx !== cart.length - 1 ? "border-b border-black/5" : ""}`}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 bg-[#F0EEED] rounded-xl overflow-hidden shrink-0">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 text-left">
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <h4 className="text-base md:text-xl font-[1000] uppercase italic m-0">
                        {item.name}
                      </h4>
                      <div className="mt-1 space-y-0.5">
                        <p className="text-[11px] font-bold text-black/40 uppercase">
                          Size:{" "}
                          <span className="text-black">
                            {item.selectedSize}
                          </span>
                        </p>
                        <p className="text-[11px] font-bold text-black/40 uppercase">
                          Color:{" "}
                          <span className="text-black">
                            {item.selectedColor?.replace("bg-", "")}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(
                          String(item.id),
                          item.selectedSize || "",
                          item.selectedColor || "",
                        )
                      }
                      className="text-shopRed bg-transparent border-none cursor-pointer"
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <span className="text-xl md:text-2xl font-[1000] italic">
                        ${item.price}
                      </span>
                      {item.oldPrice && item.oldPrice > item.price && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-black/20 line-through tracking-tighter">
                            ${item.oldPrice}
                          </span>
                          <span className="bg-shopRed/10 text-shopRed px-2 py-0.5 rounded-full text-[9px] font-[1000] italic">
                            -
                            {Math.round(
                              ((item.oldPrice - item.price) / item.oldPrice) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-6 bg-[#F0F0F0] px-5 py-2 rounded-full font-black">
                      <button
                        onClick={() =>
                          removeFromCart(
                            String(item.id),
                            item.selectedSize || "",
                            item.selectedColor || "",
                          )
                        }
                        className="border-none bg-transparent cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
                      >
                        <FiMinus />
                      </button>
                      <span className="text-sm tabular-nums font-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="border-none bg-transparent cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[450px] sticky top-10">
            <div className="bg-white border border-black/10 p-8 rounded-[25px] shadow-sm space-y-6">
              <h2 className="text-xl md:text-2xl font-[1000] uppercase italic text-left m-0">
                Order Summary
              </h2>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-black/60 text-lg">Subtotal</span>
                  <span className="text-black font-[1000] text-xl">
                    ${rawTotal}
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-black/60 text-lg">Discount</span>
                    <span className="text-shopRed font-[1000] text-xl">
                      -${totalDiscount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center border-b border-black/5 pb-5 text-black/60 text-lg">
                  <span>Delivery Fee</span>
                  <span className="text-black font-[1000] text-xl">$15</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-medium uppercase italic">
                    Total
                  </span>
                  <span className="text-3xl md:text-4xl font-[1000] tracking-tighter">
                    ${finalTotal}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center bg-[#F0F0F0] px-4 py-4 rounded-full border border-black/[0.03]">
                  <FiTag className="text-black/30 mr-2" />
                  <input
                    type="text"
                    placeholder="Add promo code"
                    className="bg-transparent border-none outline-none text-[14px] w-full text-black font-bold uppercase"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-10 py-4 rounded-full font-black text-[14px] uppercase border-none bg-black text-white cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <button
                onClick={() =>
                  !user ? navigate("/login") : setCheckoutStep("logistics")
                }
                className="w-full bg-black text-white py-6 rounded-full font-black text-sm flex items-center justify-center gap-3 border-none cursor-pointer shadow-xl"
              >
                Go to Checkout <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {checkoutStep === "logistics" && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white w-full max-w-[500px] rounded-[45px] p-12 relative shadow-2xl">
            <button
              onClick={() => setCheckoutStep("cart")}
              className="absolute top-10 right-10 text-black/20 hover:text-black cursor-pointer bg-transparent border-none"
            >
              <FiX size={28} />
            </button>
            <h3 className="text-3xl font-[1000] uppercase italic mb-8">
              Logistics
            </h3>
            {user?.addresses?.length ? (
              <div className="relative mb-6">
                <button
                  onClick={() => setShowAddrList(!showAddrList)}
                  className="w-full bg-[#FBFBFB] border-2 border-black/5 p-5 rounded-2xl flex justify-between items-center cursor-pointer transition-all"
                >
                  <span className="text-[11px] font-black uppercase text-black/40">
                    Linked Archives
                  </span>
                  <FiChevronDown className={showAddrList ? "rotate-180" : ""} />
                </button>
                {showAddrList && (
                  <div className="absolute top-full left-0 w-full bg-white border border-black/10 mt-2 rounded-2xl shadow-2xl z-20 max-h-[220px] overflow-y-auto">
                    {user.addresses.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setAddress({
                            title: a.title,
                            city: a.city,
                            district: a.district,
                            full: a.fullAddress,
                          });
                          setIsSavedAddrUsed(true);
                          setShowAddrList(false);
                        }}
                        className="p-5 hover:bg-black/5 cursor-pointer border-b border-black/[0.03] text-left"
                      >
                        <p className="text-[11px] font-black uppercase m-0">
                          {a.title}
                        </p>
                        <p className="text-[10px] font-bold text-black/30 m-0 uppercase mt-1">
                          {a.city} / {a.district}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="LABEL"
                className="w-full bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] uppercase text-black"
                value={address.title}
                onChange={(e) => {
                  setAddress({
                    ...address,
                    title: e.target.value.toUpperCase(),
                  });
                  setIsSavedAddrUsed(false);
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] uppercase cursor-pointer text-black"
                  value={address.city}
                  onChange={(e) => {
                    setAddress({ ...address, city: e.target.value });
                    setIsSavedAddrUsed(false);
                  }}
                >
                  {TURKEY_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="DISTRICT"
                  className="bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] uppercase text-black"
                  value={address.district}
                  onChange={(e) => {
                    setAddress({
                      ...address,
                      district: e.target.value
                        .toUpperCase()
                        .replace(/[^A-ZÇĞİÖŞÜ ]/gi, ""),
                    });
                    setIsSavedAddrUsed(false);
                  }}
                />
              </div>
              <textarea
                placeholder="FULL DETAILS"
                className="w-full bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] h-24 resize-none uppercase text-black"
                value={address.full}
                onChange={(e) => {
                  setAddress({
                    ...address,
                    full: e.target.value.toUpperCase(),
                  });
                  setIsSavedAddrUsed(false);
                }}
              />
              {!isSavedAddrUsed && (
                <label
                  className="flex items-center gap-3 cursor-pointer py-2 group"
                  onClick={() => setSaveAddressDetails(!saveAddressDetails)}
                >
                  <div
                    className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${saveAddressDetails ? "bg-black border-black" : "border-black/10 group-hover:border-black/30"}`}
                  >
                    {saveAddressDetails && (
                      <FiCheckCircle className="text-white text-xs" />
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase text-black/40 group-hover:text-black">
                    Secure Spec to Vault
                  </span>
                </label>
              )}
              <button
                onClick={() =>
                  address.city && address.full
                    ? setCheckoutStep("payment")
                    : null
                }
                className="w-full bg-black text-white py-6 rounded-full font-black uppercase italic text-xs mt-4 border-none cursor-pointer shadow-xl transition-all"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutStep === "payment" && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white w-full max-w-[500px] rounded-[45px] p-12 relative shadow-2xl">
            <button
              onClick={() => setCheckoutStep("logistics")}
              className="absolute top-10 right-10 text-black/20 hover:text-black cursor-pointer bg-transparent border-none"
            >
              <FiX size={28} />
            </button>
            <h3 className="text-3xl font-[1000] uppercase italic mb-8 text-black">
              Vault Pay
            </h3>
            {user?.savedCards?.length ? (
              <div className="relative mb-6">
                <button
                  onClick={() => setShowCardList(!showCardList)}
                  className="w-full bg-[#FBFBFB] border-2 border-black/5 p-5 rounded-2xl flex justify-between items-center cursor-pointer transition-all"
                >
                  <span className="text-[11px] font-black uppercase text-black/40">
                    Linked Vault Cards
                  </span>
                  <FiChevronDown className={showCardList ? "rotate-180" : ""} />
                </button>
                {showCardList && (
                  <div className="absolute top-full left-0 w-full bg-white border border-black/10 mt-2 rounded-2xl shadow-2xl z-20 max-h-[220px] overflow-y-auto">
                    {user.savedCards.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setCard({
                            number: c.number,
                            holder: c.holder,
                            expiry: c.expiry,
                            cvc: "",
                          });
                          setIsSavedCardUsed(true);
                          setShowCardList(false);
                        }}
                        className="p-5 hover:bg-black/5 cursor-pointer border-b border-black/[0.03] text-left"
                      >
                        <p className="text-[11px] font-black m-0 text-black italic">
                          **** **** **** {c.number.slice(-4)}
                        </p>
                        <p className="text-[10px] font-bold text-black/30 m-0 uppercase mt-1">
                          {c.holder}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="CARD NUMBER"
                maxLength={16}
                className="w-full bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] text-black"
                value={card.number}
                onChange={(e) => {
                  setCard({
                    ...card,
                    number: e.target.value.replace(/\D/g, ""),
                  });
                  setIsSavedCardUsed(false);
                }}
              />
              <input
                type="text"
                placeholder="HOLDER SIGNATURE"
                className="w-full bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] uppercase text-black"
                value={card.holder}
                onChange={(e) => {
                  handleHolderChange(e.target.value);
                  setIsSavedCardUsed(false);
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className="bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] text-black"
                  value={card.expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length >= 2) {
                      let m = parseInt(v.substring(0, 2));
                      if (m > 12) m = 12;
                      let y = v.substring(2, 4);
                      if (y.length === 2) {
                        const currentYear = new Date().getFullYear() % 100;
                        let yearInt = parseInt(y);
                        if (yearInt < currentYear) yearInt = currentYear;
                        if (yearInt > currentYear + 10)
                          yearInt = currentYear + 10;
                        y = yearInt.toString();
                      }
                      v = m.toString().padStart(2, "0") + (y ? "/" + y : "");
                    }
                    setCard({ ...card, expiry: v });
                    setIsSavedCardUsed(false);
                  }}
                />
                <input
                  type="text"
                  placeholder="CVC"
                  maxLength={3}
                  className="bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] text-black"
                  value={card.cvc}
                  onChange={(e) => handleCvcChange(e.target.value)}
                />
              </div>
              {!isSavedCardUsed && (
                <label
                  className="flex items-center gap-3 cursor-pointer py-2 group"
                  onClick={() => setSaveCardDetails(!saveCardDetails)}
                >
                  <div
                    className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${saveCardDetails ? "bg-black border-black" : "border-black/10 group-hover:border-black/30"}`}
                  >
                    {saveCardDetails && (
                      <FiCheckCircle className="text-white text-xs" />
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase text-black/40 group-hover:text-black">
                    Establish Payment to Vault
                  </span>
                </label>
              )}
              <button
                onClick={handleFinalOrder}
                className="w-full bg-black text-white py-6 rounded-full font-black uppercase italic text-xs mt-4 border-none cursor-pointer shadow-xl transition-all hover:scale-[1.01]"
              >
                Verify & Establish Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
