import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import type { CartItem } from "../../context/CartContext";

interface CartItemListProps {
  items: CartItem[];
  onDecrease: (id: string, size: string, color: string) => void;
  onIncrease: (id: string, size: string, color: string) => void;
  onRemove: (item: CartItem) => void;
}

export const CartItemList = ({ items, onDecrease, onIncrease, onRemove }: CartItemListProps) => (
  <div className="flex-1 w-full border border-black/[0.08] rounded-[20px] p-5 md:p-6 bg-white space-y-6 text-black">
    {items.map((item, idx) => (
      <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className={`flex gap-4 relative ${idx !== items.length - 1 ? "border-b border-black/[0.08] pb-6" : ""}`}>
        <div className="w-24 h-24 md:w-32 md:h-32 bg-[#F0EEED] rounded-xl overflow-hidden shrink-0">
          <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
        </div>
        <div className="flex-1 flex flex-col justify-between py-1 text-left relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[16px] md:text-[20px] font-bold m-0 leading-tight uppercase tracking-tighter">{item.name}</h4>
              <p className="text-[12px] text-black/60 mt-1 uppercase font-bold">
                Size: <span className="text-black">{item.selectedSize}</span> | Color: <span className="text-black">{item.selectedColor?.replace("bg-", "")}</span>
              </p>
            </div>
            <button onClick={() => onRemove(item)} className="text-shopRed bg-transparent border-none cursor-pointer p-2 hover:scale-110 transition-all relative z-50">
              <FiTrash2 size={22} />
            </button>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl font-black tracking-tighter">${item.price}</span>
            </div>
            <div className="flex items-center gap-6 bg-[#F0F0F0] px-5 py-2.5 rounded-full font-black relative z-50">
              <button onClick={() => onDecrease(String(item.id), item.selectedSize || "", item.selectedColor || "")} className="border-none bg-transparent cursor-pointer opacity-40 hover:opacity-100 p-1 flex items-center justify-center"><FiMinus strokeWidth={3} /></button>
              <span className="text-sm tabular-nums font-black select-none">{item.quantity}</span>
              <button onClick={() => onIncrease(String(item.id), item.selectedSize || "", item.selectedColor || "")} className="border-none bg-transparent cursor-pointer opacity-40 hover:opacity-100 p-1 flex items-center justify-center"><FiPlus strokeWidth={3} /></button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);