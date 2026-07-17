"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Check, X, DollarSign, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { plans, Plan } from "data/plans";

// ─── Early Bird Config ───────────────────────────────────────────────────────
const EARLY_BIRD_DISCOUNT = 0.5; // 50% off
const EARLY_BIRD_EXPIRY = new Date("2025-12-31");
const isEarlyBirdActive = new Date() < EARLY_BIRD_EXPIRY;

// Only show paid plans on the payment page (plans that have a Razorpay planId)
const PAID_PLANS = Object.values(plans).filter((p) => p.planId);

const cardAccents = ["bg-mint/25", "bg-yellow/25", "bg-pink/25", "bg-lavender/25"];

// ─── PricingCard ─────────────────────────────────────────────────────────────
const PricingCard = ({
  plan,
  submitPayment,
  loading,
  colorIndex,
}: {
  plan: Plan;
  submitPayment: (planId: string) => void;
  loading: boolean;
  colorIndex: number;
}) => {
  const isPopular = plan.popular;
  const discountedPrice =
    isEarlyBirdActive && plan.price > 0
      ? plan.price * EARLY_BIRD_DISCOUNT
      : plan.price;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1",
        isPopular
          ? "bg-ink text-cream"
          : cn(cardAccents[colorIndex % cardAccents.length], "text-foreground")
      )}
    >
      {/* Plan name + Popular badge */}
      <div className="flex items-center gap-3">
        <plan.icon className={cn("h-5 w-5", isPopular ? "text-cream/60" : "text-muted-foreground")} />
        <h2 className="text-xl font-semibold capitalize">{plan.name}</h2>
        {isPopular && (
          <Badge className="ml-auto bg-mint px-2 py-1 text-mint-foreground hover:bg-mint">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Most Popular
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className={cn("text-sm", isPopular ? "text-cream/60" : "text-muted-foreground")}>{plan.description}</p>

      {/* Price */}
      <div className="flex flex-col gap-1">
        {isEarlyBirdActive ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("line-through text-base flex items-center gap-0.5", isPopular ? "text-cream/40" : "text-muted-foreground")}>
              <DollarSign className="h-4 w-4" />
              {plan.price}
            </span>
            <span className="text-3xl font-bold flex items-center gap-0.5">
              <DollarSign className="h-6 w-6" />
              {discountedPrice}
            </span>
            <Badge
              variant="outline"
              className="text-mint-foreground border-none bg-mint text-xs"
            >
              50% OFF
            </Badge>
          </div>
        ) : (
          <span className="text-3xl font-bold flex items-center gap-0.5">
            <DollarSign className="h-6 w-6" />
            {plan.price}
          </span>
        )}
        <span className={cn("text-xs", isPopular ? "text-cream/40" : "text-muted-foreground")}>one-time</span>
      </div>

      {/* Feature list with ✅ / ❌ */}
      <ul className="flex-1 space-y-2">
        {plan.features.map((feature, index) => (
          <li
            key={index}
            className={cn(
              "flex items-start gap-2 text-sm",
              feature.included
                ? isPopular ? "text-cream/80" : "text-foreground/80"
                : isPopular ? "text-cream/30" : "text-muted-foreground/50"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5",
                feature.included
                  ? isPopular ? "bg-cream/15 text-cream" : "bg-ink/10 text-ink"
                  : isPopular ? "bg-cream/5 text-cream/30" : "bg-muted text-muted-foreground/50"
              )}
            >
              {feature.included ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </span>
            <span className={cn(!feature.included && "line-through")}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        variant={isPopular ? "secondary" : "default"}
        className="h-fit w-full rounded-full font-medium transition-all duration-300"
        onClick={() => submitPayment(plan.planId!)}
        disabled={loading}
      >
        {plan.cta}
      </Button>
    </div>
  );
};

// ─── PricingSection (Page) ───────────────────────────────────────────────────
export default function PricingSection() {
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();

  // Load Razorpay checkout script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (planId: string) => {
    if (loading) return;
    setLoading(true);

    try {
      if (!session || !session.user?._id) {
        toast.error("Please sign in to continue.");
        setLoading(false);
        router.prefetch("/login");
        setTimeout(() => router.push("/login"), 500);
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, userId: session.user._id }),
      });

      const data = await res.json();
      if (!data.key || !data.orderId) {
        toast.error("Failed to initialize payment.");
        setLoading(false);
        return;
      }

      // Push temporary route so back button works
      router.push("/payment", { scroll: false });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "PitchDesk",
        description: "Plan Subscription",
        prefill: {
          name: session.user.fullName,
          email: session.user.email,
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled. You can try again anytime.");
            setLoading(false);
            router.back();
          },
        },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch("/api/razorpay/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success("Payment successful! Redirecting...");
              await new Promise((r) => setTimeout(r, 500));
              await update();
              router.replace("/dashboard");
            } else {
              toast.error("Payment verification failed.");
              router.back();
            }
          } catch (err) {
            console.error(err);
            toast.error("Error verifying payment.");
            router.back();
          } finally {
            setLoading(false);
          }
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment error.");
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center mt-20 gap-10 py-16 bg-background">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl">Plans and Pricing</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Choose the plan that best suits your needs and start refining your
          pitch today.
        </p>
      </div>

      {/* Early Bird Banner */}
      {isEarlyBirdActive && (
        <div className="bg-mint text-mint-foreground rounded-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          Early Bird Offer: Get <b>50% Off</b> on all plans till{" "}
          {EARLY_BIRD_EXPIRY.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
          !
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {PAID_PLANS.map((plan, index) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            submitPayment={handlePayment}
            loading={loading}
            colorIndex={index}
          />
        ))}
      </div>
    </section>
  );
}
