import {
  FiMapPin,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";
import { TURKEY_CITIES } from "../../data/cities";
import Button from "../../components/ui/Button";

interface Address {
  id: string;
  title: string;
  city: string;
  district: string;
  fullAddress: string;
}

interface User {
  addresses?: Address[];
}

interface AddressForm {
  title: string;
  city: string;
  district: string;
  fullAddress: string;
}

interface AccountAddressProps {
  user: User;
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
  addrForm: AddressForm;
  setAddrForm: (value: AddressForm) => void;
  handleSave: () => void;
  setEditingId: (id: string | null) => void;
  setDeleteConfirm: (data: { id: string; type: string } | null) => void;
  EmptyState: React.FC<{ icon: React.ReactNode; text: string }>;
  formErrors: Record<string, string>;
}

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
  formErrors,
}: AccountAddressProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-black/[0.03] pb-6">
        <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter m-0 text-black">
          Logistics Nodes
        </h3>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setAddrForm({ title: "", city: "", district: "", fullAddress: "" });
          }}
          className="bg-black text-white px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-widest border-none cursor-pointer flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
        >
          <FiPlus /> Establish Node
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border-2 border-dashed border-black/10 p-8 rounded-[35px] max-w-lg space-y-5 animate-in zoom-in-95 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                className={`text-[8px] font-black uppercase ml-2 ${formErrors.title ? "text-red-500" : "text-black/20"}`}
              >
                Protocol Label
              </label>
              <input
                type="text"
                placeholder="E.G. HOME / OFFICE"
                className={`w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-2 outline-none uppercase placeholder:text-black/10 transition-all ${formErrors.title ? "border-red-500/50" : "border-transparent focus:border-black/10"}`}
                value={addrForm.title}
                onChange={(e) =>
                  setAddrForm({
                    ...addrForm,
                    title: e.target.value.toUpperCase(),
                  })
                }
              />
              {formErrors.title && (
                <p className="text-[8px] font-black text-red-500 uppercase flex items-center gap-1 pl-2 animate-in slide-in-from-left-2">
                  <FiAlertCircle /> {formErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                className={`text-[8px] font-black uppercase ml-2 ${formErrors.city ? "text-red-500" : "text-black/20"}`}
              >
                City Node
              </label>
              <select
                className={`w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-2 outline-none cursor-pointer appearance-none transition-all ${formErrors.city ? "border-red-500/50" : "border-transparent focus:border-black/10"}`}
                value={addrForm.city}
                onChange={(e) =>
                  setAddrForm({ ...addrForm, city: e.target.value })
                }
              >
                <option value="">SELECT CITY</option>
                {TURKEY_CITIES.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {formErrors.city && (
                <p className="text-[8px] font-black text-red-500 uppercase flex items-center gap-1 pl-2">
                  {formErrors.city}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label
              className={`text-[8px] font-black uppercase ml-2 ${formErrors.district ? "text-red-500" : "text-black/20"}`}
            >
              District Spec
            </label>
            <input
              type="text"
              placeholder="DISTRICT SPECIFICATION"
              className={`w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-2 outline-none uppercase placeholder:text-black/10 transition-all ${formErrors.district ? "border-red-500/50" : "border-transparent focus:border-black/10"}`}
              value={addrForm.district}
              onChange={(e) =>
                setAddrForm({
                  ...addrForm,
                  district: e.target.value.toUpperCase(),
                })
              }
            />
            {formErrors.district && (
              <p className="text-[8px] font-black text-red-500 uppercase flex items-center gap-1 pl-2">
                {formErrors.district}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              className={`text-[8px] font-black uppercase ml-2 ${formErrors.fullAddress ? "text-red-500" : "text-black/20"}`}
            >
              Full Archive Address
            </label>
            <textarea
              placeholder="COMPLETE ARCHIVE COORDINATES"
              className={`w-full bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-2 outline-none h-24 resize-none uppercase placeholder:text-black/10 transition-all ${formErrors.fullAddress ? "border-red-500/50" : "border-transparent focus:border-black/10"}`}
              value={addrForm.fullAddress}
              onChange={(e) =>
                setAddrForm({
                  ...addrForm,
                  fullAddress: e.target.value.toUpperCase(),
                })
              }
            />
            {formErrors.fullAddress && (
              <p className="text-[8px] font-black text-red-500 uppercase flex items-center gap-1 pl-2">
                {formErrors.fullAddress}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              onClick={handleSave}
              className="flex-1 py-4 text-[10px] uppercase font-black tracking-widest italic border-none cursor-pointer"
            >
              Authorize Location
            </Button>
            <button
              onClick={() => setIsAdding(false)}
              className="text-[9px] font-black uppercase tracking-widest text-black/20 bg-transparent border-none cursor-pointer hover:text-black transition-colors"
            >
              Abort
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.addresses?.length ? (
          user.addresses.map((addr: Address) => (
            <div
              key={addr.id}
              className="group bg-white p-8 rounded-[35px] border border-black/5 hover:border-black/20 transition-all relative text-left shadow-sm hover:shadow-xl"
            >
              <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => {
                    setEditingId(addr.id);
                    setAddrForm(addr);
                    setIsAdding(true);
                  }}
                  className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center border-none cursor-pointer hover:scale-110 transition-all"
                >
                  <FiEdit3 size={14} />
                </button>
                <button
                  onClick={() =>
                    setDeleteConfirm({ id: addr.id, type: "address" })
                  }
                  className="w-9 h-9 bg-white text-red-500 rounded-full flex items-center justify-center border border-red-500/10 shadow-sm cursor-pointer hover:bg-red-500 hover:text-white transition-all"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
              <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.3em] mb-3 italic">
                {addr.title || "NODE SPEC"}
              </p>
              <h4 className="text-2xl font-[1000] uppercase italic tracking-tighter m-0 text-black">
                {addr.city}{" "}
                <span className="text-black/10 not-italic mx-1">/</span>{" "}
                {addr.district}
              </h4>
              <p className="text-[11px] font-bold text-black/40 mt-4 uppercase italic leading-relaxed border-t border-black/[0.03] pt-4">
                {addr.fullAddress}
              </p>
            </div>
          ))
        ) : (
          <div className="md:col-span-2">
            <EmptyState
              icon={<FiMapPin />}
              text="No Logistics Nodes Established in Archive."
            />
          </div>
        )}
      </div>
    </div>
  );
}
