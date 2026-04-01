import { Info } from "lucide-react";
import { FiShield } from "react-icons/fi";

interface SpecItemProps {
  label: string;
  value: string;
}

function SpecItem({ label, value }: SpecItemProps) {
  return (
    <div className="flex justify-between border-b border-black/[0.05] pb-5 group hover:border-black transition-colors py-2">
      <span className="text-[11px] font-black uppercase text-black/30 tracking-widest">{label}</span>
      <span className="text-[14px] font-bold text-black ">{value}</span>
    </div>
  );
}

export default function ProductDetailsTab() {
  return (
    <div className="grid md:grid-cols-2 gap-12 animate-in fade-in duration-500">
      <div className="space-y-6">
        <h4 className="text-xl font-black uppercase text-black mb-8 flex items-center gap-3">
          <Info size={24} className="text-black/20" /> Technical identity
        </h4>
        <div className="space-y-1">
          <SpecItem label="Fabric Blueprint" value="100% GOTS Organic Cotton" />
          <SpecItem label="Weight Class" value="280 GSM Heavyweight" />
          <SpecItem label="Silhouette" value="Drop Shoulder / Boxy Fit" />
          <SpecItem label="Manufacturing" value="Premium Garment Dye" />
        </div>
      </div>
      <div className="bg-black text-white p-12 rounded-[45px] relative overflow-hidden flex flex-col justify-center shadow-2xl min-h-[350px]">
        <h4 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">Vault Standard</h4>
        <p className="opacity-40 text-[12px] font-bold tracking-widest leading-loose italic uppercase m-0">
          Each stitch is a signature of our archive, engineered for a lifetime of silhouette integrity.
        </p>
        <FiShield size={180} className="absolute -right-10 -bottom-10 opacity-5 rotate-12" />
      </div>
    </div>
  );
}