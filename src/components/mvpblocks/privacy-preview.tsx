import React from 'react';
import { Shield, Lock, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPreview() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Privacy is Our Priority
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We understand that your startup&apos;s information is your most valuable asset. 
            Your data stays confidential, secure, and completely under your control.
          </p>
        </div>

        {/* Key Points Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Complete Confidentiality</h3>
            <p className="text-muted-foreground">
              Your pitch decks, financial data, and business strategies remain strictly confidential. 
              We never share, sell, or disclose your information.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Zero-Disclosure Policy</h3>
            <p className="text-muted-foreground">
              No third-party sharing, no data mining, no cross-contamination. 
              Your startup data is isolated and used only for your services.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">You Own Your Data</h3>
            <p className="text-muted-foreground">
              Full access, correction, and deletion rights. 
              Your intellectual property remains yours, always.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/privacy">
            <Button size="lg" variant="outline" className="group">
              Read Our Full Privacy Policy
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
