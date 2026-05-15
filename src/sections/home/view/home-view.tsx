import HomeHero from "../home-hero";
import HomeBrands from "../home-brands";
import HomeNewArrivals from "../home-new-arrivals";
import HomeTopSelling from "../home-top-selling";
import HomeCategories from "../home-categories";
import HomeTestimonials from "../home-testimonials";

export default function HomeView() {
  return (
    <main className="min-h-screen bg-white">
      <HomeHero />
      <HomeBrands />
      <HomeNewArrivals />
      <HomeTopSelling />
      <HomeCategories />
      <HomeTestimonials />

    </main>
  );
}