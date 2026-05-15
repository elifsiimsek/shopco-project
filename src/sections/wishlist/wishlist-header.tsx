import { FiChevronRight, FiTag, FiCopy } from "react-icons/fi";
import { Link } from "react-router-dom";

interface Props {
  count: number;
  onCopyCode: (code: string) => void;
}

export default function WishlistHeader({ count, onCopyCode }: Props) {
  return (
    <>
      <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-12 animate-fade-in-up">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <FiChevronRight size={12} className="opacity-40" />
        <span className="text-black font-bold italic uppercase tracking-widest leading-none">
          Wishlist
        </span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b border-shopGray-border pb-12 text-left animate-fade-in-up">
        <div className="space-y-4">
          <h1 className="text-[50px] md:text-[64px] font-[1000] uppercase tracking-[-0.06em] leading-[0.85] italic">
            Saved <br />
            <span className="text-black/10 not-italic font-serif font-light lowercase">
              Pieces
            </span>
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30 leading-none">
            {count} Items in your private archive
          </p>
        </div>

        {count > 0 && (
          <div
            onClick={() => onCopyCode("SHOPCO20")}
            className="group cursor-pointer bg-black text-white px-6 py-4 rounded-[24px] flex items-center gap-4 hover:scale-105 transition-all shadow-xl"
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <FiTag
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
            </div>
            <div className="flex flex-col pr-4">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                Special Offer
              </span>
              <span className="text-sm font-black tracking-widest italic">
                SHOPCO20 <span className="text-white/20 ml-1">(-20%)</span>
              </span>
            </div>
            <FiCopy
              size={14}
              className="opacity-20 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>
    </>
  );
}
