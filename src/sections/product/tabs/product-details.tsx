import { Info } from "lucide-react";
import { FiShield } from "react-icons/fi";
import type { Product } from "../../../types/product";
interface ProductDetailsTabProps {
  product: Product;
  selectedColor: string;
}

interface SpecItemProps {
  label: string;
  value: string | undefined;
  pureColor: string;
}

function SpecItem({ label, value, pureColor }: SpecItemProps) {
  if (!value) return null;
  return (
    <div
      className={`flex justify-between border-b border-black/[0.05] pb-5 group transition-all py-2 hover:border-${pureColor}`}
    >
      <span className="text-[11px] font-black uppercase text-black/30 tracking-widest group-hover:text-black transition-colors">
        {label}
      </span>
      <span className="text-[14px] font-bold text-black">{value}</span>
    </div>
  );
}

export default function ProductDetailsTab({
  product,
  selectedColor,
}: ProductDetailsTabProps) {
  const pureColor = selectedColor.replace("bg-", "");

  return (
    <div className="grid md:grid-cols-2 gap-12 animate-in fade-in duration-500 text-left">
      <div className="space-y-6">
        <h4 className="text-xl font-black uppercase text-black mb-8 flex items-center gap-3">
          <Info size={24} className="text-black/20" /> Technical identity
        </h4>
        <div className="space-y-1">
          <SpecItem
            label="Fabric Blueprint"
            value={product.fabric || "100% Organic Cotton"}
            pureColor={pureColor}
          />
          <SpecItem
            label="Weight Class"
            value={product.weight || "280 GSM Heavyweight"}
            pureColor={pureColor}
          />
          <SpecItem
            label="Manufacturing"
            value={product.manufacturing || "Premium Garment Dye"}
            pureColor={pureColor}
          />
        </div>
      </div>

      <div
        className={`${selectedColor} text-white p-12 rounded-[45px] relative overflow-hidden flex flex-col justify-center shadow-2xl min-h-[350px] transition-all duration-500`}
      >
        <h4 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">
          Vault Standard
        </h4>
        <p className="opacity-60 text-[12px] font-bold tracking-widest leading-loose italic uppercase m-0 text-white">
          {product.description_short ||
            "Each stitch is a signature of our archive, engineered for a lifetime of silhouette integrity."}
        </p>
        <FiShield
          size={180}
          className="absolute -right-10 -bottom-10 opacity-10 rotate-12 text-white"
        />
      </div>
    </div>
  );
}
