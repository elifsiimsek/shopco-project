import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiChevronRight,
  FiTag,
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiX,
  FiShoppingBag,
  FiCheckCircle,
  FiCreditCard,
  FiMapPin,
  FiShield,
  FiGift,
} from "react-icons/fi";
import { useCart, type CartItem } from "../context/CartContext";
import { useAuth, type Order } from "../context/AuthContext";
import Button from "../components/ui/Button";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increase,
    decrease,
    clearCart,
    setNotification,
  } = useCart();
  const { user, addOrder, saveCard, saveAddress, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveAddressCheck, setSaveAddressCheck] = useState(false);
  const [saveCardCheck, setSaveCardCheck] = useState(false);
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    title: "",
    city: "",
    district: "",
    fullAddress: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const [promoCode, setPromoCode] = useState("");
  const [activePromoDiscount, setActivePromoDiscount] = useState(0);

  const subtotal = cart.reduce(
    (acc: number, item: CartItem) =>
      acc +
      (item.oldPrice ? Number(item.oldPrice) : item.price) * item.quantity,
    0,
  );
  const productSavings = cart.reduce(
    (acc: number, item: CartItem) =>
      acc +
      (item.oldPrice
        ? (Number(item.oldPrice) - item.price) * item.quantity
        : 0),
    0,
  );
  const promoDiscountAmount = (subtotal - productSavings) * activePromoDiscount;
  const total =
    subtotal - productSavings - promoDiscountAmount + (subtotal > 0 ? 15 : 0);

  const applyPromoCode = (code: string) => {
    const inputCode = code.toUpperCase();
    if (inputCode === "WELCOME25" && user?.hasWelcomeCoupon) {
      setActivePromoDiscount(0.25);
      setNotification("25% Welcome Discount Applied! 🎉");
      setPromoCode("");
    } else if (inputCode === "SHOPCO20") {
      setActivePromoDiscount(0.2);
      setNotification("20% Promo Applied! 🏷️");
      setPromoCode("");
    } else {
      setNotification("Invalid promo code. ❌");
    }
  };

  const toggleSavedAddress = () => {
    if (user?.address) {
      if (!useSavedAddress) {
        setFormData({
          ...formData,
          fullAddress: user.address.fullAddress,
          city: user.address.city,
          district: user.address.district,
          title: user.address.title,
        });
        setUseSavedAddress(true);
      } else {
        setFormData({
          ...formData,
          fullAddress: "",
          city: "",
          district: "",
          title: "",
        });
        setUseSavedAddress(false);
      }
    }
  };

  const toggleSavedCard = () => {
    if (user?.savedCard) {
      if (!useSavedCard) {
        setFormData({
          ...formData,
          fullName: user.savedCard.holder,
          cardNumber: user.savedCard.number,
          expiryDate: user.savedCard.expiry,
          cvc: "***",
        });
        setUseSavedCard(true);
      } else {
        setFormData({ ...formData, cardNumber: "", expiryDate: "", cvc: "" });
        setUseSavedCard(false);
      }
    }
  };

  const handleNextStep = () => {
    if (!formData.fullAddress || !formData.city) {
      setNotification("Address detail required. 📍");
      return;
    }
    if (saveAddressCheck && !useSavedAddress) {
      saveAddress({
        title: formData.title || "Vault Shipping",
        city: formData.city,
        district: formData.district,
        fullAddress: formData.fullAddress,
      });
    }
    setCheckoutStep(2);
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      setNotification("Login required for checkout. 🔐");
      navigate("/login");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (saveCardCheck && !useSavedCard) {
      saveCard({
        number: formData.cardNumber,
        holder: formData.fullName,
        expiry: formData.expiryDate,
      });
    }

    const newOrder: Order = {
      id: "#" + Math.floor(10000 + Math.random() * 90000).toString(),
      date: new Date().toLocaleDateString("tr-TR"),
      total: Math.round(total),
      itemsCount: cart.length,
      status: "Confirmed",
      items: [...cart],
    };

    setTimeout(() => {
      if (activePromoDiscount === 0.25)
        updateProfile({ hasWelcomeCoupon: false });
      setIsLoading(false);
      setIsOrderSuccess(true);
      addOrder(newOrder);
      setTimeout(() => {
        setIsOrderSuccess(false);
        clearCart();
        setIsCheckoutOpen(false);
        setCheckoutStep(1);
      }, 3500);
    }, 1500);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 font-satoshi text-left text-black min-h-screen relative selection:bg-shopBlack selection:text-white">
      {isOrderSuccess && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-white/95 backdrop-blur-3xl animate-in fade-in">
          <div className="flex flex-col items-center space-y-8 text-center text-black">
            <div className="w-32 h-32 bg-shopBlack rounded-[40px] flex items-center justify-center shadow-2xl animate-bounce">
              <FiShoppingBag size={48} className="text-white" />
            </div>
            <h2 className="text-[40px] font-[1000] uppercase italic tracking-tighter">
              Confirmed
            </h2>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30">
              Order drop secured.
            </p>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-[420px] rounded-[48px] p-10 relative shadow-2xl animate-fade-in-up text-left">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-8 right-8 text-black/10 hover:text-black border-none bg-transparent cursor-pointer transition-colors"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-8 text-black">
              {checkoutStep === 1 ? "Shipping" : "Payment"}
            </h2>

            {checkoutStep === 1 ? (
              <div className="space-y-4">
                {user?.address && (
                  <div
                    onClick={toggleSavedAddress}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${useSavedAddress ? "border-shopBlack bg-shopGray-light" : "border-shopGray-border bg-white"}`}
                  >
                    <FiMapPin
                      className={
                        useSavedAddress ? "text-shopBlack" : "text-black/20"
                      }
                    />
                    <div className="flex-1 text-[11px] font-bold opacity-40 italic text-black truncate">
                      {user.address.title}: {user.address.city}
                    </div>
                    {useSavedAddress && (
                      <FiCheckCircle size={14} className="text-shopBlack" />
                    )}
                  </div>
                )}
                <div
                  className={`space-y-3 ${useSavedAddress ? "opacity-20 pointer-events-none" : ""}`}
                >
                  <input
                    type="text"
                    placeholder="ADDRESS TITLE"
                    className="w-full bg-shopGray-light p-4 rounded-xl outline-none font-black text-[10px] border-none text-black"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value.toUpperCase(),
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="CITY"
                      className="bg-shopGray-light p-4 rounded-xl outline-none font-black text-[10px] border-none text-black"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          city: e.target.value.toUpperCase(),
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="DISTRICT"
                      className="bg-shopGray-light p-4 rounded-xl outline-none font-black text-[10px] border-none text-black"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          district: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <textarea
                    placeholder="FULL DETAILS"
                    className="w-full bg-shopGray-light p-4 rounded-xl outline-none font-black text-[10px] border-none h-24 resize-none text-black"
                    value={formData.fullAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullAddress: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                {!useSavedAddress && (
                  <div
                    className="flex items-center gap-3 px-1 cursor-pointer"
                    onClick={() => setSaveAddressCheck(!saveAddressCheck)}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${saveAddressCheck ? "bg-black border-black" : "border-black/10"}`}
                    >
                      {saveAddressCheck && (
                        <FiCheckCircle className="text-white text-xs" />
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase opacity-40 text-black">
                      Link Identity Adress
                    </span>
                  </div>
                )}
                <Button
                  onClick={handleNextStep}
                  className="w-full py-5 bg-shopBlack text-white rounded-full font-black text-xs uppercase border-none shadow-xl"
                >
                  Continue to Pay
                </Button>
              </div>
            ) : (
              <form onSubmit={handleOrderComplete} className="space-y-6">
                <div className="bg-neutral-900 p-8 rounded-[35px] text-white aspect-[1.7/1] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-start z-10 text-white">
                    <div className="w-12 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md opacity-80" />
                    <FiShield size={24} className="opacity-20 text-white" />
                  </div>
                  <p className="text-xl tracking-[0.25em] font-bold z-10 text-white leading-none text-left drop-shadow-md">
                    {formData.cardNumber
                      ? formData.cardNumber.replace(/(.{4})/g, "$1 ").trim()
                      : "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex justify-between items-end z-10 border-t border-white/10 pt-4">
                    <div className="flex flex-col text-left">
                      <span className="text-[7px] font-black opacity-30 uppercase text-white text-left">
                        Holder
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px] text-white">
                        {formData.fullName || "NAME SURNAME"}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[7px] font-black opacity-30 uppercase text-white">
                        Expiry
                      </span>
                      <p className="text-[10px] font-black uppercase tracking-widest m-0 leading-none text-white">
                        {formData.expiryDate || "MM/YY"}
                      </p>
                    </div>
                  </div>
                </div>
                {user?.savedCard && (
                  <div
                    onClick={toggleSavedCard}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${useSavedCard ? "border-shopBlack bg-shopGray-light" : "border-shopGray-border bg-white"}`}
                  >
                    <FiCreditCard
                      className={
                        useSavedCard ? "text-shopBlack" : "text-black/20"
                      }
                    />
                    <div className="flex-1 text-[11px] font-bold opacity-40 text-black text-left">
                      •••• {user.savedCard.number.slice(-4)}
                    </div>
                    {useSavedCard && (
                      <FiCheckCircle size={14} className="text-shopBlack" />
                    )}
                  </div>
                )}
                <div
                  className={`grid grid-cols-2 gap-3 ${useSavedCard ? "opacity-20 pointer-events-none" : ""}`}
                >
                  <input
                    type="text"
                    placeholder="CARD NUMBER"
                    maxLength={16}
                    className="col-span-2 bg-shopGray-light p-4 rounded-xl outline-none font-black text-[10px] border-none text-black"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="bg-shopGray-light p-4 rounded-xl outline-none font-black text-[10px] border-none text-black"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "");
                      // 🛡️ AY SINIRI (MAX 12)
                      if (v.length >= 2) {
                        let month = parseInt(v.substring(0, 2));
                        if (month > 12) month = 12;
                        else if (month === 0) month = 1;
                        v =
                          month.toString().padStart(2, "0") + v.substring(2, 4);
                        v = v.substring(0, 2) + "/" + v.substring(2, 4);
                      }
                      setFormData({ ...formData, expiryDate: v });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    maxLength={3}
                    className="bg-shopGray-light p-4 rounded-xl outline-none font-black text-[10px] border-none text-black"
                    value={formData.cvc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cvc: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
                {!useSavedCard && (
                  <div
                    className="flex items-center gap-3 px-1 cursor-pointer"
                    onClick={() => setSaveCardCheck(!saveCardCheck)}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${saveCardCheck ? "bg-black border-black" : "border-black/10"}`}
                    >
                      {saveCardCheck && (
                        <FiCheckCircle className="text-white text-xs" />
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase opacity-40 text-black text-left">
                      Establish Card
                    </span>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-shopBlack text-white rounded-full font-black text-xs uppercase border-none shadow-xl hover:scale-[1.02] transition-all"
                >
                  {isLoading ? "Validating..." : `Confirm drop`}
                </Button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep(1)}
                  className="w-full text-[9px] font-black uppercase opacity-20 border-none bg-transparent cursor-pointer text-black"
                >
                  Back
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-12">
        <Link
          to="/"
          className="hover:text-black transition-colors no-underline text-black/20 text-left"
        >
          Home
        </Link>
        <FiChevronRight size={12} />{" "}
        <span className="text-black italic">Bag</span>
      </nav>

      <h1 className="text-[40px] md:text-[50px] font-[900] uppercase tracking-tighter mb-16 italic text-left text-black leading-none">
        Your Bag
      </h1>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in-up">
          <div className="lg:col-span-7 space-y-6 text-left">
            {user?.hasWelcomeCoupon && (
              <div className="bg-black text-white p-8 rounded-[40px] flex justify-between items-center relative overflow-hidden group shadow-2xl animate-in zoom-in-95 text-left">
                <div className="relative z-10 text-left text-white">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-shopRed">
                    New Member Perk
                  </span>
                  <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter mt-1 text-white">
                    25% Welcome Voucher
                  </h3>
                  <button
                    onClick={() => applyPromoCode("WELCOME25")}
                    className="mt-4 bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase hover:scale-105 transition-all cursor-pointer border-none shadow-xl"
                  >
                    Apply Now
                  </button>
                </div>
                <FiGift
                  size={100}
                  className="absolute -right-4 -bottom-4 text-white/5 rotate-12 group-hover:scale-110 transition-transform"
                />
              </div>
            )}
            <div className="border border-shopGray-border rounded-[40px] bg-shopGray-muted/50 p-2 text-left">
              {cart.map((item: CartItem, index: number) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex gap-6 p-6 md:p-8 rounded-[32px] transition-all hover:bg-white mb-2 border-b border-shopGray-border/5 text-left"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-shopGray-light rounded-[24px] overflow-hidden shrink-0">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 relative text-left">
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id.toString(),
                          item.selectedSize,
                          item.selectedColor,
                        )
                      }
                      className="absolute top-0 right-0 p-2 text-black/10 hover:text-shopRed bg-transparent border-none cursor-pointer transition-colors text-black"
                    >
                      <FiTrash2 size={20} />
                    </button>
                    <div>
                      <h3 className="font-[1000] text-base md:text-lg uppercase italic tracking-tight mb-2 leading-none text-black text-left pr-8">
                        {item.name}
                      </h3>
                      <p className="text-[9px] font-black uppercase tracking-widest text-black/30 italic text-left text-black">
                        Size: {item.selectedSize || "Standard"}
                      </p>
                    </div>
                    <div className="flex justify-between items-end text-left text-black ">
                      <div className="flex flex-col text-left text-black">
                        <span className="text-xl font-[1000] tracking-tighter italic text-black leading-none">
                          ${item.price}
                        </span>
                        {item.oldPrice && (
                          <span className="text-black/20 line-through text-[12px] font-black italic mt-1 text-black leading-none">
                            ${item.oldPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 bg-black/[0.03] px-5 py-2 rounded-full font-black text-black">
                        <button
                          onClick={() =>
                            decrease(
                              item.id.toString(),
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          className="bg-transparent border-none cursor-pointer opacity-30 hover:opacity-100 text-black"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="text-[10px] font-black tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            increase(
                              item.id.toString(),
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          className="bg-transparent border-none cursor-pointer opacity-30 hover:opacity-100 text-black"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 text-black text-left">
            <div className="border border-shopGray-border rounded-[48px] p-10 bg-white shadow-2xl sticky top-32 text-black text-left">
              <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-10 text-black text-left leading-none">
                Summary
              </h2>
              <div className="space-y-5 border-b border-shopGray-border pb-10 text-black text-left">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-black/30 text-left text-black">
                  <span>Subtotal</span>
                  <span className="text-black font-[1000] tracking-tighter text-base">
                    ${subtotal}
                  </span>
                </div>
                {productSavings > 0 && (
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-shopRed italic text-left">
                    <span>Archive Discount</span>
                    <span className="font-[1000] tracking-tighter text-base">
                      -${Math.round(productSavings)}
                    </span>
                  </div>
                )}
                {activePromoDiscount > 0 && (
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-shopRed italic text-left">
                    <span>Active Discount</span>
                    <span className="font-[1000] tracking-tighter text-base">
                      -${Math.round(promoDiscountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-black/30 text-left text-black">
                  <span>Delivery</span>
                  <span className="text-black font-[1000] tracking-tighter text-base">
                    $15
                  </span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-shopGray-border text-left">
                  <span className="text-xl font-[1000] uppercase italic tracking-tighter text-black text-left leading-none">
                    Total
                  </span>
                  <span className="text-4xl font-[1000] tracking-tighter italic text-black leading-none">
                    ${Math.round(total)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <div className="flex-1 relative group text-left">
                  <FiTag className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-shopBlack" />
                  <input
                    type="text"
                    placeholder="PROMO"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full bg-shopGray-light py-5 px-14 rounded-full outline-none font-black text-[10px] border-none text-black placeholder:text-black/20"
                  />
                </div>
                <button
                  onClick={() => applyPromoCode(promoCode)}
                  className="bg-shopBlack text-white px-8 py-5 rounded-full font-black text-[10px] uppercase border-none cursor-pointer hover:scale-105 transition-all leading-none shadow-xl"
                >
                  Apply
                </button>
              </div>
              <Button
                onClick={handleProceedToCheckout}
                className="w-full mt-8 py-6 bg-shopBlack text-white rounded-full font-black uppercase italic text-sm border-none shadow-xl hover:scale-[1.02] transition-all"
              >
                Go to Checkout
                <FiArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-40 animate-fade-in-up text-black flex flex-col items-center">
          <FiShoppingCart
            size={100}
            className="mx-auto opacity-5 mb-10 text-black"
          />
          <h2 className="text-[40px] font-[1000] uppercase italic tracking-tighter text-black/10 mb-10 text-center leading-none">
            Vault Empty.
          </h2>
          <Link to="/shop" className="no-underline">
            <Button className="px-20 py-6 bg-shopBlack text-white rounded-full font-black uppercase italic tracking-widest text-xs border-none shadow-xl hover:scale-110 transition-all">
              Start Shopping
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
