import CartView from "../sections/cart/cart-view";

export default function Cart() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 text-left bg-white min-h-screen">
      
      <div className="mt-10">
        <CartView />
      </div>
    </div>
  );
}