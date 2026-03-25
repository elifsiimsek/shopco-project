import { FiMapPin, FiPlus, FiEdit3, FiTrash2 } from "react-icons/fi";
import { TURKEY_CITIES } from "../../data/cities";
import Button from "../../components/ui/Button";

export default function AccountAddress({
  user,
  isAdding,
  setIsAdding,
  addrForm,
  setAddrForm,
  handleSave,
  setEditingId,
  setDeleteConfirm,
  EmptyState,
}: any) {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-[1000] uppercase italic tracking-tighter m-0">
          Logistics Nodes
        </h3>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setAddrForm({ title: "", city: "", district: "", fullAddress: "" });
          }}
          className="bg-black text-white px-6 py-3 rounded-full font-black text-[10px] uppercase border-none cursor-pointer flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
        >
          <FiPlus /> New Link
        </button>
      </div>
      {isAdding && (
        <div className="bg-white border-2 border-dashed border-black/10 p-8 rounded-[35px] max-w-lg space-y-4 animate-in zoom-in-95 text-left">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="LABEL"
              className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none uppercase"
              value={addrForm.title}
              onChange={(e) =>
                setAddrForm({
                  ...addrForm,
                  title: e.target.value.toUpperCase(),
                })
              }
            />
            <select
              className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none cursor-pointer"
              value={addrForm.city}
              onChange={(e) =>
                setAddrForm({ ...addrForm, city: e.target.value })
              }
            >
              <option value="">CITY</option>
              {TURKEY_CITIES.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="DISTRICT"
            className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none uppercase"
            value={addrForm.district}
            onChange={(e) =>
              setAddrForm({
                ...addrForm,
                district: e.target.value.toUpperCase(),
              })
            }
          />
          <textarea
            placeholder="FULL ARCHIVE ADDRESS"
            className="w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none h-24 resize-none uppercase"
            value={addrForm.fullAddress}
            onChange={(e) =>
              setAddrForm({
                ...addrForm,
                fullAddress: e.target.value.toUpperCase(),
              })
            }
          />
          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1 py-4 text-[10px]">
              Secure Node
            </Button>
            <button
              onClick={() => setIsAdding(false)}
              className="text-[10px] font-black uppercase text-black/20 bg-transparent border-none cursor-pointer"
            >
              Abort
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.addresses?.length ? (
          user.addresses.map((addr: any) => (
            <div
              key={addr.id}
              className="group bg-white p-6 rounded-[30px] border border-black/5 hover:border-black/10 transition-all relative text-left"
            >
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingId(addr.id);
                    setAddrForm(addr);
                    setIsAdding(true);
                  }}
                  className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center border-none cursor-pointer"
                >
                  <FiEdit3 size={14} />
                </button>
                <button
                  onClick={() =>
                    setDeleteConfirm({ id: addr.id, type: "address" })
                  }
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center border-none cursor-pointer"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 italic opacity-40">
                {addr.title || "SPEC"}
              </p>
              <h4 className="text-xl font-[1000] uppercase italic tracking-tight m-0">
                {addr.city} / {addr.district}
              </h4>
              <p className="text-[11px] font-bold text-black/40 mt-3 uppercase italic leading-relaxed">
                {addr.fullAddress}
              </p>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<FiMapPin />}
            text="No Logistics Nodes Established."
          />
        )}
      </div>
    </div>
  );
}
