"use client";

import "./landing.css";
import {
  spaceGrotesk,
  instrumentSerif,
  jetbrainsMono,
  inter,
} from "./fonts";
import ForceDarkTheme from "./primitives/ForceDarkTheme";
import CustomCursor from "./primitives/CustomCursor";
import MagneticCTA from "./primitives/MagneticCTA";
import ScrollProgress from "./primitives/ScrollProgress";
import LandingNav from "./sections/LandingNav";
import LandingHero from "./sections/LandingHero";
import LogoMarquee from "./sections/LogoMarquee";
import HowItWorks from "./sections/HowItWorks";
import VCPanel from "./sections/VCPanel";
import PitchScore from "./sections/PitchScore";
import Institutions from "./sections/Institutions";
import InvestorsPremium from "./sections/InvestorsPremium";
import FeaturesStrip from "./sections/FeaturesStrip";
import StatsStrip from "./sections/StatsStrip";
import LandingTestimonials from "./sections/LandingTestimonials";
import LandingPricing from "./sections/LandingPricing";
import LandingPrivacy from "./sections/LandingPrivacy";
import LandingContact from "./sections/LandingContact";
import Finale from "./sections/Finale";
import LandingFooter from "./sections/LandingFooter";

const fontVariables = [
  spaceGrotesk.variable,
  instrumentSerif.variable,
  jetbrainsMono.variable,
  inter.variable,
].join(" ");

export default function LandingRoot() {
  return (
    <ForceDarkTheme>
      <div className={`landing-root ${fontVariables}`}>
        <CustomCursor />
        <MagneticCTA />
        <ScrollProgress />
        <div className="grid-bg" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <LandingNav />
        <LandingHero />
        <LogoMarquee />
        <HowItWorks />
        <VCPanel />
        <PitchScore />
        <Institutions />
        <InvestorsPremium />
        <FeaturesStrip />
        <StatsStrip />
        <LandingTestimonials />
        <LandingPricing />
        <LandingPrivacy />
        <LandingContact />
        <Finale />
        <LandingFooter />
      </div>
    </ForceDarkTheme>
  );
}
