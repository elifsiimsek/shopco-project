import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:w-[610px] animate-in fade-in duration-700">
      {/* 📸 Thumbnail List (Küçük Resimler) */}
      <div className="flex flex-row md:flex-col gap-4 w-full md:w-[152px]">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className={`aspect-square bg-white rounded-[20px] overflow-hidden border-2 transition-all duration-300 cursor-pointer p-0
              ${selectedImage === img ? "border-black shadow-lg" : "border-black/5 opacity-60 hover:opacity-100"}
            `}
          >
            <img src={img} className="w-full h-full object-cover" alt={`Archive-Thumb-${i}`} />
          </button>
        ))}
      </div>

      {/* 🖼 Main Image Display (Büyük Resim) */}
      <div className="flex-1 bg-[#F0F0F0] rounded-[24px] overflow-hidden h-[530px] border border-black/5 shadow-sm group">
        <img
          src={selectedImage}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          alt="Product-View-Secure"
        />
      </div>
    </div>
  );
}