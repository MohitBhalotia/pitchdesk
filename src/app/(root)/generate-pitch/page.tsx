// "use client"

// import { useState } from "react";

// const fields = [
//   {
//     label: "Company Name",
//     name: "companyName",
//     required: true,
//   },
//   {
//     label: "Tagline",
//     name: "tagline",
//   },
//   {
//     label: "Industry",
//     name: "industry",
//   },
//   {
//     label: "Founded",
//     name: "founded",
//   },
//   {
//     label: "Headquarters",
//     name: "headquarters",
//   },
//   {
//     label: "Website",
//     name: "website",
//   },
//   {
//     label: "Problem Statement",
//     name: "problemStatement",
//   },
//   {
//     label: "Solution Description",
//     name: "solutionDescription",
//   },
//   {
//     label: "Unique Value Proposition",
//     name: "uniqueValueProposition",
//   },
//   {
//     label: "Total Addressable Market",
//     name: "totalAddressableMarket",
//   },
//   {
//     label: "Serviceable Addressable Market",
//     name: "serviceableAddressableMarket",
//   },
//   {
//     label: "Serviceable Obtainable Market",
//     name: "serviceableObtainableMarket",
//   },
//   {
//     label: "Market Growth Rate",
//     name: "marketGrowthRate",
//   },
//   {
//     label: "Direct Competitors",
//     name: "directCompetitors",
//   },
//   {
//     label: "Indirect Competitors",
//     name: "indirectCompetitors",
//   },
//   {
//     label: "Competitive Advantage",
//     name: "competitiveAdvantage",
//   },
//   {
//     label: "Barrier to Entry",
//     name: "barrierToEntry",
//   },
//   {
//     label: "Historical Revenue",
//     name: "historicalRevenue",
//   },
//   {
//     label: "Historical Expenses",
//     name: "historicalExpenses",
//   },
//   {
//     label: "Profitability Status",
//     name: "profitabilityStatus",
//   },
//   {
//     label: "Total Customers",
//     name: "totalCustomers",
//   },
//   {
//     label: "Customer Acquisition Cost",
//     name: "customerAcquisitionCost",
//   },
//   {
//     label: "Customer Lifetime Value",
//     name: "customerLifetimeValue",
//   },
//   {
//     label: "Churn Rate",
//     name: "churnRate",
//   },
//   {
//     label: "Gross Margin",
//     name: "grossMargin",
//   },
//   {
//     label: "Contribution Margin",
//     name: "contributionMargin",
//   },
//   {
//     label: "Payback Period",
//     name: "paybackPeriod",
//   },
//   {
//     label: "Year 1 Revenue",
//     name: "year1Revenue",
//   },
//   {
//     label: "Year 2 Revenue",
//     name: "year2Revenue",
//   },
//   {
//     label: "Year 3 Revenue",
//     name: "year3Revenue",
//   },
//   {
//     label: "Revenue Growth Rate",
//     name: "revenueGrowthRate",
//   },
//   {
//     label: "Operating Expenses",
//     name: "operatingExpenses",
//   },
//   {
//     label: "Marketing Budget",
//     name: "marketingBudget",
//   },
//   {
//     label: "R&D Expenses",
//     name: "rdExpenses",
//   },
//   {
//     label: "Primary Revenue Streams",
//     name: "primaryRevenueStreams",
//   },
//   {
//     label: "Pricing Model",
//     name: "pricingModel",
//   },
//   {
//     label: "Sales Channels",
//     name: "salesChannels",
//   },
//   {
//     label: "Business Operations",
//     name: "businessOperations",
//   },
//   {
//     label: "Technology Stack",
//     name: "technologyStack",
//   },
//   {
//     label: "Key Partnerships",
//     name: "keyPartnerships",
//   },
//   {
//     label: "Founding Team",
//     name: "foundingTeam",
//   },
//   {
//     label: "Founder Experience",
//     name: "founderExperience",
//   },
//   {
//     label: "Key Personnel",
//     name: "keyPersonnel",
//   },
//   {
//     label: "Advisors",
//     name: "advisors",
//   },
//   {
//     label: "Product Stage",
//     name: "productStage",
//   },
//   {
//     label: "Development Milestones",
//     name: "developmentMilestones",
//   },
//   {
//     label: "Customer Validation",
//     name: "customerValidation",
//   },
//   {
//     label: "Pilot Programs",
//     name: "pilotPrograms",
//   },
//   {
//     label: "Business Traction",
//     name: "businessTraction",
//   },
//   {
//     label: "Partnerships",
//     name: "partnerships",
//   },
//   {
//     label: "Previous Funding",
//     name: "previousFunding",
//   },
//   {
//     label: "Current Investors",
//     name: "currentInvestors",
//   },
//   {
//     label: "Funding Goal",
//     name: "fundingGoal",
//   },
//   {
//     label: "Use of Funds",
//     name: "useOfFunds",
//   },
//   {
//     label: "Valuation",
//     name: "valuation",
//   },
//   {
//     label: "Future Strategy",
//     name: "futureStrategy",
//   },
//   {
//     label: "Exit Strategy",
//     name: "exitStrategy",
//   },
//   {
//     label: "Key Metrics",
//     name: "keyMetrics",
//   },
//   {
//     label: "Risk Factors",
//     name: "riskFactors",
//   },
//   {
//     label: "Personal Story",
//     name: "personalStory",
//   },
//   {
//     label: "Supporting Materials",
//     name: "supportingMaterials",
//   },
// ];

