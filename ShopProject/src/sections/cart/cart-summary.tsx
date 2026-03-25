import { FiTag, FiArrowRight } from "react-icons/fi";

interface CartSummaryProps {
  subtotal: number;
  savings: number;
  discount: number;
  total: number;
  promoInput: string;
  setPromoInput: (val: string) => void;
  onApply: () => void;
  onCheckout: () => void;
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
}: CartSummaryProps) => (
  <div className="w-full lg:w-[450px] sticky top-10">
    <div className="bg-white border border-black/[0.08] p-8 rounded-[20px] shadow-sm space-y-6 text-left">
      <h2 className="text-2xl font-bold m-0 tracking-tight">Order Summary</h2>
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center text-black/60 text-lg">
          <span>Subtotal</span>
          <span className="text-black font-bold">${subtotal + savings}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between items-center text-black/60 text-lg">
            <span>Product Discount</span>
            <span className="text-red-500 font-bold">-${savings}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between items-center text-black/60 text-lg">
            <span>Promo Discount (-20%)</span>
            <span className="text-red-500 font-bold">-${discount}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-black/60 text-lg">
          <span>Delivery Fee</span>
          <span className="text-black font-bold">$15</span>
        </div>
        <div className="h-[1px] bg-black/[0.08] my-1" />
        <div className="flex justify-between items-center pt-2 text-black text-xl font-bold">
          <span>Total</span>
          <span className="text-2xl font-black tracking-tight">${total}</span>
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
          onClick={onApply}
          className="px-8 py-4 rounded-full font-black text-[14px] uppercase bg-black text-white cursor-pointer hover:bg-neutral-800 transition-all"
        >
          Apply
        </button>
      </div>
      <button
        onClick={onCheckout}
        className="w-full bg-black text-white py-6 rounded-full font-black text-sm flex items-center justify-center gap-3 border-none cursor-pointer shadow-xl hover:opacity-90 transition-all"
      >
        Go to Checkout <FiArrowRight size={18} />
      </button>
    </div>
  </div>
);
