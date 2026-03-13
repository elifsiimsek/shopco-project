export default function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:w-[610px]">
      <div className="flex flex-row md:flex-col gap-4 w-full md:w-[152px]">
        {images.map((img, i) => (
          <div
            key={i}
            className="aspect-square bg-white rounded-[20px] overflow-hidden border border-black/10"
          >
            <img src={img} className="w-full h-full object-cover" alt="Thumb" />
          </div>
        ))}
      </div>
      <div className="flex-1 bg-white rounded-[20px] overflow-hidden h-[530px]">
        <img
          src={images[0]}
          className="w-full h-full object-cover"
          alt="Main"
        />
      </div>
    </div>
  );
}