// export default function PitchForm() {
//   const [pitch, setPitch] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData(e.currentTarget);

//     try {
//       const res = await fetch("http://localhost:8080/generate-pitch", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await res.json();
//       setPitch(result.pitch || "No pitch generated.");
//     } catch (err) {
//       console.error(err);
//       setPitch("Error generating pitch.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">Startup Pitch Generator</h1>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {fields.map((field) => (
//           <div key={field.name}>
//             <label htmlFor={field.name} className="block font-semibold">
//               {field.label}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             <textarea
//               id={field.name}
//               name={field.name}
//               rows={2}
//               className="w-full mt-1 p-2 border rounded"
//               required={field.required}
//             />
//           </div>
//         ))}

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//           disabled={loading}
//         >
//           {loading ? "Generating..." : "Generate Pitch"}
//         </button>
//       </form>

//       {pitch && (
//         <div className="mt-10 p-4 bg-gray-100 border rounded">
//           <h2 className="text-xl font-bold mb-2">Generated Pitch</h2>
//           <p className="whitespace-pre-line">{pitch}</p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client"

import type React from "react"

import { useState } from "react"
import { Moon, Sun, Download, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import jsPDF from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const fields = [
  {
    label: "Company Name",
    name: "companyName",
    required: true,
    category: "Basic Information",
  },
  {
    label: "Tagline",
    name: "tagline",
    category: "Basic Information",
  },
  {
    label: "Industry",
    name: "industry",
    category: "Basic Information",
  },
  {
    label: "Founded",
    name: "founded",
    category: "Basic Information",
  },
  {
    label: "Headquarters",
    name: "headquarters",
    category: "Basic Information",
  },
  {
    label: "Website",
    name: "website",
    category: "Basic Information",
  },
  {
    label: "Problem Statement",
    name: "problemStatement",
    category: "Business Model",
  },
  {
    label: "Solution Description",
    name: "solutionDescription",
    category: "Business Model",
  },
  {
    label: "Unique Value Proposition",
    name: "uniqueValueProposition",
    category: "Business Model",
  },
  {
    label: "Total Addressable Market",
    name: "totalAddressableMarket",
    category: "Market Analysis",
  },
  {
    label: "Serviceable Addressable Market",
    name: "serviceableAddressableMarket",
    category: "Market Analysis",
  },
  {
    label: "Serviceable Obtainable Market",
    name: "serviceableObtainableMarket",
    category: "Market Analysis",
  },
  {
    label: "Market Growth Rate",
    name: "marketGrowthRate",
    category: "Market Analysis",
  },
  {
    label: "Direct Competitors",
    name: "directCompetitors",
    category: "Competition",
  },
  {
    label: "Indirect Competitors",
    name: "indirectCompetitors",
    category: "Competition",
  },
  {
    label: "Competitive Advantage",
    name: "competitiveAdvantage",
    category: "Competition",
  },
  {
    label: "Barrier to Entry",
    name: "barrierToEntry",
    category: "Competition",
  },
  {
    label: "Historical Revenue",
    name: "historicalRevenue",
    category: "Financial Metrics",
  },
  {
    label: "Historical Expenses",
    name: "historicalExpenses",
    category: "Financial Metrics",
  },
  {
    label: "Profitability Status",
    name: "profitabilityStatus",
    category: "Financial Metrics",
  },
  {
    label: "Total Customers",
    name: "totalCustomers",
    category: "Financial Metrics",
  },
  {
    label: "Customer Acquisition Cost",
    name: "customerAcquisitionCost",
    category: "Financial Metrics",
  },
  {
    label: "Customer Lifetime Value",
    name: "customerLifetimeValue",
    category: "Financial Metrics",
  },
  {
    label: "Churn Rate",
    name: "churnRate",
    category: "Financial Metrics",
  },
  {
    label: "Gross Margin",
    name: "grossMargin",
    category: "Financial Metrics",
  },
  {
    label: "Contribution Margin",
    name: "contributionMargin",
    category: "Financial Metrics",
  },
  {
    label: "Payback Period",
    name: "paybackPeriod",
    category: "Financial Metrics",
  },
  {
    label: "Year 1 Revenue",
    name: "year1Revenue",
    category: "Financial Projections",
  },
  {
    label: "Year 2 Revenue",
    name: "year2Revenue",
    category: "Financial Projections",
  },
  {
    label: "Year 3 Revenue",
    name: "year3Revenue",
    category: "Financial Projections",
  },
  {
    label: "Revenue Growth Rate",
    name: "revenueGrowthRate",
    category: "Financial Projections",
  },
  {
    label: "Operating Expenses",
    name: "operatingExpenses",
    category: "Financial Projections",
  },
  {
    label: "Marketing Budget",
    name: "marketingBudget",
    category: "Financial Projections",
  },
  {
    label: "R&D Expenses",
    name: "rdExpenses",
    category: "Financial Projections",
  },
  {
    label: "Primary Revenue Streams",
    name: "primaryRevenueStreams",
    category: "Business Operations",
  },
  {
    label: "Pricing Model",
    name: "pricingModel",
    category: "Business Operations",
  },
  {
    label: "Sales Channels",
    name: "salesChannels",
    category: "Business Operations",
  },
  {
    label: "Business Operations",
    name: "businessOperations",
    category: "Business Operations",
  },
  {
    label: "Technology Stack",
    name: "technologyStack",
    category: "Business Operations",
  },
  {
    label: "Key Partnerships",
    name: "keyPartnerships",
    category: "Business Operations",
  },
  {
    label: "Founding Team",
    name: "foundingTeam",
    category: "Team & Leadership",
  },
  {
    label: "Founder Experience",
    name: "founderExperience",
    category: "Team & Leadership",
  },
  {
    label: "Key Personnel",
    name: "keyPersonnel",
    category: "Team & Leadership",
  },
  {
    label: "Advisors",
    name: "advisors",
    category: "Team & Leadership",
  },
  {
    label: "Product Stage",
    name: "productStage",
    category: "Traction & Validation",
  },
  {
    label: "Development Milestones",
    name: "developmentMilestones",
    category: "Traction & Validation",
  },
  {
    label: "Customer Validation",
    name: "customerValidation",
    category: "Traction & Validation",
  },
  {
    label: "Pilot Programs",
    name: "pilotPrograms",
    category: "Traction & Validation",
  },
  {
    label: "Business Traction",
    name: "businessTraction",
    category: "Traction & Validation",
  },
  {
    label: "Partnerships",
    name: "partnerships",
    category: "Traction & Validation",
  },
  {
    label: "Previous Funding",
    name: "previousFunding",
    category: "Funding & Investment",
  },
  {
    label: "Current Investors",
    name: "currentInvestors",
    category: "Funding & Investment",
  },
  {
    label: "Funding Goal",
    name: "fundingGoal",
    category: "Funding & Investment",
  },
  {
    label: "Use of Funds",
    name: "useOfFunds",
    category: "Funding & Investment",
  },
  {
    label: "Valuation",
    name: "valuation",
    category: "Funding & Investment",
  },
  {
    label: "Future Strategy",
    name: "futureStrategy",
    category: "Strategic Planning",
  },
  {
    label: "Exit Strategy",
    name: "exitStrategy",
    category: "Strategic Planning",
  },
  {
    label: "Key Metrics",
    name: "keyMetrics",
    category: "Strategic Planning",
  },
  {
    label: "Risk Factors",
    name: "riskFactors",
    category: "Strategic Planning",
  },
  {
    label: "Personal Story",
    name: "personalStory",
    category: "Additional Information",
  },
  {
    label: "Supporting Materials",
    name: "supportingMaterials",
    category: "Additional Information",
  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function PitchGenerator() {
  const [pitch, setPitch] = useState("")
  const [loading, setLoading] = useState(false)

  // Group fields by category
  const fieldsByCategory = fields.reduce(
    (acc, field) => {
      if (!acc[field.category]) {
        acc[field.category] = []
      }
      acc[field.category].push(field)
      return acc
    },
    {} as Record<string, typeof fields>,
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("http://localhost:8080/generate-pitch", {
        method: "POST",
        body: formData,
      })
      const result = await res.json()
      setPitch(result.pitch || "No pitch generated.")
    } catch (err) {
      console.error(err)
      setPitch("Error generating pitch.")
    } finally {
      setLoading(false)
    }
  }

  function downloadPDF() {
    if (!pitch) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const margin = 20
    const maxWidth = pageWidth - 2 * margin

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Startup Pitch", margin, 30)

    // Content
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    const lines = doc.splitTextToSize(pitch, maxWidth)
    let yPosition = 50

    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
      }
      doc.text(line, margin, yPosition)
      yPosition += 7
    })

    doc.save("startup-pitch.pdf")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Startup Pitch Generator</h1>
            <p className="text-muted-foreground mt-2">
              Create a compelling pitch for your startup by filling out the form below
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {Object.entries(fieldsByCategory).map(([category, categoryFields]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-xl">{category}</CardTitle>
                    <CardDescription>Fill out the relevant information for this section</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {categoryFields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name} className="text-sm font-medium">
                          {field.label}
                          {field.required && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Required
                            </Badge>
                          )}
                        </Label>
                        {field.name === "website" ? (
                          <Input
                            id={field.name}
                            name={field.name}
                            type="url"
                            placeholder="https://example.com"
                            required={field.required}
                            className="w-full"
                          />
                        ) : (
                          <Textarea
                            id={field.name}
                            name={field.name}
                            rows={3}
                            required={field.required}
                            className="w-full resize-none"
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-center pt-6">
                <Button type="submit" size="lg" disabled={loading} className="w-full max-w-md">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Pitch...
                    </>
                  ) : (
                    "Generate Pitch"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Generated Pitch
                    {pitch && (
                      <Button variant="outline" size="sm" onClick={downloadPDF} className="ml-2 bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>Your generated pitch will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : pitch ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-sm leading-relaxed">{pitch}</div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Fill out the form and click "Generate Pitch" to see your startup pitch here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
