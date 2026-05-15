import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { getStoredProducts } from "../../../data/products";
import type { Product } from "../../../types/product";
import { ProductCard } from "../../../components/product/ProductCard";
import { ProductFormModal } from "./product-form-modal";
import type { ProductFormData, ImageModes } from "./product-form-modal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onCancel}
      ></div>
      <div className="relative bg-white p-10 rounded-[40px] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200 border border-black/5">
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-black/20 hover:text-black border-none bg-transparent cursor-pointer transition-colors"
        >
          <X size={20} />
        </button>
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-2xl font-[1000] uppercase italic mb-2 text-black tracking-tighter">
          Remove Piece?
        </h3>
        <p className="text-black/40 font-bold text-[11px] uppercase tracking-widest mb-8 leading-relaxed">
          This identity will be purged from inventory.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-[11px] uppercase tracking-widest border-none cursor-pointer flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "CONFIRM DELETE"
            )}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 rounded-2xl bg-transparent text-black/20 font-black text-[11px] uppercase tracking-widest border-none cursor-pointer hover:text-black transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [modes, setModes] = useState<ImageModes>({
    mainImage: "link",
    extraImage1: "link",
    extraImage2: "link",
  });

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    discount: "0",
    category: "T-shirts",
    description: "",
    stock: "10",
    mainImage: "",
    extraImage1: "",
    extraImage2: "",
    style: "Casual",
  });

  useEffect(() => {
    const data = getStoredProducts();
    setProducts(data as Product[]);
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      discount: "0",
      category: "T-shirts",
      description: "",
      stock: "10",
      mainImage: "",
      extraImage1: "",
      extraImage2: "",
      style: "Casual",
    });
    setSelectedColors([]);
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setEditingId(String(product.id));
    setFormData({
      name: product.name,
      price: String(product.oldPrice || product.price),
      discount: String(product.discount || "0"),
      category: product.category,
      description: product.description || "",
      stock: String(product.stock),
      mainImage: product.img || (product.images && product.images[0]) || "",
      extraImage1: (product.images && product.images[1]) || "",
      extraImage2: (product.images && product.images[2]) || "",
      style: product.style,
    });
    setSelectedColors(product.colors || []);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const loadToast = toast.loading(
      editingId ? "Updating Piece..." : "Dropping New Piece..."
    );

    try {
      const discPercent = Number(formData.discount) || 0;
      const originalPrice = Number(formData.price);
      const rawImages = [
        formData.mainImage,
        formData.extraImage1,
        formData.extraImage2,
      ].filter((img) => img.trim() !== "");
      
      const finalImages = rawImages.length > 0
          ? rawImages
          : ["https://placehold.co/600x600?text=No+Image"];

      const apiPayload = {
        title: formData.name,
        price: originalPrice,
        description: formData.description || "Vault Premium Collection",
        categoryId: 1,
        images: finalImages,
      };

      let response;
      if (editingId && !editingId.startsWith("local-")) {
        response = await axios.put(
          `https://api.escuelajs.co/api/v1/products/${editingId}`,
          apiPayload,
        );
      } else {
        response = await axios.post(
          `https://api.escuelajs.co/api/v1/products/`,
          apiPayload,
        );
      }

      const savedData = response.data;

      const finalProduct: Product = {
        id: String(savedData.id),
        name: formData.name,
        price: discPercent > 0
            ? Math.round(originalPrice * (1 - discPercent / 100))
            : originalPrice,
        oldPrice: discPercent > 0 ? originalPrice : undefined,
        discount: discPercent,
        img: savedData.images[0],
        images: savedData.images,
        category: formData.category,
        description: formData.description,
        colors: selectedColors,
        stock: Number(formData.stock),
        style: formData.style,
        rating: 5,
        sizes: ["XS", "S", "M", "L", "XL"],
        isNew: !editingId,
      };

      setProducts((prev) => {
        const filtered = prev.filter((p) => String(p.id) !== String(editingId));
        const updatedItems = [finalProduct, ...filtered];
        localStorage.setItem(
          "vault_admin_products",
          JSON.stringify(updatedItems),
        );
        return updatedItems;
      });

      setIsModalOpen(false);
      resetForm();
      
      toast.success(
        editingId ? "IDENTITY UPDATED SUCCESSFULLY" : "NEW PIECE DROPPED",
        { id: loadToast }
      );
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Cloud Sync Failed", { id: loadToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    const t = toast.loading("Purging from Vault...");
    try {
      if (!productToDelete.startsWith("local-")) {
        await axios.delete(
          `https://api.escuelajs.co/api/v1/products/${productToDelete}`,
        );
      }

      const updated = products.filter(
        (p) => String(p.id) !== String(productToDelete),
      );
      localStorage.setItem("vault_admin_products", JSON.stringify(updated));
      setProducts(updated);
      setIsDeleteConfirmOpen(false);
      toast.success("PIECE PURGED", { id: t });
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Erase Failed", { id: t });
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProductFormData,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white p-5 lg:p-12 text-left">
      <Toaster position="bottom-right" reverseOrder={false} />

      <ConfirmDeleteModal
        isOpen={isDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        isLoading={isDeleting}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] lg:text-[11px] font-black text-black/20 uppercase tracking-[0.4em] italic leading-none">
            Global Inventory
          </p>
          <h1 className="text-5xl lg:text-7xl font-[1000] uppercase italic tracking-tighter text-black leading-none">
            Stock
          </h1>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20"
              size={18}
            />
            <input
              type="text"
              placeholder="Search pieces..."
              className="w-full bg-gray-100 border-none p-4 pl-12 rounded-2xl font-bold outline-none text-black text-sm focus:ring-2 focus:ring-black/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-black text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer border-none shadow-lg active:scale-95"
          >
            <Plus size={16} /> ADD PIECE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <ProductCard product={p} showControls={false} />
            <div className="absolute top-4 left-4 z-40 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={() => handleEdit(p)}
                className="p-3 bg-white/80 text-black rounded-xl shadow-2xl border-none hover:bg-black hover:text-white transition-all cursor-pointer active:scale-90"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => {
                  setProductToDelete(String(p.id));
                  setIsDeleteConfirmOpen(true);
                }}
                className="p-3 bg-white/80 text-red-600 rounded-xl shadow-2xl border-none hover:bg-red-600 hover:text-white transition-all cursor-pointer active:scale-90"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-32 text-center flex flex-col items-center gap-4 animate-pulse">
          <Search size={48} className="text-black/5" />
          <p className="text-black/20 font-black uppercase italic tracking-[0.4em] text-xs">
            No pieces found in sector.
          </p>
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSaveProduct}
        isSubmitting={isSubmitting}
        editingId={editingId}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        modes={modes}
        setModes={setModes}
        handleFileChange={handleFileChange}
      />
    </div>
  );
}