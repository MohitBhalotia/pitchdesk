import AppHero from "@/components/mvpblocks/app-hero";
import ContactUs1 from "@/components/mvpblocks/contact-us-1";
import FeatureSteps from "@/components/mvpblocks/feature-2";
import Footer4Col from "@/components/mvpblocks/footer-4col";
import Header1 from "@/components/mvpblocks/header-1";
import SimplePricing from "@/components/mvpblocks/simple-pricing";
import TestimonialsCarousel from "@/components/mvpblocks/testimonials-carousel";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Header1 />
      <AppHero />
      <FeatureSteps />
      {/* <TestimonialsCarousel /> */}
      <SimplePricing />
      <ContactUs1 />
      <Footer4Col />
    </div>
  );
}
