import React from "react";
import { X, Link as LinkIcon, Upload, Check } from "lucide-react";
import {
  categories,
  dressStyles,
  availableColors,
} from "../../../data/products";

export interface ProductFormData {
  name: string;
  price: string;
  discount: string;
  category: string;
  description: string;
  stock: string;
  mainImage: string;
  extraImage1: string;
  extraImage2: string;
  style: string;
}

export interface ImageModes {
  mainImage: "link" | "file";
  extraImage1: "link" | "file";
  extraImage2: "link" | "file";
}

export interface ColorOption {
  name: string;
  code: string;
}

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingId: string | null;
  selectedColors: string[];
  setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
  modes: ImageModes;
  setModes: React.Dispatch<React.SetStateAction<ImageModes>>;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProductFormData,
  ) => void;
}

export const ProductFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  editingId,
  selectedColors,
  setSelectedColors,
  modes,
  setModes,
  handleFileChange,
}) => {
  if (!isOpen) return null;

  const imageFields: (keyof ImageModes)[] = [
    "mainImage",
    "extraImage1",
    "extraImage2",
  ];

  return (
    <div className="fixed inset-0 w-full h-full bg-black/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-0 sm:p-4 text-left overflow-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="bg-white w-full h-full sm:h-auto max-w-6xl sm:rounded-[50px] relative shadow-2xl flex flex-col sm:max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[110] p-2 sm:p-3 bg-black text-white rounded-full hover:rotate-90 transition-all border-none cursor-pointer"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="p-6 md:p-12 overflow-y-auto no-scrollbar flex-1">
          <header className="mb-8 md:mb-10 pt-4 sm:pt-0">
            <h2 className="text-3xl md:text-5xl font-[1000] uppercase italic tracking-tighter text-black leading-none">
              {editingId ? "Update Piece" : "Product Entry"}
            </h2>
            <div className="h-1 w-16 md:w-20 bg-black mt-2 rounded-full"></div>
          </header>

          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase ml-2 opacity-40 text-black">
                  Product Name
                </label>
                <input
                  required
                  autoFocus
                  className="w-full bg-gray-100 p-5 md:p-6 rounded-2xl md:rounded-3xl border-none font-bold outline-none text-black focus:ring-2 ring-black/5 transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 opacity-40 text-black">
                    Category
                  </label>
                  <select
                    className="w-full bg-gray-100 p-5 rounded-2xl border-none font-bold text-black appearance-none outline-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    {categories.map((c: string) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 opacity-40 text-black">
                    Dress Style
                  </label>
                  <select
                    className="w-full bg-gray-100 p-5 rounded-2xl border-none font-bold text-black appearance-none outline-none cursor-pointer"
                    value={formData.style}
                    onChange={(e) =>
                      setFormData({ ...formData, style: e.target.value })
                    }
                  >
                    {dressStyles.map((s: string) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 opacity-40 text-black">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-gray-100 p-5 rounded-2xl border-none font-bold outline-none text-black"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 opacity-40 text-black">
                    Disc (%)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-100 p-5 rounded-2xl border-none font-bold outline-none text-black"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black uppercase ml-2 opacity-40 text-black">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-gray-100 p-5 rounded-2xl border-none font-bold outline-none text-black"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase ml-2 opacity-40 text-black">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-2 md:gap-3 p-4 md:p-5 bg-gray-100 rounded-[2rem]">
                  {availableColors.map((color: ColorOption) => (
                    <button
                      key={color.code}
                      type="button"
                      onClick={() =>
                        setSelectedColors((prev: string[]) =>
                          prev.includes(color.code)
                            ? prev.filter((c: string) => c !== color.code)
                            : [...prev, color.code],
                        )
                      }
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 transition-all flex items-center justify-center ${color.code} ${
                        selectedColors.includes(color.code)
                          ? "border-black scale-110 shadow-lg"
                          : "border-transparent opacity-40 hover:opacity-100"
                      }`}
                    >
                      {selectedColors.includes(color.code) && (
                        <Check
                          size={14}
                          className={
                            color.name === "White" ? "text-black" : "text-white"
                          }
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                {imageFields.map((field) => (
                  <div
                    key={String(field)}
                    className="bg-gray-50 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2.5rem] border border-black/5 hover:border-black/10 transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase opacity-40 text-black">
                        {String(field)}
                      </span>
                      <div className="flex gap-1 bg-gray-200 p-1 rounded-xl">
                        {(["link", "file"] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setModes({ ...modes, [field]: m })}
                            className={`p-2 rounded-lg border-none cursor-pointer transition-colors ${
                              modes[field] === m
                                ? "bg-black text-white shadow-lg"
                                : "text-black/30 hover:text-black"
                            }`}
                          >
                            {m === "link" ? (
                              <LinkIcon size={12} />
                            ) : (
                              <Upload size={12} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    {modes[field] === "link" ? (
                      <input
                        className="w-full bg-white p-3 md:p-4 rounded-xl border border-black/10 font-bold text-xs outline-none text-black focus:border-black/30"
                        placeholder="Paste image URL..."
                        value={formData[field]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                      />
                    ) : (
                      <input
                        type="file"
                        className="text-[10px] w-full text-black font-bold p-2"
                        onChange={(e) => handleFileChange(e, field)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase ml-2 opacity-40 text-black">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-gray-100 p-5 md:p-6 rounded-2xl md:rounded-3xl border-none font-bold outline-none resize-none text-black focus:ring-2 ring-black/5"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-6 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] border-none cursor-pointer hover:bg-zinc-800 transition-all shadow-2xl active:scale-95 disabled:bg-zinc-400"
              >
                {isSubmitting
                  ? "Syncing..."
                  : editingId
                    ? "Update Piece"
                    : "Confirm Drop"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
