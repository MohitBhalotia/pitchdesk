import AppHero from "@/components/mvpblocks/app-hero";
import ContactUs1 from "@/components/mvpblocks/contact-us-1";
import FeatureSteps from "@/components/mvpblocks/feature-2";
import Footer4Col from "@/components/mvpblocks/footer-4col";
import Header1 from "@/components/mvpblocks/header-1";
import SimplePricing from "@/components/mvpblocks/simple-pricing";
import TestimonialsCarousel from "@/components/mvpblocks/testimonials-carousel";
import PrivacyPreview from "@/components/mvpblocks/privacy-preview";

export default function Home() {
  return (
    <>
      <Header1 />
      <AppHero />
      <FeatureSteps />
      <TestimonialsCarousel />
      <SimplePricing />
      <PrivacyPreview />
      <ContactUs1 />
      <Footer4Col />
    </>
  );
}
