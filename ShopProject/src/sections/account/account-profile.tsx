import { FiUser, FiEdit3 } from "react-icons/fi"; 
import Button from "../../components/ui/Button";

interface AccountProfileProps {
  user: any;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  editData: { birthDate: string };
  setEditData: (data: { birthDate: string }) => void;
  handleUpdate: () => void;
  calculateAge: (date: string | undefined) => number | string;
}

export default function AccountProfile({ 
  user, isEditing, setIsEditing, editData, setEditData, handleUpdate, calculateAge 
}: AccountProfileProps) {
  return (
    <div className="bg-white border border-black/5 p-8 rounded-[35px] shadow-sm max-w-2xl animate-in fade-in">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-lg font-[1000] uppercase italic tracking-tighter m-0 flex items-center gap-3">
          <FiUser className="text-black/10" size={20} /> 
          Core Identity Specs
        </h3>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="text-black/20 bg-transparent border-none cursor-pointer hover:text-black transition-colors"
        >
          <FiEdit3 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
        <IdentityItem label="Signatory" value={user?.name} />
        <IdentityItem label="Vault Email" value={user?.email} />
        <IdentityItem label="Origin (Birth)" value={user?.birthDate} />
        <IdentityItem label="Age Status" value={`${calculateAge(user?.birthDate)} Years`} />
      </div>

      {isEditing && (
        <div className="mt-8 pt-8 border-t border-black/5 animate-in slide-in-from-top-4 text-left">
          <p className="text-[10px] font-black uppercase text-black/20 mb-4 tracking-widest">Modify Origin Parameter</p>
          <div className="flex gap-4">
            <input 
              type="date" 
              className="flex-1 bg-[#F5F5F5] p-4 rounded-xl font-black text-xs border-none outline-none" 
              value={editData.birthDate} 
              onChange={(e) => setEditData({ birthDate: e.target.value })} 
            />
            <Button onClick={handleUpdate} className="px-8 py-4 text-[10px]">Verify identity</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function IdentityItem({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20 m-0">{label}</p>
      <p className="text-xl font-[1000] italic uppercase m-0 tracking-tighter text-black/90 truncate">{value || "---"}</p>
    </div>
  );
}