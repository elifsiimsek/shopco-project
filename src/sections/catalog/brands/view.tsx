import BrandsMarquee from "./brands-marquee";
import BrandsHero from "./brands-hero";
import BrandsGrid from "./brands-grid";

export default function BrandsCatalogView() {
  return (
    <div className="min-h-screen bg-white font-satoshi text-black pb-20 overflow-x-hidden">
      <BrandsMarquee />
      <BrandsHero />
      <BrandsGrid />
    </div>
  );
}
