"use client";

import React, { useState } from "react";
import { Loader2, ArrowLeft, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { templateList } from "@/components/pitch-deck/templates";
import SlideRenderer from "@/components/pitch-deck/SlideRenderer";

type FieldDef = {
  label: string;
  name: string;
  required?: boolean;
  category: string;
  inputType: "short" | "long";
  rows?: number;
  placeholder: string;
  hint: string;
};

const fields: FieldDef[] = [
  // Company Overview
  {
    label: "Company Name",
    name: "companyName",
    required: true,
    category: "Company Overview",
    inputType: "short",
    placeholder: "e.g., Acme Corp",
    hint: "Your legal or brand company name.",
  },
  {
    label: "Tagline",
    name: "tagline",
    required: true,
    category: "Company Overview",
    inputType: "short",
    placeholder: "e.g., The future of freight logistics",
    hint: "A short, punchy one-liner (under 10 words) that captures the essence of your product.",
  },
  {
    label: "Industry",
    name: "industry",
    required: true,
    category: "Company Overview",
    inputType: "short",
    placeholder: "e.g., B2B SaaS / FinTech / HealthTech",
    hint: "The primary industry or sector your company operates in.",
  },
  {
    label: "Company Stage",
    name: "stage",
    category: "Company Overview",
    inputType: "short",
    placeholder: "e.g., Pre-seed, Seed, Series A",
    hint: "Your current funding or growth stage.",
  },
  {
    label: "Elevator Pitch",
    name: "elevatorPitch",
    required: true,
    category: "Company Overview",
    inputType: "long",
    rows: 3,
    placeholder:
      "e.g., We help mid-market SaaS companies reduce customer churn by 40% using AI-powered engagement automation, saving them over $2M annually in lost revenue.",
    hint: "2–3 sentences: what you do, for whom, and the core outcome you deliver. This drives the narrative of your entire deck — make it sharp and specific.",
  },
  {
    label: "Vision / Mission",
    name: "visionMission",
    category: "Company Overview",
    inputType: "long",
    rows: 2,
    placeholder:
      "e.g., To make enterprise-grade customer intelligence accessible to every SaaS company, regardless of size.",
    hint: "Your long-term aspiration. Where will this company be in 10 years? What world are you trying to create?",
  },
  {
    label: "Founded",
    name: "founded",
    category: "Company Overview",
    inputType: "short",
    placeholder: "e.g., 2022",
    hint: "Year the company was founded.",
  },
  {
    label: "Headquarters",
    name: "headquarters",
    category: "Company Overview",
    inputType: "short",
    placeholder: "e.g., San Francisco, CA",
    hint: "City and country where your company is based.",
  },
  {
    label: "Website",
    name: "website",
    category: "Company Overview",
    inputType: "short",
    placeholder: "https://yourcompany.com",
    hint: "Your company website URL.",
  },

  // Problem & Solution
  {
    label: "Problem Statement",
    name: "problemStatement",
    required: true,
    category: "Problem & Solution",
    inputType: "long",
    rows: 4,
    placeholder:
      "e.g., Mid-market SaaS companies lose 20–35% of their revenue annually to preventable churn. Existing tools only track churn after it happens — by then, it's too late. Customer success teams spend 60% of their time on manual analysis instead of proactive outreach.",
    hint: "Describe the pain in vivid, specific terms. Use numbers where possible. Show you deeply understand the customer's frustration.",
  },
  {
    label: "Solution Description",
    name: "solutionDescription",
    required: true,
    category: "Problem & Solution",
    inputType: "long",
    rows: 4,
    placeholder:
      "e.g., Our AI engine monitors 50+ behavioral signals in real time to predict churn 90 days in advance, then automatically triggers personalized re-engagement playbooks. CS teams act on insights, not data.",
    hint: "Explain your solution clearly. Focus on the transformation it enables, not just the features it has.",
  },
  {
    label: "Unique Value Proposition",
    name: "uniqueValueProposition",
    required: true,
    category: "Problem & Solution",
    inputType: "long",
    rows: 3,
    placeholder:
      "e.g., Unlike generic CRMs, we are purpose-built for churn prevention with a 3-minute integration, no data science team required, and ROI visible within the first 30 days.",
    hint: "What makes you different from every competitor or alternative? Be specific — not 'faster, cheaper, better' but why that's true for you.",
  },

  // Market & Competition
  {
    label: "Total Addressable Market (TAM)",
    name: "totalAddressableMarket",
    category: "Market & Competition",
    inputType: "short",
    placeholder: "e.g., $45B global CRM market (Gartner 2024)",
    hint: "The total revenue opportunity if you captured 100% of your market. Include a dollar figure and cite a source if possible.",
  },
  {
    label: "Serviceable Addressable Market (SAM)",
    name: "serviceableAddressableMarket",
    category: "Market & Competition",
    inputType: "short",
    placeholder: "e.g., $8B — mid-market SaaS companies in North America",
    hint: "The portion of TAM you can realistically target given your product, geography, and go-to-market.",
  },
  {
    label: "Serviceable Obtainable Market (SOM)",
    name: "serviceableObtainableMarket",
    category: "Market & Competition",
    inputType: "short",
    placeholder: "e.g., $400M — targeting 500 companies in year 1–3",
    hint: "The share of SAM you can realistically capture in the near term (3–5 years). This is your near-term revenue ceiling.",
  },
  {
    label: "Market Growth Rate",
    name: "marketGrowthRate",
    category: "Market & Competition",
    inputType: "short",
    placeholder: "e.g., 18% CAGR through 2028",
    hint: "How fast is your market growing annually? Include a source if you have one.",
  },
  {
    label: "Direct Competitors",
    name: "directCompetitors",
    category: "Market & Competition",
    inputType: "long",
    rows: 2,
    placeholder: "e.g., Gainsight, ChurnZero, Totango — all focused on enterprise, $50K+ ACV",
    hint: "Name your top 2–4 competitors and briefly note their positioning or weakness that you exploit.",
  },
  {
    label: "Competitive Advantage",
    name: "competitiveAdvantage",
    category: "Market & Competition",
    inputType: "long",
    rows: 3,
    placeholder:
      "e.g., We are the only solution with automated playbook execution (not just alerts), 3-minute no-code integration, and pricing accessible to companies under $5M ARR.",
    hint: "Why will you win? List 2–4 specific, defensible advantages — technology moat, distribution, data, or network effects.",
  },

  // Business Model
  {
    label: "Primary Revenue Streams",
    name: "primaryRevenueStreams",
    category: "Business Model",
    inputType: "long",
    rows: 3,
    placeholder:
      "e.g., SaaS subscription — Starter $499/mo (up to 1K customers), Growth $1,499/mo (up to 10K), Enterprise custom pricing. Annual plans at 20% discount.",
    hint: "Describe how you make money. Include pricing tiers, average contract value, or billing model (monthly/annual/usage-based).",
  },
  {
    label: "Pricing Model",
    name: "pricingModel",
    category: "Business Model",
    inputType: "short",
    placeholder: "e.g., Per-seat SaaS, usage-based, freemium + upsell",
    hint: "The pricing structure in brief — per seat, per usage, tiered subscription, etc.",
  },
  {
    label: "Unit Economics",
    name: "unitEconomics",
    category: "Business Model",
    inputType: "long",
    rows: 2,
    placeholder: "e.g., CAC: $1,200 | LTV: $18,000 | LTV/CAC: 15x | Payback period: 4 months",
    hint: "Customer Acquisition Cost, Lifetime Value, LTV/CAC ratio, and payback period. These signal business health to investors.",
  },

  // Traction & Milestones
  {
    label: "Total Customers",
    name: "totalCustomers",
    category: "Traction & Milestones",
    inputType: "short",
    placeholder: "e.g., 85 paying customers across 12 industries",
    hint: "Current number of paying customers (or users for consumer products). Be specific.",
  },
  {
    label: "Historical Revenue",
    name: "historicalRevenue",
    category: "Traction & Milestones",
    inputType: "short",
    placeholder: "e.g., $420K ARR, growing 15% MoM for last 6 months",
    hint: "Current ARR/MRR and recent growth rate. Show trajectory, not just absolute numbers.",
  },
  {
    label: "Business Traction",
    name: "businessTraction",
    category: "Traction & Milestones",
    inputType: "long",
    rows: 3,
    placeholder:
      "e.g., 3 enterprise pilots (Fortune 500), featured in TechCrunch, 92% NPS score, 0% churn in first 12 months, $1.2M in pipeline",
    hint: "Other key proof points: partnerships, press coverage, awards, NPS, retention rates, notable customers.",
  },
  {
    label: "Key Milestones",
    name: "keyMilestones",
    category: "Traction & Milestones",
    inputType: "long",
    rows: 4,
    placeholder:
      "e.g., Jan 2023: Founded & pre-seed raise of $500K | Apr 2023: MVP launched | Sep 2023: First 25 paying customers | Jan 2024: $250K ARR | Apr 2024: Series Seed of $2M",
    hint: "Timeline of your biggest achievements. Dates + event format. Shows momentum and execution ability.",
  },

  // Team & Funding
  {
    label: "Founding Team",
    name: "foundingTeam",
    required: true,
    category: "Team & Funding",
    inputType: "long",
    rows: 4,
    placeholder:
      "e.g., Jane Doe, CEO — Former PM at Salesforce, 10yr SaaS experience, 2x founder (exited 2019). John Smith, CTO — Ex-Staff Engineer at Stripe, led ML infra at scale, PhD CS Stanford.",
    hint: "Name, title, and 2-sentence bio for each founder. Highlight domain expertise, prior exits, notable employers, or academic credentials relevant to this company.",
  },
  {
    label: "Funding Goal",
    name: "fundingGoal",
    category: "Team & Funding",
    inputType: "short",
    placeholder: "e.g., $3M Seed Round",
    hint: "The exact amount you are raising and the round type.",
  },
  {
    label: "Use of Funds",
    name: "useOfFunds",
    category: "Team & Funding",
    inputType: "long",
    rows: 3,
    placeholder:
      "e.g., 50% Engineering (3 senior hires), 30% Sales & Marketing (2 AEs + demand gen), 20% Operations & G&A. Runway: 24 months to Series A.",
    hint: "How will you deploy the capital? Break it down by % or $ per function. Include projected runway and the milestone this raise gets you to.",
  },
  {
    label: "Previous Funding",
    name: "previousFunding",
    category: "Team & Funding",
    inputType: "short",
    placeholder: "e.g., $500K pre-seed from angels (2023). Bootstrapped before that.",
    hint: "Any prior funding rounds, grants, or revenue-based financing. Write 'Bootstrapped' if none.",
  },
  {
    label: "Exit Strategy",
    name: "exitStrategy",
    category: "Team & Funding",
    inputType: "long",
    rows: 2,
    placeholder:
      "e.g., Primary path is strategic acquisition by Salesforce, HubSpot, or SAP. Secondary path: IPO if we reach $100M ARR. Comparable exits: Gainsight (acquired by Vista for $1.1B).",
    hint: "How do investors get their return? Acquisition targets, IPO potential, or comparable exits in your space.",
  },
];

const categoryDescriptions: Record<string, string> = {
  "Company Overview":
    "Tell us about your company. The elevator pitch is the most important field — it shapes the entire deck's narrative.",
  "Problem & Solution":
    "Clearly articulate the pain point you solve and how your solution transforms the customer's situation.",
  "Market & Competition":
    "Quantify your market opportunity and explain specifically why you will win against alternatives.",
  "Business Model":
    "Show how you make money and the economics behind each customer relationship.",
  "Traction & Milestones":
    "Prove momentum with real numbers, customers, and a timeline of achievements.",
  "Team & Funding":
    "Introduce the founding team and tell investors exactly what you need from them.",
};

// sample slide for template preview
const sampleSlide = {
  slideType: "title",
  heading: "Your Company",
  subheading: "Innovation meets opportunity",
  bodyText: "Transforming the industry with cutting-edge solutions",
};

export default function CreatePitchDeck() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState("modern-dark");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const fieldsByCategory = fields.reduce(
    (acc, field) => {
      if (!acc[field.category]) acc[field.category] = [];
      acc[field.category].push(field);
      return acc;
    },
    {} as Record<string, FieldDef[]>
  );

  const categories = [...Object.keys(fieldsByCategory), "Choose Template"];
  const totalSteps = categories.length;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    if (!session) {
      toast.error("Please sign in to generate a pitch deck");
      return;
    }

    const missingRequired = fields.filter(
      (f) => f.required && (!formData[f.name] || !formData[f.name].trim())
    );

    if (missingRequired.length > 0) {
      toast.error(
        `Please fill required fields: ${missingRequired.map((f) => f.label).join(", ")}`
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pitch-deck/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyData: formData,
          templateId: selectedTemplate,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate deck");
      }

      const data = await res.json();
      toast.success("Pitch deck generated successfully!");
      router.push(`/pitch-deck/${data.deck._id}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate deck"
      );
    } finally {
      setLoading(false);
    }
  };

  const isTemplateStep = currentStep === totalSteps - 1;
  const currentCategory = categories[currentStep];
  const currentFields = fieldsByCategory[currentCategory] || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/pitch-deck")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Presentation className="h-8 w-8" />
              Create Pitch Deck
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in your company details and we&apos;ll generate a
              professional investor-ready pitch deck
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
            <div
              className="absolute top-0 left-0 h-full bg-primary/80 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="font-medium text-foreground">{currentCategory}</span>
          </div>
        </div>

        {/* Form Steps */}
        {!isTemplateStep ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentCategory}</CardTitle>
              <CardDescription>
                {categoryDescriptions[currentCategory] ||
                  "Fill out the relevant information for this section."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-7">
              {currentFields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>
                  {field.hint && (
                    <p className="text-xs text-muted-foreground leading-snug">
                      {field.hint}
                    </p>
                  )}
                  {field.inputType === "short" ? (
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.name === "website" ? "url" : "text"}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={field.rows ?? 3}
                      className="resize-none"
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          /* Template Selection Step */
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Choose a Template</CardTitle>
              <CardDescription>
                Select a visual style for your pitch deck. You can change this
                later in the editor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templateList.map((template) => (
                  <div
                    key={template.metadata.id}
                    className={`cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${
                      selectedTemplate === template.metadata.id
                        ? "border-primary ring-2 ring-primary/20 shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTemplate(template.metadata.id)}
                  >
                    <div className="pointer-events-none">
                      <SlideRenderer
                        slide={sampleSlide}
                        templateId={template.metadata.id}
                        className="w-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm">
                        {template.metadata.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.metadata.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0 || loading}
          >
            Previous
          </Button>

          {isTemplateStep ? (
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={loading}
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Deck...
                </>
              ) : (
                <>
                  <Presentation className="mr-2 h-4 w-4" />
                  Generate Pitch Deck
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentStep((p) => Math.min(totalSteps - 1, p + 1))
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
