import { LucideIcon, Shield, Star, Zap } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  minutes?: number;
  icon: LucideIcon;
  description: string;
  features: string[];
  cta: string;
  link?: string;
  popular: boolean;
}

export const plans: Record<string, Plan> = {
  hobby: {
    id: "hobby",
    name: "Hobby",
    icon: Star,
    price: 0,
    description: "The perfect starting place for your Entrepreneurial journey.",
    features: [
      "5 minutes of pitch time",
      "Includes qna session",
      "Single-user account",
      "Personalised Pitch generation",
      "General english AI VC",
      "Basic email support",
    ],
    cta: "Get started for free",
    minutes: 5,
    popular: false,
  },
  standard: {
    id: "standard",
    name: "Standard",
    icon: Zap,
    price: 699,
    description: "Everything you need to build and scale your business.",
    features: [
      "3 Pitches of 20 minutes each",
      "Includes a deeper and longer qna session",
      "Single-user account",
      "1 English + 1 Hindi general AI VC",
      "Priority email support",
      "Analysis and improvement of your pitch",
      "Pitch improvement suggestions",
      "Perrsonalised pitch generation",
    ],
    cta: "Subscribe to Standard",
    minutes: 60,
    popular: true,
  },
  pro: {
    id: "pro",
    name: "Pro",
    icon: Shield,
    price: 1999,
    description: "Critical security, performance, observability and support.",
    features: [
      "10 Pitches of 20 minutes each",
      "Includes a deeper and longer qna session",
      "-user account",
      "6 English + 6 Hindi AI VC",
      "All 12 having different personalities",
      "Priority email support",
      "Analysis and improvement of your pitch",
      "Pitch improvement suggestions",
      "Perrsonalised pitch generation",
    ],
    cta: "Contact us",
    minutes: 200,
    popular: false,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    icon: Shield,
    price: 4999,
    description: "Critical security, performance, observability and support.",
    features: [
      "25 Pitches of 20 minutes each",
      "Includes a deeper and longer qna session",
      "-user account",
      "6 English + 6 Hindi AI VC",
      "All 12 having different personalities",
      "Real time venture capitalists connections",
      "Priority email support",
      "Analysis and improvement of your pitch",
      "Pitch improvement suggestions",
      "Personalised pitch generation",
    ],
    minutes: 500,
    popular: false,
    cta: "Contact us",
  },
};
