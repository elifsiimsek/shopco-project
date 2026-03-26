import { Link } from "react-router-dom";
import type { Product } from "../../../types/product";

interface GridProps {
  products: Product[];
}

export default function OnSaleGrid({ products }: GridProps) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24 mb-40">
      {products.map((product, index) => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className={`group relative flex flex-col no-underline transition-all duration-700 ${index % 2 !== 0 ? "lg:translate-y-20" : ""}`}
        >
          <div className="relative aspect-[3/4] bg-[#F8F8F8] rounded-[48px] overflow-hidden mb-6">
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-vault-red text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase">
                {product.discount || "-20%"}
              </span>
            </div>
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
            />
          </div>
          <div className="text-left flex flex-col items-start px-2">
            <h3 className="font-black text-[18px] text-black uppercase italic group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="font-black text-[26px] text-black">
                ${product.price}
              </span>
              <span className="text-black/10 line-through text-[16px] font-black italic">
                ${product.oldPrice}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
