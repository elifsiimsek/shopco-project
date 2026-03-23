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
  FiAlertCircle,
  FiMapPin,
  FiCreditCard,
  FiCheck,
  FiZap,
  FiPackage,
  FiActivity,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth, type OrderItem } from "../context/AuthContext";
import { TURKEY_CITIES } from "../data/cities";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increase,
    decrease,
    setNotification,
    clearCart,
  } = useCart();
  const { user, addOrder, saveAddress, saveCard } = useAuth();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [promoInput, setPromoInput] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    size: string;
    color: string;
  } | null>(null);
  const [showDeletedToast, setShowDeletedToast] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    id: string;
    items: any[];
  } | null>(null);

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
  const deliveryFee = 15;
  const finalTotal = currentSubtotal - promoDiscount + deliveryFee;

  const handleApplyPromo = () => {
    if (promoInput.toUpperCase() === "SHOPCO20") {
      setIsPromoApplied(true);
      setPromoInput("");
      setNotification("SHOPCO20 Applied! ✨");
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      removeFromCart(deleteConfirm.id, deleteConfirm.size, deleteConfirm.color);
      setDeleteConfirm(null);
      setShowDeletedToast(true);
      setTimeout(() => setShowDeletedToast(false), 3000);
    }
  };

  const handleHolderChange = (val: string) => {
    const clean = val
      .replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, "")
      .replace(/\s\s+/g, " ");
    setCard({ ...card, holder: clean.toUpperCase() });
  };

  const handleFinalOrder = () => {
    if (!card.cvc || card.cvc.length < 3) {
      setNotification("Verify CVC ❌");
      return;
    }
    const orderId = `ORD-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    const orderItems: OrderItem[] = cart.map((item) => ({
      id: String(item.id),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      img: item.img,
      size: item.selectedSize,
      color: item.selectedColor,
    }));

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

    addOrder({
      id: orderId,
      date: new Date().toLocaleDateString(),
      total: finalTotal,
      itemsCount: cart.length,
      status: "Verified",
      items: orderItems,
    });
    setOrderSuccess({ id: orderId, items: [...cart] });
    clearCart();
  };

  if (cart.length === 0 && !orderSuccess)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-satoshi">
        <FiShoppingBag size={80} className="mb-6 opacity-5" />
        <h1 className="text-3xl font-[1000] uppercase italic">Bag Empty</h1>
        <Link
          to="/shop"
          className="bg-black text-white px-10 py-4 rounded-full font-black text-[11px] no-underline mt-4 shadow-xl"
        >
          Vault
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-satoshi text-black py-10 md:py-16 text-left selection:bg-black selection:text-white">
      {showDeletedToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-black text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 duration-500">
          <div className="bg-red-500 rounded-full p-1">
            <FiX size={12} strokeWidth={4} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Archive Updated
          </span>
        </div>
      )}

      <main className="max-w-[1240px] mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 mb-12">
          <FiActivity className="text-black/10 animate-pulse" size={24} />
          <h1 className="text-[36px] md:text-[52px] font-black uppercase m-0 text-black tracking-tighter">
            Your Cart
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="flex-1 w-full border border-black/[0.08] rounded-[20px] p-5 md:p-6 bg-white space-y-6">
            {cart.map((item, idx) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className={`flex gap-4 relative ${idx !== cart.length - 1 ? "border-b border-black/[0.08] pb-6" : ""}`}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 bg-[#F0EEED] rounded-xl overflow-hidden shrink-0">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 text-left relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[16px] md:text-[20px] font-bold m-0 leading-tight uppercase tracking-tighter">
                        {item.name}
                      </h4>
                      <p className="text-[12px] text-black/60 mt-1 uppercase font-bold">
                        Size:{" "}
                        <span className="text-black">{item.selectedSize}</span>{" "}
                        | Color:{" "}
                        <span className="text-black">
                          {item.selectedColor?.replace("bg-", "")}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({
                          id: String(item.id),
                          size: item.selectedSize || "",
                          color: item.selectedColor || "",
                        });
                      }}
                      className="text-shopRed bg-transparent border-none cursor-pointer p-2 hover:scale-110 transition-all relative z-50"
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <span className="text-xl md:text-2xl font-black tracking-tighter">
                        ${item.price}
                      </span>
                      {item.oldPrice && item.oldPrice > item.price && (
                        <div className="flex items-center gap-2">
                          <span className="text-black/20 line-through font-bold text-lg">
                            ${item.oldPrice}
                          </span>
                          <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded-full text-[10px] font-black italic">
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
                    <div className="flex items-center gap-6 bg-[#F0F0F0] px-5 py-2.5 rounded-full font-black relative z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          decrease(
                            String(item.id),
                            item.selectedSize,
                            item.selectedColor,
                          );
                        }}
                        className="border-none bg-transparent cursor-pointer opacity-40 hover:opacity-100 p-1 flex items-center justify-center"
                      >
                        <FiMinus strokeWidth={3} />
                      </button>
                      <span className="text-sm tabular-nums font-black select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          increase(
                            String(item.id),
                            item.selectedSize,
                            item.selectedColor,
                          );
                        }}
                        className="border-none bg-transparent cursor-pointer opacity-40 hover:opacity-100 p-1 flex items-center justify-center"
                      >
                        <FiPlus strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[450px] sticky top-10">
            <div className="bg-white border border-black/[0.08] p-8 rounded-[20px] shadow-sm space-y-6 text-left">
              <h2 className="text-2xl font-bold m-0 tracking-tight">
                Order Summary
              </h2>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-black/60 text-lg">
                  <span>Subtotal</span>
                  <span className="text-black font-bold">
                    ${currentSubtotal + productSavings}
                  </span>
                </div>

                {productSavings > 0 && (
                  <div className="flex justify-between items-center text-black/60 text-lg">
                    <span>Product Discount</span>
                    <span className="text-red-500 font-bold">
                      -${productSavings}
                    </span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between items-center text-black/60 text-lg">
                    <span>Promo Discount (-20%)</span>
                    <span className="text-red-500 font-bold">
                      -${promoDiscount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-black/60 text-lg">
                  <span>Delivery Fee</span>
                  <span className="text-black font-bold">${deliveryFee}</span>
                </div>

                <div className="h-[1px] bg-black/[0.08] my-1" />

                <div className="flex justify-between items-center pt-2 text-black text-xl font-bold">
                  <span>Total</span>
                  <span className="text-2xl font-black tracking-tight">
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
                    className="bg-transparent border-none outline-none text-[14px] w-full text-black font-bold"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-8 py-4 rounded-full font-black text-[14px] uppercase border-none bg-black text-white cursor-pointer hover:bg-neutral-800 transition-all"
                >
                  Apply
                </button>
              </div>
              <button
                onClick={() =>
                  !user ? navigate("/login") : setCheckoutStep("logistics")
                }
                className="w-full bg-black text-white py-6 rounded-full font-black text-sm flex items-center justify-center gap-3 border-none cursor-pointer shadow-xl hover:opacity-90"
              >
                Go to Checkout <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {deleteConfirm && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-[380px] rounded-[32px] p-10 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle size={32} />
            </div>
            <h3 className="text-xl font-[1000] uppercase italic mb-3">
              Remove Item?
            </h3>
            <p className="text-sm text-black/40 font-bold mb-8">
              This selection will be removed from your bag archive.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmDelete}
                className="w-full bg-black text-white py-4 rounded-full font-black text-[11px] uppercase border-none cursor-pointer shadow-lg hover:bg-neutral-800 transition-all"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-full bg-transparent text-black/30 py-4 rounded-full font-black text-[11px] uppercase border-none cursor-pointer hover:text-black"
              >
                Keep it
              </button>
            </div>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#FDFDFD] p-4 md:p-10 animate-in fade-in duration-700">
          <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-10">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl">
                  <FiCheck size={28} strokeWidth={3} />
                </div>
                <h2 className="text-[60px] md:text-[86px] font-[1000] uppercase italic tracking-tighter leading-[0.8] m-0">
                  Archive
                  <br />
                  <span className="text-black/5 not-italic font-serif">
                    Secured
                  </span>
                </h2>
                <div className="flex items-center gap-3 text-black/20 font-black uppercase tracking-[0.4em] text-[10px] pt-4">
                  <FiZap size={14} /> Verified Order: {orderSuccess.id}
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={() => navigate("/account")}
                  className="w-full max-w-[340px] bg-black text-white py-6 rounded-full font-black uppercase italic text-xs shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  View Collection <FiPackage />
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full max-w-[340px] text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors bg-transparent border-black/5 border py-4 rounded-full cursor-pointer"
                >
                  Return to Terminal
                </button>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-4 border-l border-black/5 pl-16">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-4">
                Secured Collection
              </p>
              <div className="grid grid-cols-2 gap-6">
                {orderSuccess.items.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="aspect-[3/4] bg-[#F5F5F5] rounded-[24px] overflow-hidden border border-black/5 shadow-sm">
                      <img
                        src={item.img}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black uppercase italic truncate max-w-[100px]">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-black text-black/20">
                        QTY: {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {checkoutStep === "logistics" && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left animate-in fade-in">
          <div className="bg-white w-full max-w-[500px] rounded-[45px] p-10 md:p-12 relative shadow-2xl">
            <button
              onClick={() => setCheckoutStep("cart")}
              className="absolute top-8 right-8 text-black/20 hover:text-black cursor-pointer bg-transparent border-none p-2"
            >
              <FiX size={28} />
            </button>
            <h3 className="text-3xl font-[1000] uppercase italic mb-8 flex items-center gap-3 font-satoshi">
              <FiMapPin className="text-black/10" /> Logistics
            </h3>
            {user?.addresses?.length ? (
              <div className="relative mb-6">
                <button
                  onClick={() => setShowAddrList(!showAddrList)}
                  className="w-full bg-[#FBFBFB] border-2 border-black/5 p-5 rounded-2xl flex justify-between items-center cursor-pointer transition-all hover:border-black/20"
                >
                  <span className="text-[11px] font-black uppercase text-black/40">
                    Linked Archives
                  </span>
                  <FiChevronDown
                    className={`transition-transform duration-300 ${showAddrList ? "rotate-180" : ""}`}
                  />
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
                        className="p-5 hover:bg-black/5 cursor-pointer border-b border-black/[0.03] transition-colors"
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
                  <option value="">CITY</option>
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
                placeholder="FULL ARCHIVE DETAILS"
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
                className="w-full bg-black text-white py-6 rounded-full font-black uppercase italic text-xs mt-4 border-none cursor-pointer shadow-xl transition-all hover:scale-[1.01]"
              >
                Proceed to Pay
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
              className="absolute top-8 right-8 text-black/20 hover:text-black cursor-pointer bg-transparent border-none p-2"
            >
              <FiX size={28} />
            </button>
            <h3 className="text-3xl font-[1000] uppercase italic mb-8 flex items-center gap-3 font-satoshi">
              <FiCreditCard className="text-black/10" /> Vault Pay
            </h3>
            {user?.savedCards?.length ? (
              <div className="relative mb-6">
                <button
                  onClick={() => setShowCardList(!showCardList)}
                  className="w-full bg-[#FBFBFB] border-2 border-black/5 p-5 rounded-2xl flex justify-between items-center cursor-pointer transition-all hover:border-black/20"
                >
                  <span className="text-[11px] font-black uppercase text-black/40">
                    Linked Vault Cards
                  </span>
                  <FiChevronDown
                    className={`transition-transform duration-300 ${showCardList ? "rotate-180" : ""}`}
                  />
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
                        className="p-5 hover:bg-black/5 cursor-pointer border-b border-black/[0.03] transition-colors text-left"
                      >
                        <p className="text-[11px] font-black m-0 italic">
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
                  className="bg-[#F5F5F5] p-5 rounded-2xl border-none outline-none font-black text-[12px] text-black font-satoshi"
                  value={card.expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length >= 2)
                      v =
                        v.substring(0, 2) +
                        (v.substring(2, 4) ? "/" + v.substring(2, 4) : "");
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
                  onChange={(e) =>
                    setCard({ ...card, cvc: e.target.value.replace(/\D/g, "") })
                  }
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
