import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const data = {
  instaLink: "https://www.instagram.com/pitchdesk.in",
  linkedInLink: "https://www.linkedin.com/company/pitch-desk",

  aboutCompany: [
    { text: "About Us", href: "/about" },
    { text: "Advisors", href: "/advisors" },
    { text: "Meet the Team", href: "/meet-the-team" },
    { text: "All Features", href: "/features" },
    { text: "Pricing", href: "/payment" },
  ],

  founders: [
    { text: "AI Pitch Simulator", href: "/features/ai-pitch-simulator" },
    // { text: "Script Generator", href: "/features/pitch-script-generator" },
    // { text: "Voice Feedback", href: "/features/real-time-feedback" },
    { text: "Pitch Analysis", href: "/features/pitch-analysis" },
    // { text: "Pitch Competitions", href: "/features/pitch-competitions" },
    { text: "Investment Programs", href: "/features/investment-programs" },
    // { text: "Start Pitching", href: "/start-a-pitch" },
    { text: "Vertual Cofounder", href: "/features/ai-virtual-cofounder" },
    { text: "Pitch Deck Generation", href: "/features/pitch-deck-generation" },
    { text: "Multi-VC Room Simulation", href: "/features/multi-vc-simulation" },
  ],

  vcs: [
    { text: "AI VC Agents", href: "/features/ai-vc-agents" },
    { text: "Deal Flow Automation", href: "/features/vc-deal-flow" },
    { text: "Run Investment Programs", href: "/features/investment-programs" },
    // { text: "Host Competitions", href: "/features/pitch-competitions" },
  ],

  help: {
    faqsAndSupport: "/community/support",
    feedback: "/community/feedback",
    privacyPolicy: "/privacy",
  },

  contact: {
    email: "info@pitchdesk.in",
    phone: "+91 9987105864",
    address: "India",
  },

  company: {
    name: "PitchDesk",
    description:
      "Fueling founder's growth with AI that listens, challenges, and helps them shine in every pitch.",
    logo: "/logo.png",
  },
};

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Linkedin, label: "LinkedIn", href: data.linkedInLink },
];

const helpfulLinks = [
  { text: "FAQs & Support", href: data.help.faqsAndSupport },
  { text: "Feedback", href: data.help.feedback },
  { text: "Privacy Policy", href: data.help.privacyPolicy },
];

const contactInfo = [
  {
    icon: Mail,
    text: data.contact.email,
    href: `mailto:${data.contact.email}`,
  },
  { icon: Phone, text: data.contact.phone, href: `tel:${data.contact.phone}` },
  { icon: MapPin, text: data.contact.address, isAddress: true, href: "#" },
];

export default function Footer4Col() {
  return (
    <footer className="bg-secondary dark:bg-secondary/20 mt-16 w-full rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT SECTION */}
          <div>
            <div className="flex justify-center gap-2 sm:justify-start">
              <Image
                src={data.company.logo}
                alt="logo"
                width={40}
                height={40}
                className="dark:invert rounded-full"
              />
              <span className="text-2xl font-bold text-accent-foreground">
                PitchDesk
              </span>
            </div>

            <p className="text-foreground/50 mt-6 max-w-md text-center sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-primary hover:text-primary/80">
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT GRID */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5 lg:col-span-2">
            {/* ABOUT + COMPANY */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Company</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.aboutCompany.map(({ text, href }) => (
                  <li key={text}>
                    <Link href={href} className="text-secondary-foreground/70">
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* FOR FOUNDERS */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">For Founders</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.founders.map(({ text, href }) => (
                  <li key={text}>
                    <Link href={href} className="text-secondary-foreground/70">
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* FOR VCs */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">For VCs</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.vcs.map(({ text, href }) => (
                  <li key={text}>
                    <Link href={href} className="text-secondary-foreground/70">
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* HELP + CONTACT */}
            {/* <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link href={href} className="text-secondary-foreground/70">
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="text-lg font-medium mt-8">Contact Us</p>
              <ul className="mt-4 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="flex items-center justify-center gap-2 sm:justify-start"
                    >
                      <Icon className="text-primary size-5" />
                      {isAddress ? (
                        <address className="not-italic text-secondary-foreground/70">
                          {text}
                        </address>
                      ) : (
                        <span className="text-secondary-foreground/70">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link href={href} className="text-secondary-foreground/70">
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="flex items-center justify-center gap-2 sm:justify-start"
                    >
                      <Icon className="text-primary size-5" />
                      {isAddress ? (
                        <address className="not-italic text-secondary-foreground/70">
                          {text}
                        </address>
                      ) : (
                        <span className="text-secondary-foreground/70">{text}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 border-t pt-6 text-center sm:flex sm:justify-between">
          <p className="text-sm text-secondary-foreground/70">
            © {new Date().getFullYear()} {data.company.name}
          </p>
          <p className="text-sm">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}