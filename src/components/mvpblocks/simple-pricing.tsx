"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Sparkles } from "lucide-react";
import { plans, type Plan, type FeatureItem } from "data/plans";
import { useSession } from "next-auth/react";

// 🏷️ Early Bird Offer Setup
const EARLY_BIRD_DISCOUNT = 0.5; // 50% off
const EARLY_BIRD_EXPIRY = new Date("2025-12-31");
const isEarlyBirdActive = new Date() < EARLY_BIRD_EXPIRY;

type CellValue =
  | { kind: "check" }
  | { kind: "cross" }
  | { kind: "text"; text: string };

interface FeatureRow {
  label: string;
  getValue: (plan: Plan) => CellValue;
}

// Feature arrays in data/plans.ts are positionally aligned (same 14 items,
// same order, across every plan) — these rows read that structure directly
// rather than duplicating the underlying copy.
const featureRows: FeatureRow[] = [
  {
    label: "Live pitch practice time",
    getValue: (plan) => ({ kind: "text", text: `${plan.minutes} min` }),
  },
  {
    label: "AI Venture Capitalist personas",
    getValue: (plan) => {
      const match = plan.features[1]?.text.match(/^(\d+)/);
      return { kind: "text", text: match ? match[1] : "-" };
    },
  },
  {
    label: "Idea Validator VC",
    getValue: (plan) => boolCell(plan.features[2]),
  },
  {
    label: "Grilling Session (rapid-fire Q&A)",
    getValue: (plan) => boolCell(plan.features[3]),
  },
  {
    label: "Multilingual AI VCs",
    getValue: (plan) => boolCell(plan.features[4]),
  },
  {
    label: "Pitch score depth",
    getValue: (plan) => ({
      kind: "text",
      text: plan.features[5]?.text.startsWith("Basic") ? "Basic" : "Detailed",
    }),
  },
  {
    label: "Pitch improvement suggestions",
    getValue: (plan) => boolCell(plan.features[6]),
  },
  {
    label: "AI pitch script generation",
    getValue: (plan) => ({
      kind: "text",
      text: plan.features[7]?.included
        ? plan.features[7].text.startsWith("AI-generated")
          ? "Basic"
          : "Unlimited"
        : "-",
    }),
  },
  {
    label: "AI pitch deck creation",
    getValue: (plan) => {
      const feature = plan.features[8];
      if (!feature?.included) return { kind: "cross" };
      const match = feature.text.match(/up to (\d+)/);
      return { kind: "text", text: match ? `${match[1]} decks` : "Included" };
    },
  },
  {
    label: "Multi-VC panel room (Shark Tank-style)",
    getValue: (plan) => boolCell(plan.features[9]),
  },
  {
    label: "AI Virtual Co-Founder",
    getValue: (plan) => boolCell(plan.features[10]),
  },
  {
    label: "Investment Programs access",
    getValue: (plan) => boolCell(plan.features[11]),
  },
  {
    label: "Application status tracking",
    getValue: (plan) => boolCell(plan.features[12]),
  },
  {
    label: "Direct VC introductions (coming soon)",
    getValue: (plan) => boolCell(plan.features[13]),
  },
];

function boolCell(feature?: FeatureItem): CellValue {
  return feature?.included ? { kind: "check" } : { kind: "cross" };
}

function Cell({ value }: { value: CellValue }) {
  if (value.kind === "check") {
    return (
      <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check className="h-3.5 w-3.5" />
      </div>
    );
  }
  if (value.kind === "cross") {
    return (
      <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground/50">
        <X className="h-3.5 w-3.5" />
      </div>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value.text}</span>;
}

export default function SimplePricing() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const planList = Object.values(plans);

  const handleCta = () => {
    if (user) {
      router.push("/payment");
      toast.success("Redirecting to checkout...");
    } else {
      toast.info("Please log in to continue");
      router.push("/login");
    }
  };

  return (
    <div
      id="pricing"
      className="not-prose py-16 relative flex w-full flex-col gap-12 overflow-hidden px-4 text-center"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <Badge
          variant="outline"
          className="border-primary/20 bg-primary/5 rounded-full px-4 py-1 text-sm font-medium"
        >
          <Sparkles className="text-primary mr-1 h-3.5 w-3.5" />
          Simple, Transparent Pricing
        </Badge>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl text-3xl font-bold sm:text-4xl"
        >
          Start free and scale as you grow
        </motion.h2>
        <p className="text-muted-foreground max-w-md text-base">
          No hidden fees, no surprises — compare exactly what each plan
          includes.
        </p>

        {isEarlyBirdActive && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            Early Bird Offer: Get <b className="mx-1">50% Off</b> on all plans
            till{" "}
            {EARLY_BIRD_EXPIRY.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
            !
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-6xl overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 w-56 bg-background p-5 align-bottom text-sm font-medium text-muted-foreground">
                Compare plans
              </th>
              {planList.map((plan) => (
                <th
                  key={plan.id}
                  className={cn(
                    "relative min-w-[140px] px-4 py-6 align-bottom",
                    plan.popular && "bg-primary/[0.04]"
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 right-0 left-0 mx-auto w-fit bg-primary text-primary-foreground px-3 py-0.5 text-xs">
                      Popular
                    </Badge>
                  )}
                  <div className="flex flex-col items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full",
                        plan.popular
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-foreground"
                      )}
                    >
                      <plan.icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold">{plan.name}</span>
                    <span className="flex items-baseline gap-1 text-2xl font-bold">
                      {plan.price === 0 ? (
                        "Free"
                      ) : isEarlyBirdActive ? (
                        <>
                          <span className="text-sm font-normal text-muted-foreground line-through">
                            ${plan.price}
                          </span>
                          ${plan.price * EARLY_BIRD_DISCOUNT}
                        </>
                      ) : (
                        `$${plan.price}`
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureRows.map((row, i) => (
              <tr
                key={row.label}
                className={cn(
                  "border-b border-border/70",
                  i % 2 === 1 && "bg-muted/30"
                )}
              >
                <td
                  className={cn(
                    "sticky left-0 z-10 px-5 py-3.5 text-sm text-foreground",
                    i % 2 === 1 ? "bg-muted/30" : "bg-background"
                  )}
                >
                  {row.label}
                </td>
                {planList.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn(
                      "px-4 py-3.5 text-center",
                      plan.popular && "bg-primary/[0.03]"
                    )}
                  >
                    <Cell value={row.getValue(plan)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border">
              <td className="sticky left-0 z-10 bg-background px-5 py-6" />
              {planList.map((plan) => (
                <td
                  key={plan.id}
                  className={cn(
                    "px-4 py-6 align-top",
                    plan.popular && "bg-primary/[0.04]"
                  )}
                >
                  {user?.role === plan.id ? (
                    <Button
                      size="sm"
                      className="w-full bg-white text-black"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleCta}
                      variant={plan.popular ? "default" : "outline"}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
