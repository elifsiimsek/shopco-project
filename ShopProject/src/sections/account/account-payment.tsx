import { FiCreditCard, FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../../components/ui/Button";
import type { AccountPaymentProps, PaymentCard } from "../../types/account";

export default function AccountPayment({
  user,
  isAdding,
  setIsAdding,
  cardForm,
  setCardForm,
  handleSave,
  handleHolderInput,
  setDeleteConfirm,
  EmptyState,
}: AccountPaymentProps) { 
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-[1000] uppercase italic tracking-tighter m-0">
          Vault Pay
        </h3>
        {!isAdding && (user?.savedCards?.length || 0) < 3 && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-black text-white px-6 py-3 rounded-full font-black text-[10px] uppercase border-none cursor-pointer flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
          >
            <FiPlus /> New Link
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white border-2 border-dashed border-black/10 p-8 rounded-[35px] max-w-sm space-y-4 animate-in zoom-in-95 text-left">
          <input
            type="text"
            placeholder="CARD NUMBER"
            maxLength={16}
            className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none"
            value={cardForm.number}
            onChange={(e) =>
              setCardForm({
                ...cardForm,
                number: e.target.value.replace(/\D/g, ""),
              })
            }
          />
          <input
            type="text"
            placeholder="HOLDER"
            className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs uppercase border-none outline-none"
            value={cardForm.holder}
            onChange={(e) => handleHolderInput(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none"
              value={cardForm.expiry}
              onChange={(e) => {
                let v = e.target.value.replace(/[^\d/]/g, "");
                if (v.length === 2 && !v.includes("/")) v += "/";
                setCardForm({ ...cardForm, expiry: v });
              }}
            />
            <input
              type="text"
              placeholder="CVC"
              maxLength={3}
              className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none"
              value={cardForm.cvc}
              onChange={(e) =>
                setCardForm({
                  ...cardForm,
                  cvc: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
          <Button onClick={handleSave} className="w-full py-5 text-[10px]">
            Verify Link
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.savedCards?.map((card: PaymentCard) => ( 
          <div
            key={card.id}
            className="group bg-black text-white p-8 rounded-[35px] relative aspect-[1.6/1] flex flex-col justify-between shadow-2xl transition-all hover:-translate-y-1"
          >
            <button
              onClick={() => setDeleteConfirm({ id: card.id, type: "card" })}
              className="absolute top-6 right-6 text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-transparent border-none cursor-pointer"
            >
              <FiTrash2 size={18} />
            </button>
            <FiCreditCard size={28} className="text-white/20" />
            <p className="text-2xl font-black tracking-[0.3em] italic m-0">
              •••• {card.number.slice(-4)}
            </p>
            <div className="flex justify-between items-end opacity-40">
              <div className="text-[10px] font-black uppercase tracking-widest text-left">
                <p className="m-0 text-[7px]">Signatory</p>
                {card.holder}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-right">
                <p className="m-0 text-[7px]">Exp</p>
                {card.expiry}
              </div>
            </div>
          </div>
        ))}
        
        {!user?.savedCards?.length && !isAdding && (
          <EmptyState
            icon={<FiCreditCard />}
            text="No Payment Specs Secured."
          />
        )}
      </div>
    </div>
  );
}