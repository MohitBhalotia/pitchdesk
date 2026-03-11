import { LucideIcon, Shield, Star, Zap, Building2 } from "lucide-react";

export interface FeatureItem {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  planId?: string; // Razorpay plan ID (undefined for free/hobby plan)
  minutes: number;
  icon: LucideIcon;
  description: string;
  features: FeatureItem[];
  cta: string;
  popular: boolean;
}

export const plans: Record<string, Plan> = {
  hobby: {
    id: "hobby",
    name: "Hobby",
    icon: Star,
    price: 0,
    minutes: 10,
    description: "Perfect for founders taking their very first pitch steps",
    features: [
      {
        text: "10 minutes of live pitch practice time",
        included: true,
      },
      {
        text: "1 AI Venture Capitalist persona",
        included: true,
      },
      {
        text: "Idea Validator VC evaluate your startup concept before pitching",
        included: false,
      },
      {
        text: "Grilling Session survive tough rapid-fire investor Q&A with Griller VC",
        included: false,
      },
      {
        text: "Multilingual AI VCs",
        included: false,
      },
      {
        text: "Basic pitch score",
        included: true,
      },
      {
        text: "Pitch improvement suggestions with actionable feedback",
        included: false,
      },
      {
        text: "AI-generated Basic pitch script",
        included: true,
      },
      {
        text: "Pitch deck creation",
        included: false,
      },
      {
        text: "Shark Tank-style AI Multi-VC panel room",
        included: false,
      },
      {
        text: "AI Virtual Co-Founder",
        included: false,
      },
      {
        text: "Access to curated Investment Programs & funding opportunities",
        included: true,
      },
      {
        text: "Real-time tracking of your investment application status",
        included: false,
      },
      {
        text: "Direct introductions to real Venture Capitalists (coming soon)",
        included: false,
      },
    ],
    cta: "Start Free Today",
    popular: false,
  },

  mini: {
    id: "mini",
    name: "Mini",
    icon: Star,
    price: 2,
    planId: "6921acd6d8e375db6e5271f5",
    minutes: 30,
    description: "Everything you need to start refining and perfecting your pitch",
    features: [
      {
        text: "30 minutes of live AI pitch practice time",
        included: true,
      },
      {
        text: "3 AI Venture Capitalist personas for diverse pitch feedback",
        included: true,
      },
      {
        text: "Idea Validator VC evaluate your startup concept before pitching",
        included: true,
      },
      {
        text: "Grilling Session survive tough rapid-fire investor Q&A with Griller VC",
        included: false,
      },
      {
        text: "Multilingual AI VCs",
        included: false,
      },
      {
        text: "Detailed pitch score breakdown",
        included: true,
      },
      {
        text: "pitch improvement suggestions with actionable feedback",
        included: false,
      },
      {
        text: "Unlimited advanced AI pitch script generation",
        included: true,
      },
      {
        text: "pitch deck creation",
        included: false,
      },
      {
        text: "Shark Tank-style AI Multi-VC panel room",
        included: false,
      },
      {
        text: "AI Virtual Co-Founder",
        included: false,
      },
      {
        text: "Access to curated Investment Programs & funding opportunities",
        included: true,
      },
      {
        text: "Real-time tracking of your investment application status",
        included: false,
      },
      {
        text: "Direct introductions to real Venture Capitalists (coming soon)",
        included: false,
      },
    ],
    cta: "Buy Now",
    popular: false,
  },

  standard: {
    id: "standard",
    name: "Standard",
    icon: Zap,
    price: 8,
    planId: "68aa8cbf5958f9468e59ca14",
    minutes: 150,
    description: "Level up your pitch preparation with advanced AI tools",
    features: [
      {
        text: "150 minutes of live AI pitch practice time",
        included: true,
      },
      {
        text: "6 AI Venture Capitalist personas for comprehensive pitch feedback",
        included: true,
      },
      {
        text: "Idea Validator VC evaluate your startup concept before pitching",
        included: true,
      },
      {
        text: "Grilling Session survive tough rapid-fire investor Q&A with Griller VC",
        included: true,
      },
      {
        text: "Multilingual AI VCs",
        included: false,
      },
      {
        text: "Detailed pitch score breakdown",
        included: true,
      },
      {
        text: "pitch improvement suggestions with actionable feedback",
        included: true,
      },
      {
        text: "Unlimited advanced AI pitch script generation",
        included: true,
      },
      {
        text: "Create up to 2 professional AI-generated pitch decks",
        included: true,
      },
      {
        text: "Shark Tank-style AI Multi-VC panel room",
        included: false,
      },
      {
        text: "AI Virtual Co-Founder",
        included: false,
      },
      {
        text: "Access to curated Investment Programs & funding opportunities",
        included: true,
      },
      {
        text: "Real-time tracking of your investment application status",
        included: true,
      },
      {
        text: "Direct introductions to real Venture Capitalists (coming soon)",
        included: false,
      },
    ],
    cta: "Start Growing",
    popular: false,
  },

  pro: {
    id: "pro",
    name: "Pro",
    icon: Shield,
    price: 15,
    planId: "68aa8cbf5958f9468e59ca15",
    minutes: 350,
    description: "Advanced AI tools built for serious fundraising preparation",
    features: [
      {
        text: "350 minutes of live AI pitch practice time",
        included: true,
      },
      {
        text: "6 AI Venture Capitalist personas for comprehensive pitch feedback",
        included: true,
      },
      {
        text: "Idea Validator VC evaluate your startup concept before pitching",
        included: true,
      },
      {
        text: "Grilling Session survive tough rapid-fire investor Q&A with Griller VC",
        included: true,
      },
      {
        text: "Multilingual AI VCs",
        included: true,
      },
      {
        text: "Detailed pitch score breakdown",
        included: true,
      },
      {
        text: "pitch improvement suggestions with actionable feedback",
        included: true,
      },
      {
        text: "Unlimited advanced AI pitch script generation",
        included: true,
      },
      {
        text: "Create up to 10 professional AI-generated pitch decks",
        included: true,
      },
      {
        text: "Shark Tank-style AI Multi-VC panel room",
        included: true,
      },
      {
        text: "AI Virtual Co-Founder",
        included: true,
      },
      {
        text: "Access to curated Investment Programs & funding opportunities",
        included: true,
      },
      {
        text: "Real-time tracking of your investment application status",
        included: true,
      },
      {
        text: "Direct introductions to real Venture Capitalists (coming soon)",
        included: false,
      },
    ],
    cta: "Go Pro",
    popular: true,
  },

  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    price: 25,
    planId: "68aa8cbf5958f9468e59ca16",
    minutes: 600,
    description: "The complete fundraising ecosystem for scaling startups",
    features: [
      {
        text: "600 minutes of live AI pitch practice time",
        included: true,
      },
      {
        text: "6 AI Venture Capitalist personas for comprehensive pitch feedback",
        included: true,
      },
      {
        text: "Idea Validator VC evaluate your startup concept before pitching",
        included: true,
      },
      {
        text: "Grilling Session survive tough rapid-fire investor Q&A with Griller VC",
        included: true,
      },
      {
        text: "Multilingual AI VCs",
        included: true,
      },
      {
        text: "Detailed pitch score breakdown",
        included: true,
      },
      {
        text: "pitch improvement suggestions with actionable feedback",
        included: true,
      },
      {
        text: "Unlimited  advanced AI pitch script generation",
        included: true,
      },
      {
        text: "Create up to 50 professional AI-generated pitch decks",
        included: true,
      },
      {
        text: "Shark Tank-style AI Multi-VC panel room",
        included: true,
      },
      {
        text: "AI Virtual Co-Founder",
        included: true,
      },
      {
        text: "Access to curated Investment Programs & funding opportunities",
        included: true,
      },
      {
        text: "Real-time tracking of your investment application status",
        included: true,
      },
      {
        text: "Direct introductions to real Venture Capitalists (coming soon)",
        included: true,
      },
    ],
    cta: "Buy Enterprise",
    popular: false,
  },
};
