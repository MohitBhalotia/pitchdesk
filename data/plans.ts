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
    description: "Perfect for founders taking their first pitch steps",
    features: [
      "10 minutes of AI pitch practice",
      "Includes Q&A & negotiation sessions",
      "Access to only one AI VC",
      "Personalized pitch generation with basic metrics",
      "Fundamental pitch analysis and improvements",
      "Basic email support",
      // "Single-user account",
    ],
    cta: "Start Free Today",
    minutes: 10,
    popular: false,
  },
  standard: {
    id: "standard",
    name: "Standard",
    icon: Zap,
    price: 399,
    description: "Everything you need to refine and perfect your pitch",
    features: [
      "100 minutes of comprehensive pitch practice",
      "Extended Q&A sessions with detailed feedback",
      "Access to all AI Venture Capitalists",
      "Advanced pitch analysis with actionable insights",
      "AI-powered improvement suggestions",
      "Personalized pitch generation with advanced metrics",
      "Priority email support",
      // "Single-user account",
    ],
    cta: "Start Growing",
    minutes: 100,
    popular: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    icon: Shield,
    price: 699,
    description: "Advanced tools for serious fundraising preparation",
    features: [
      "300 minutes of unlimited pitch mastery",
      "Deep-dive Q&A sessions with expert AI VCs",
      "Premium access to all AI Venture Capitalists",
      "Comprehensive pitch analysis with competitor benchmarking",
      "Advanced personalized pitch generation with more metrics",
      "Access to crowdfunding platform (coming soon)",
      "Progress tracking and performance analytics",
      "Dedicated support within 12 hours",
      // "Single-user account",
    ],
    cta: "Go Pro",
    minutes: 300,
    popular: true,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    icon: Shield,
    price: 1499,
    description: "Complete fundraising ecosystem for scaling startups",
    features: [
      "600 minutes of comprehensive pitch training",
      "Strategic Q&A sessions with expert AI VCs",
      "Premium access to all AI Venture Capitalists",
      "Comprehensive pitch analysis with competitor benchmarking",
      "Advanced personalized pitch generation with more metrics",
      "Access to crowdfunding platform & promotion (Coming soon)",
      "Connect with real VCs (Coming soon)",
      "Custom pitch templates and frameworks",
      "Progress tracking and performance analytics",
      "Premium customer support",
    ],
    minutes: 600,
    popular: false,
    cta: "Buy Enterprise",
  },
};
