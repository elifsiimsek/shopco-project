import Hero from "../components/home/Hero";
import Brands from "../components/home/Brands";
import NewArrivals from "../components/home/NewArrivals";
import TopSelling from "../components/home/TopSelling";
import DressStyle from "../components/home/DressStyle";
import Testimonials from "../components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Brands />
      <NewArrivals />
      <TopSelling />
      <DressStyle />
      <Testimonials />
    </>
  );
}
