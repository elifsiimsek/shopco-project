import { FiTag, FiArrowRight, FiAlertCircle } from "react-icons/fi";

interface CartSummaryProps {
  subtotal: number;
  savings: number;
  discount: number;
  total: number;
  promoInput: string;
  setPromoInput: (val: string) => void;
  onApply: () => void;
  onCheckout: () => void;
  promoError?: string;
}

export const CartSummary = ({
  subtotal,
  savings,
  discount,
  total,
  promoInput,
  setPromoInput,
  onApply,
  onCheckout,
  promoError,
}: CartSummaryProps) => {
  const deliveryFee = total > 500 || total === 0 ? 0 : 15;
  const finalTotal = total + (total > 0 ? deliveryFee : 0);

  const freeShippingThreshold = 500;
  const awayFromFreeShipping = freeShippingThreshold - total;

  return (
    <div className="w-full lg:w-[450px] sticky top-10">
      <div className="bg-white border border-black/[0.08] p-8 rounded-[32px] shadow-sm space-y-6 text-left">
        <h2 className="text-2xl font-[600] tracking-tighter m-0">
          Order Summary
        </h2>

        {total > 0 && total < freeShippingThreshold && (
          <div className="bg-shopGray-light p-4 rounded-2xl space-y-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/40">
              Add <span className="text-black">${awayFromFreeShipping}</span>{" "}
              more for <span className="text-shopGreen">Free Shipping</span>
            </p>
            <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${(total / freeShippingThreshold) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center text-black/60 text-lg font-medium">
            <span>Subtotal</span>
            <span className="text-black font-bold">
              ${(subtotal + savings).toLocaleString()}
            </span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between items-center text-black/60 text-lg font-medium">
              <span>Product Discount</span>
              <span className="text-shopRed font-bold">
                -${savings.toLocaleString()}
              </span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between items-center text-black/60 text-lg font-medium">
              <span>Promo Discount (-20%)</span>
              <span className="text-shopRed font-bold">
                -${discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-black/60 text-lg font-medium">
            <span>Delivery Fee</span>
            <span className="text-black font-bold">
              {deliveryFee === 0 ? (
                <span className="text-shopGreen">FREE</span>
              ) : (
                `$${deliveryFee}`
              )}
            </span>
          </div>

          <div className="h-[1px] bg-black/[0.08] my-1" />

          <div className="flex justify-between items-center pt-2 text-black">
            <span className="font-black tracking-tighter">
              Total
            </span>
            <span className="text-3xl font-[1000] tracking-tighter">
              ${finalTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-3">
            <div
              className={`flex-1 flex items-center bg-[#F0F0F0] px-4 py-4 rounded-full border transition-all ${promoError ? "border-red-500/50" : "border-black/[0.03] focus-within:border-black/20"}`}
            >
              <FiTag
                className={`mr-2 ${promoError ? "text-red-500" : "text-black/30"}`}
              />
              <input
                type="text"
                placeholder="Add promo code"
                className="bg-transparent border-none outline-none text-[14px] w-full text-black font-black tracking-widest placeholder:text-black/20"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              />
            </div>
            <button
              onClick={onApply}
              className="px-8 py-4 rounded-full font-[700] text-[12px] bg-black text-white cursor-pointer hover:bg-neutral-800 transition-all active:scale-95"
            >
              Apply
            </button>
          </div>
          {promoError && (
            <p className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1 pl-4">
              <FiAlertCircle /> {promoError}
            </p>
          )}
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-black text-white py-6 rounded-full font-[700] text-sm flex items-center justify-center gap-5 border-none cursor-pointer shadow-xl hover:opacity-90 transition-all active:scale-[0.98] group"
        >
          Go to Checkout
          <FiArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};
