import { Star, X } from "lucide-react";
import Button from "../../components/ui/Button";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  newReview: { rating: number; comment: string };
  setNewReview: (val: { rating: number; comment: string }) => void;
  onPost: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  newReview,
  setNewReview,
  onPost,
}: ReviewModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[500px] rounded-[45px] p-10 relative shadow-2xl border border-black/5 text-left">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-black/20 border-none bg-transparent cursor-pointer hover:text-black transition-all"
        >
          <X size={24} />
        </button>
        <div className="space-y-8">
          <h2 className="text-3xl font-[1000] uppercase tracking-tighter text-black">
            Post Review
          </h2>
          <div className="flex gap-2 justify-center py-6 bg-[#FBFBFB] rounded-[25px] border border-black/5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setNewReview({ ...newReview, rating: s })}
                className="bg-transparent border-none cursor-pointer transform hover:scale-125 transition-all outline-none"
              >
                <Star
                  size={32}
                  fill={s <= newReview.rating ? "#FFC633" : "none"}
                  color={s <= newReview.rating ? "#FFC633" : "#EAEAEA"}
                  strokeWidth={s <= newReview.rating ? 0 : 2}
                />
              </button>
            ))}
          </div>
          <textarea
            rows={4}
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            placeholder="DESCRIBE THE QUALITY..."
            className="w-full bg-[#FBFBFB] rounded-[25px] p-6 outline-none font-bold text-sm border border-black/5 focus:border-black transition-all resize-none uppercase text-black"
          />
          <Button
            onClick={onPost}
            className="w-full py-5 bg-black text-white font-[1000] rounded-full uppercase italic tracking-widest text-[10px] border-none cursor-pointer shadow-2xl"
          >
            POST TO ARCHIVES
          </Button>
        </div>
      </div>
    </div>
  );
}
