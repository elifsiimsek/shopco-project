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
}: CartSummaryProps) => {
  const deliveryFee = total > 1000 || total === 0 ? 0 : 15;
  const finalTotal = total + (total > 0 ? deliveryFee : 0);

  return (
    <div className="w-full lg:w-[450px] sticky top-10">
      <div className="bg-white border border-black/[0.08] p-8 rounded-[32px] shadow-sm space-y-6 text-left">
        <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">Order Summary</h2>
        
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center text-black/60 text-lg font-medium">
            <span>Subtotal</span>
            <span className="text-black font-bold">${(subtotal + savings).toLocaleString()}</span>
          </div>
          
          {savings > 0 && (
            <div className="flex justify-between items-center text-black/60 text-lg font-medium">
              <span>Product Discount</span>
              <span className="text-shopRed font-bold">-${savings.toLocaleString()}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between items-center text-black/60 text-lg font-medium">
              <span>Promo Discount (-20%)</span>
              <span className="text-shopRed font-bold">-${discount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-black/60 text-lg font-medium">
            <span>Delivery Fee</span>
            <span className="text-black font-bold">
              {deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}
            </span>
          </div>

          <div className="h-[1px] bg-black/[0.08] my-1" />
        
          <div className="flex justify-between items-center pt-2 text-black">
            <span className="text-xl font-black uppercase italic tracking-tighter">Total</span>
            <span className="text-3xl font-[1000] tracking-tighter">${finalTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 flex items-center bg-[#F0F0F0] px-4 py-4 rounded-full border border-black/[0.03] group focus-within:border-black/20 transition-all">
            <FiTag className="text-black/30 mr-2" />
            <input
              type="text"
              placeholder="Add promo code"
              className="bg-transparent border-none outline-none text-[14px] w-full text-black font-black uppercase tracking-widest placeholder:text-black/20"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
            />
          </div>
          <button
            onClick={onApply}
            className="px-8 py-4 rounded-full font-[1000] text-[12px] uppercase italic bg-black text-white cursor-pointer hover:bg-neutral-800 transition-all active:scale-95"
          >
            Apply
          </button>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-black text-white py-6 rounded-full font-[1000] uppercase italic text-sm flex items-center justify-center gap-3 border-none cursor-pointer shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
        >
          Go to Checkout <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};