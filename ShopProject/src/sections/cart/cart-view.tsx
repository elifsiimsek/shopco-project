import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiActivity,
  FiCheck,
  FiZap,
  FiPackage,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import type { CartItem } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import type { OrderItem } from "../../context/AuthContext";
import { CartItemList } from "./cart-item-list";
import { CartSummary } from "./cart-summary";
import { CartModals } from "./cart-modals";
import type { DeleteConfirm } from "../../types/account";

export default function CartView() {
  const { cart, removeFromCart, increase, decrease, clearCart } = useCart();
  const { user, addOrder, saveAddress, saveCard } = useAuth();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState<string>("cart");
  const [promoInput, setPromoInput] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<CartItem | null>(null);

  const [orderSuccess, setOrderSuccess] = useState<{
    id: string;
    items: CartItem[];
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
  const productSavings = cart.reduce(
    (acc, item) =>
      item.oldPrice && item.oldPrice > item.price
        ? acc + (item.oldPrice - item.price) * item.quantity
        : acc,
    0,
  );
  const promoDiscount = isPromoApplied ? Math.round(currentSubtotal * 0.2) : 0;
  const finalTotal = currentSubtotal - promoDiscount + 15;

  const handleFinalOrder = () => {
    const orderId = `ORD-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    const orderItems: OrderItem[] = cart.map((item) => ({
      id: String(item.id),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      img: item.img,
      size: item.selectedSize || "",
      color: item.selectedColor || "",
    }));

    if (saveAddressDetails && !isSavedAddrUsed) {
      saveAddress({
        title: address.title || "Home",
        city: address.city,
        district: address.district,
        fullAddress: address.full,
      });
    }
    if (saveCardDetails && !isSavedCardUsed) {
      saveCard({
        number: card.number,
        holder: card.holder,
        expiry: card.expiry,
      });
    }

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
    setCheckoutStep("cart");
  };

  if (cart.length === 0 && !orderSuccess)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <FiShoppingBag size={80} className="mb-6 opacity-5" />
        <h1 className="text-3xl font-[1000] uppercase italic text-black">
          Bag Empty
        </h1>
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
      <main className="max-w-[1240px] mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 mb-12">
          <FiActivity className="text-black/10 animate-pulse" size={24} />
          <h1 className="text-[36px] md:text-[52px] font-black uppercase m-0 tracking-tighter leading-none">
            Your Cart
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <CartItemList
            items={cart}
            onDecrease={decrease}
            onIncrease={increase}
            onRemove={setDeleteConfirm}
          />
          <CartSummary
            subtotal={currentSubtotal}
            savings={productSavings}
            discount={promoDiscount}
            total={finalTotal}
            promoInput={promoInput}
            setPromoInput={setPromoInput}
            onApply={() =>
              promoInput.toUpperCase() === "SHOPCO20" && setIsPromoApplied(true)
            }
            onCheckout={() =>
              !user ? navigate("/login") : setCheckoutStep("logistics")
            }
          />
        </div>
      </main>

      <CartModals
        checkoutStep={checkoutStep}
        setCheckoutStep={setCheckoutStep}
        address={address}
        setAddress={setAddress}
        card={card}
        setCard={setCard}
        user={user}
        showAddrList={showAddrList}
        setShowAddrList={setShowAddrList}
        showCardList={showCardList}
        setShowCardList={setShowCardList}
        setIsSavedAddrUsed={setIsSavedAddrUsed}
        setIsSavedCardUsed={setIsSavedCardUsed}
        isSavedAddrUsed={isSavedAddrUsed}
        isSavedCardUsed={isSavedCardUsed}
        saveAddressDetails={saveAddressDetails}
        setSaveAddressDetails={setSaveAddressDetails}
        saveCardDetails={saveCardDetails}
        setSaveCardDetails={setSaveCardDetails}
        handleFinalOrder={handleFinalOrder}
        deleteConfirm={
          deleteConfirm
            ? { id: String(deleteConfirm.id), type: "cart-item" }
            : null
        }
        setDeleteConfirm={(val: DeleteConfirm | null) =>
          val === null && setDeleteConfirm(null)
        }
        handleConfirmDelete={() => {
          if (deleteConfirm) {
            removeFromCart(
              String(deleteConfirm.id),
              deleteConfirm.selectedSize || "",
              deleteConfirm.selectedColor || "",
            );
            setDeleteConfirm(null);
          }
        }}
      />

      {orderSuccess && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#FDFDFD] p-4 md:p-10 animate-in fade-in duration-700">
          <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-10">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl">
                  <FiCheck size={28} strokeWidth={3} />
                </div>
                <h2 className="text-[60px] md:text-[86px] font-[1000] uppercase italic leading-[0.8] m-0 text-black">
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
                  className="w-full max-w-[340px] text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black border-black/5 border py-4 rounded-full cursor-pointer transition-colors bg-transparent"
                >
                  Return to Terminal
                </button>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-4 border-l border-black/5 pl-16">
              <div className="grid grid-cols-2 gap-6">
                {orderSuccess.items.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="aspect-[3/4] bg-[#F5F5F5] rounded-[24px] overflow-hidden border border-black/5 shadow-sm">
                      <img
                        src={item.img}
                        className="w-full h-full object-cover"
                        alt={item.name}
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
    </div>
  );
}
