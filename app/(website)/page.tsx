import HeroSlide from "@/components/home/Hero/HeroSlide";
import Categories from "@/components/home/Categories/Categories";
import NewSummerCollection from "@/components/home/NewSummerCollection/NewSummerCollection";
import TrendingMay from "@/components/home/FeatureProducts/TrendingMay";
import FeaturedProducts from "@/components/home/FeatureProducts/FeaturedProducts";
import CategoryProductGrid from "@/components/home/CategoryProductGrid/CategoryProductGrid";
import SpecialOffer from "@/components/home/SpecialOffer/SpecialOffer";
import Testimonial from "@/components/home/Testimonial/Testimonial";
import BlogSection from "@/components/home/Blog/BlogSection";
import Newsletter from "@/components/home/Newsletter/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSlide />
      <Categories />
      <CategoryProductGrid />
      {/* <NewSummerCollection /> */}
      <FeaturedProducts />
      {/* <SpecialOffer /> */}
      <TrendingMay />
      <Testimonial />
      {/* <BlogSection /> */}
      <Newsletter />
    </>
  );
}
