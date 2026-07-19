import React from 'react';
import { Shield, Lock, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const privacyPoints = [
  {
    icon: Lock,
    title: "Complete Confidentiality",
    description:
      "Your pitch decks, financial data, and business strategies remain strictly confidential. We never share, sell, or disclose your information.",
    color: "bg-mint text-mint-foreground",
  },
  {
    icon: Eye,
    title: "Zero-Disclosure Policy",
    description:
      "No third-party sharing, no data mining, no cross-contamination. Your startup data is isolated and used only for your services.",
    color: "bg-yellow text-yellow-foreground",
  },
  {
    icon: CheckCircle2,
    title: "You Own Your Data",
    description:
      "Full access, correction, and deletion rights. Your intellectual property remains yours, always.",
    color: "bg-pink text-pink-foreground",
  },
];

export default function PrivacyPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lavender mb-4">
            <Shield className="w-8 h-8 text-lavender-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-ink mb-4">
            Your Privacy is Our Priority
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto">
            We understand that your startup&apos;s information is your most
            valuable asset. Your data stays confidential, secure, and
            completely under your control.
          </p>
        </div>

        {/* Key Points Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {privacyPoints.map((point) => (
            <div key={point.title} className="rounded-3xl bg-muted p-8">
              <div
                className={cn(
                  "inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4",
                  point.color
                )}
              >
                <point.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-ink mb-2">
                {point.title}
              </h3>
              <p className="text-ink/60">{point.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/privacy">
            <Button
              size="lg"
              variant="outline"
              className="group rounded-full border-ink/20"
            >
              Read Our Full Privacy Policy
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
