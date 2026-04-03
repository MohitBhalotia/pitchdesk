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

const fields = [
  { label: "Company Name", name: "companyName", required: true, category: "Basic Information" },
  { label: "Tagline", name: "tagline", required: true, category: "Basic Information" },
  { label: "Industry", name: "industry", required: true, category: "Basic Information" },
  { label: "Founded", name: "founded", category: "Basic Information" },
  { label: "Headquarters", name: "headquarters", category: "Basic Information" },
  { label: "Website", name: "website", category: "Basic Information" },
  { label: "Problem Statement", name: "problemStatement", required: true, category: "Business Model" },
  { label: "Solution Description", name: "solutionDescription", required: true, category: "Business Model" },
  { label: "Unique Value Proposition", name: "uniqueValueProposition", required: true, category: "Business Model" },
  { label: "Total Addressable Market", name: "totalAddressableMarket", category: "Market Analysis" },
  { label: "Serviceable Addressable Market", name: "serviceableAddressableMarket", category: "Market Analysis" },
  { label: "Serviceable Obtainable Market", name: "serviceableObtainableMarket", category: "Market Analysis" },
  { label: "Market Growth Rate", name: "marketGrowthRate", category: "Market Analysis" },
  { label: "Direct Competitors", name: "directCompetitors", category: "Competition" },
  { label: "Competitive Advantage", name: "competitiveAdvantage", category: "Competition" },
  { label: "Primary Revenue Streams", name: "primaryRevenueStreams", category: "Business Operations" },
  { label: "Pricing Model", name: "pricingModel", category: "Business Operations" },
  { label: "Total Customers", name: "totalCustomers", category: "Traction & Financials" },
  { label: "Historical Revenue", name: "historicalRevenue", category: "Traction & Financials" },
  { label: "Business Traction", name: "businessTraction", category: "Traction & Financials" },
  { label: "Founding Team", name: "foundingTeam", category: "Team" },
  { label: "Key Personnel", name: "keyPersonnel", category: "Team" },
  { label: "Funding Goal", name: "fundingGoal", category: "Funding" },
  { label: "Use of Funds", name: "useOfFunds", category: "Funding" },
  { label: "Previous Funding", name: "previousFunding", category: "Funding" },
];

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

  const fieldsByCategory = fields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof fields>);

  const categories = [...Object.keys(fieldsByCategory), "Choose Template"];
  const totalSteps = categories.length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    const missingRequired = fields
      .filter((f) => f.required && (!formData[f.name] || !formData[f.name].trim()));

    if (missingRequired.length > 0) {
      toast.error(`Please fill required fields: ${missingRequired.map((f) => f.label).join(", ")}`);
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
      toast.error(error instanceof Error ? error.message : "Failed to generate deck");
    } finally {
      setLoading(false);
    }
  };

  const isTemplateStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/pitch-deck")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Presentation className="h-8 w-8" />
              Create Pitch Deck
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in your company details and we&apos;ll generate a professional pitch deck
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
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span className="font-medium text-foreground">{categories[currentStep]}</span>
          </div>
        </div>

        {/* Form Steps */}
        {!isTemplateStep ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{categories[currentStep]}</CardTitle>
              <CardDescription>Fill out the relevant information for this section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fieldsByCategory[categories[currentStep]]?.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.name === "website" ? (
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      placeholder="https://example.com"
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={3}
                      className="resize-none"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
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
              <CardDescription>Select a visual style for your pitch deck. You can change this later.</CardDescription>
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
                      <h3 className="font-semibold text-sm">{template.metadata.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{template.metadata.description}</p>
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
            <Button size="lg" onClick={handleGenerate} disabled={loading} className="min-w-[200px]">
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
            <Button onClick={() => setCurrentStep((p) => Math.min(totalSteps - 1, p + 1))}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
