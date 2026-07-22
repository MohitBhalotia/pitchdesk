"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Sparkles } from "lucide-react";
import { plans, type Plan, type FeatureItem } from "data/plans";
import { useSession } from "next-auth/react";

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

const planAccents = [
  "bg-mint text-mint-foreground",
  "bg-yellow text-yellow-foreground",
  "bg-pink text-pink-foreground",
  "bg-lavender text-lavender-foreground",
];

const planCardTints = ["bg-mint/20", "bg-yellow/20", "bg-pink/20", "bg-lavender/20"];

function boolCell(feature?: FeatureItem): CellValue {
  return feature?.included ? { kind: "check" } : { kind: "cross" };
}

function Cell({ value, inverted = false }: { value: CellValue; inverted?: boolean }) {
  if (value.kind === "check") {
    return (
      <div
        className={cn(
          "mx-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          inverted ? "bg-mint/20 text-mint" : "bg-mint-deep/10 text-mint-deep"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </div>
    );
  }
  if (value.kind === "cross") {
    return (
      <div
        className={cn(
          "mx-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          inverted ? "bg-destructive/20 text-destructive" : "bg-destructive/10 text-destructive"
        )}
      >
        <X className="h-3.5 w-3.5" />
      </div>
    );
  }
  return (
    <span className={cn("text-sm font-medium", inverted ? "text-cream" : "text-foreground")}>
      {value.text}
    </span>
  );
}

export default function SimplePricing() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const planList = Object.values(plans);
  const [selectedPlanId, setSelectedPlanId] = useState(
    planList.find((p) => p.popular)?.id ?? planList[0].id
  );
  const selectedPlan =
    planList.find((p) => p.id === selectedPlanId) ?? planList[0];
  const selectedIndex = planList.findIndex((p) => p.id === selectedPlan.id);

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
      className="not-prose py-20 md:py-28 relative flex w-full flex-col gap-12 overflow-hidden px-6 text-center"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <Badge
          variant="outline"
          className="border-none bg-lavender text-lavender-foreground rounded-full px-4 py-1 text-sm font-medium"
        >
          <Sparkles className="mr-1 h-3.5 w-3.5" />
          Simple, Transparent Pricing
        </Badge>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl text-3xl font-display font-extrabold text-ink sm:text-4xl"
        >
          Start free and scale as you grow
        </motion.h2>
        <p className="text-ink/60 max-w-md text-base">
          No hidden fees, no surprises — compare exactly what each plan
          includes.
        </p>
      </div>

      {/* Mobile: plan tabs + single full-detail card, no horizontal scrolling */}
      <div className="mx-auto w-full max-w-md text-left md:hidden">
        <div className="grid grid-cols-3 gap-2">
          {planList.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={cn(
                "truncate rounded-full px-3 py-2 text-sm font-medium transition-colors",
                plan.id === selectedPlan.id
                  ? "bg-ink text-cream"
                  : "bg-muted text-ink/60"
              )}
            >
              {plan.name}
            </button>
          ))}
        </div>

        <div
          className={cn(
            "relative mt-4 overflow-hidden rounded-3xl p-6",
            selectedPlan.popular
              ? "bg-ink text-cream"
              : cn(planCardTints[selectedIndex % planCardTints.length], "text-foreground")
          )}
        >
          {selectedPlan.popular && (
            <Badge className="absolute top-4 right-4 bg-mint text-mint-foreground px-3 py-0.5 text-xs">
              Most Popular
            </Badge>
          )}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                selectedPlan.popular
                  ? "bg-cream/10 text-cream"
                  : planAccents[selectedIndex % planAccents.length]
              )}
            >
              <selectedPlan.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display font-bold">{selectedPlan.name}</div>
              <p
                className={cn(
                  "text-xs leading-snug",
                  selectedPlan.popular ? "text-cream/60" : "text-ink/50"
                )}
              >
                {selectedPlan.description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold">
              {selectedPlan.price === 0 ? "Free" : `$${selectedPlan.price}`}
            </span>
            <span
              className={cn(
                "text-xs",
                selectedPlan.popular ? "text-cream/50" : "text-ink/40"
              )}
            >
              {selectedPlan.minutes} min practice
            </span>
          </div>

          <ul className="mt-6 space-y-3 border-t border-current/10 pt-6">
            {featureRows.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span
                  className={cn(
                    "min-w-0",
                    selectedPlan.popular ? "text-cream/80" : "text-foreground/80"
                  )}
                >
                  {row.label}
                </span>
                <div className="flex w-20 shrink-0 items-center justify-center">
                  <Cell value={row.getValue(selectedPlan)} inverted={selectedPlan.popular} />
                </div>
              </li>
            ))}
          </ul>

          {user?.role === selectedPlan.id ? (
            <Button
              size="sm"
              className="mt-6 w-full rounded-full bg-white text-black"
              disabled
            >
              Current Plan
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleCta}
              variant={selectedPlan.popular ? "secondary" : "outline"}
              className="mt-6 w-full rounded-full"
            >
              {selectedPlan.cta}
            </Button>
          )}
        </div>
      </div>

      {/* Desktop/tablet: full comparison table */}
      <div className="mx-auto hidden w-full max-w-6xl overflow-x-auto rounded-3xl border border-border md:block">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 w-56 bg-background p-5 align-bottom text-sm font-medium text-ink/60">
                Compare plans
              </th>
              {planList.map((plan, index) => (
                <th
                  key={plan.id}
                  className={cn(
                    "relative min-w-[150px] px-4 pt-8 pb-6 align-bottom",
                    plan.popular ? "bg-ink text-cream" : "bg-transparent"
                  )}
                >
                  {plan.popular ? (
                    <Badge className="absolute -top-3 right-0 left-0 mx-auto w-fit bg-mint text-mint-foreground px-3 py-0.5 text-xs">
                      Most Popular
                    </Badge>
                  ) : (
                    <div
                      className={cn(
                        "absolute left-4 right-4 top-0 h-1 rounded-full",
                        planAccents[index % planAccents.length].split(" ")[0]
                      )}
                    />
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        plan.popular
                          ? "bg-cream/10 text-cream"
                          : planAccents[index % planAccents.length]
                      )}
                    >
                      <plan.icon className="h-4 w-4" />
                    </div>
                    <span className="font-display font-bold">{plan.name}</span>
                    <span
                      className={cn(
                        "text-xs leading-snug max-w-[10rem]",
                        plan.popular ? "text-cream/60" : "text-ink/50"
                      )}
                    >
                      {plan.description}
                    </span>
                    <span
                      className={cn(
                        "flex items-baseline gap-1 font-display font-extrabold mt-1",
                        plan.popular ? "text-3xl" : "text-2xl"
                      )}
                    >
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    <span
                      className={cn(
                        "text-[11px]",
                        plan.popular ? "text-cream/50" : "text-ink/40"
                      )}
                    >
                      {plan.minutes} min practice
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
                      "px-4 py-3.5",
                      plan.popular && "bg-ink/[0.03]"
                    )}
                  >
                    <div className="flex items-center justify-center">
                      <Cell value={row.getValue(plan)} />
                    </div>
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
                    plan.popular && "bg-ink/[0.03]"
                  )}
                >
                  {user?.role === plan.id ? (
                    <Button
                      size="sm"
                      className="w-full rounded-full bg-white text-black"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleCta}
                      variant={plan.popular ? "secondary" : "outline"}
                      className="w-full rounded-full"
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
