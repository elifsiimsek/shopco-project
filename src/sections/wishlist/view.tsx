import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import WishlistHeader from "./wishlist-header";
import WishlistItem from "./wishlist-item";
import WishlistEmpty from "./wishlist-empty";

export default function WishlistCatalogView() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, setNotification } = useCart();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setNotification("Promo code copied! 📋");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 font-satoshi text-left text-black min-h-screen">
      <WishlistHeader count={wishlist.length} onCopyCode={copyToClipboard} />

      {wishlist.length > 0 ? (
        <div className="max-w-[1000px] animate-fade-in-up">
          <div className="flex flex-col gap-4">
            {wishlist.map((product) => (
              <WishlistItem
                key={product.id}
                product={product}
                onAddToCart={(p) => addToCart({ ...p, quantity: 1 }, 1)}
                onRemove={toggleWishlist}
              />
            ))}
          </div>
        </div>
      ) : (
        <WishlistEmpty />
      )}
    </div>
  );
}
