import { Link } from "react-router-dom";
import type { Product } from "../../../types/product";

interface GridProps {
  products: Product[];
}

export default function OnSaleGrid({ products }: GridProps) {
  const saleProducts = products.filter((p) => p.oldPrice || p.discount);

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24 mb-40 mt-10">
      {saleProducts.map((product, index) => {
        const displayDiscount = product.discount
          ? `%${product.discount}`
          : product.oldPrice
            ? `%${Math.round(100 - (product.price / product.oldPrice) * 100)}`
            : "-20%";

        return (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className={`group relative flex flex-col no-underline transition-all duration-700 ${
              index % 2 !== 0 ? "lg:translate-y-20" : ""
            }`}
          >
            <div className="relative aspect-[3/4] bg-[#F8F8F8] rounded-[48px] overflow-hidden mb-6">
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-shopRed text-white px-4 py-2 rounded-full text-[11px] font-[1000] uppercase tracking-tighter shadow-lg">
                  {displayDiscount} OFF
                </span>
              </div>

              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/600x800?text=Product+Image";
                }}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="text-left flex flex-col items-start px-2">
              <h3 className="font-[1000] text-[18px] text-black uppercase italic leading-tight group-hover:text-red-600 transition-colors">
                {product.name}
              </h3>

              <div className="flex items-center gap-4 mt-3">
                <span className="font-[1000] text-[28px] text-black tabular-nums">
                  ${product.price}
                </span>

                {product.oldPrice && (
                  <span className="text-black/10 line-through text-[18px] font-black italic tabular-nums">
                    ${product.oldPrice}
                  </span>
                )}
              </div>

              <span className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/20">
                {product.category}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
