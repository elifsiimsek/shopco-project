import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../hooks/useProducts";
import { productService } from "../../data/products";
import ProductCard from "../../components/product/ProductCard";
import ImageGallery from "../../components/product/ImageGallery";
import Title from "../../components/title";
import type { Product } from "../../types/product";

import ProductInfo from "./product-info";
import ProductTabs from "./product-tabs";
import ReviewModal from "./review-modal";

export default function ProductDetailsView() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, setNotification } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { product, loading, error } = useProducts(id);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      productService.getRelatedProducts(product.id).then(setRelatedProducts);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    const sizeToArchive =
      selectedSize || (product.sizes && product.sizes[0]) || "";
    const colorToArchive =
      selectedColor || (product.colors && product.colors[0]) || "";

    if (!sizeToArchive) {
      setNotification("PLEASE SELECT A SIZE! ⚠️");
      return;
    }

    addToCart(
      {
        id: String(product.id),
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        img: product.img,
        selectedSize: sizeToArchive,
        selectedColor: colorToArchive,
      },
      quantity,
    );
    setNotification(`${product.name.toUpperCase()} ADDED TO BAG! 📦`);
  };

  const handlePostReview = () => {
    if (!user) {
      setNotification("PLEASE LOGIN TO POST A REVIEW! 🔐");
      return;
    }
    if (!newReview.comment.trim()) {
      setNotification("PLEASE WRITE YOUR THOUGHTS. ✍️");
      return;
    }

    const reviewData = {
      id: `REV-${Date.now()}`,
      name: user.name,
      email: user.email,
      date: new Date()
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase(),
      comment: newReview.comment.toUpperCase(),
      rating: newReview.rating,
    };

    const existingReviews = JSON.parse(
      localStorage.getItem(`reviews_${product?.id}`) || "[]",
    );
    localStorage.setItem(
      `reviews_${product?.id}`,
      JSON.stringify([reviewData, ...existingReviews]),
    );

    setNotification("VAULT REVIEW ARCHIVED! ⭐");
    setIsReviewModalOpen(false);
    setNewReview({ rating: 5, comment: "" });
    window.location.reload();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error || !product)
    return (
      <div className="py-40 text-center font-black uppercase opacity-20 italic tracking-widest">
        {error || "ARCHIVE ENTRY NOT FOUND"}
      </div>
    );

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 bg-white min-h-screen font-satoshi">
      <nav className="flex items-center gap-2 text-[10px] text-black/30 mb-10 font-black uppercase tracking-[0.2em]">
        <Link
          to="/"
          className="hover:text-black transition no-underline text-black/30"
        >
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          to="/shop"
          className="hover:text-black transition no-underline text-black/30"
        >
          Shop
        </Link>
        <ChevronRight size={12} />
        <span className="text-black italic">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-24">
        <ImageGallery images={[product.img, product.img, product.img]} />
        <ProductInfo
          product={product}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          isFavorite={isInWishlist(product.id)}
        />
      </div>

      <ProductTabs
        product={product}
        setIsReviewModalOpen={setIsReviewModalOpen}
      />

      <div className="mt-48 text-center">
        <Title title="You might also like" align="center" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mt-10">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        newReview={newReview}
        setNewReview={setNewReview}
        onPost={handlePostReview}
      />
    </div>
  );
}
