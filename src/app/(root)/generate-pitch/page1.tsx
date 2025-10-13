// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Loader2, Download } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import jsPDF from "jspdf"
// import { useRouter } from "next/navigation"
// import { useSession } from "next-auth/react"

// const fields = [
//   {
//     label: "Company Name",
//     name: "companyName",
//     required: true,
//     category: "Basic Information",
//   },
//   {
//     label: "Tagline",
//     name: "tagline",
//     category: "Basic Information",
//   },
//   {
//     label: "Industry",
//     name: "industry",
//     category: "Basic Information",
//   },
//   {
//     label: "Founded",
//     name: "founded",
//     category: "Basic Information",
//   },
//   {
//     label: "Headquarters",
//     name: "headquarters",
//     category: "Basic Information",
//   },
//   {
//     label: "Website",
//     name: "website",
//     category: "Basic Information",
//   },
//   {
//     label: "Problem Statement",
//     name: "problemStatement",
//     category: "Business Model",
//   },
//   {
//     label: "Solution Description",
//     name: "solutionDescription",
//     category: "Business Model",
//   },
//   {
//     label: "Unique Value Proposition",
//     name: "uniqueValueProposition",
//     category: "Business Model",
//   },
//   {
//     label: "Total Addressable Market",
//     name: "totalAddressableMarket",
//     category: "Market Analysis",
//   },
//   {
//     label: "Serviceable Addressable Market",
//     name: "serviceableAddressableMarket",
//     category: "Market Analysis",
//   },
//   {
//     label: "Serviceable Obtainable Market",
//     name: "serviceableObtainableMarket",
//     category: "Market Analysis",
//   },
//   {
//     label: "Market Growth Rate",
//     name: "marketGrowthRate",
//     category: "Market Analysis",
//   },
//   {
//     label: "Direct Competitors",
//     name: "directCompetitors",
//     category: "Competition",
//   },
//   {
//     label: "Indirect Competitors",
//     name: "indirectCompetitors",
//     category: "Competition",
//   },
//   {
//     label: "Competitive Advantage",
//     name: "competitiveAdvantage",
//     category: "Competition",
//   },
//   {
//     label: "Barrier to Entry",
//     name: "barrierToEntry",
//     category: "Competition",
//   },
//   {
//     label: "Historical Revenue",
//     name: "historicalRevenue",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Historical Expenses",
//     name: "historicalExpenses",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Profitability Status",
//     name: "profitabilityStatus",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Total Customers",
//     name: "totalCustomers",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Customer Acquisition Cost",
//     name: "customerAcquisitionCost",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Customer Lifetime Value",
//     name: "customerLifetimeValue",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Churn Rate",
//     name: "churnRate",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Gross Margin",
//     name: "grossMargin",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Contribution Margin",
//     name: "contributionMargin",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Payback Period",
//     name: "paybackPeriod",
//     category: "Financial Metrics",
//   },
//   {
//     label: "Year 1 Revenue",
//     name: "year1Revenue",
//     category: "Financial Projections",
//   },
//   {
//     label: "Year 2 Revenue",
//     name: "year2Revenue",
//     category: "Financial Projections",
//   },
//   {
//     label: "Year 3 Revenue",
//     name: "year3Revenue",
//     category: "Financial Projections",
//   },
//   {
//     label: "Revenue Growth Rate",
//     name: "revenueGrowthRate",
//     category: "Financial Projections",
//   },
//   {
//     label: "Operating Expenses",
//     name: "operatingExpenses",
//     category: "Financial Projections",
//   },
//   {
//     label: "Marketing Budget",
//     name: "marketingBudget",
//     category: "Financial Projections",
//   },
//   {
//     label: "R&D Expenses",
//     name: "rdExpenses",
//     category: "Financial Projections",
//   },
//   {
//     label: "Primary Revenue Streams",
//     name: "primaryRevenueStreams",
//     category: "Business Operations",
//   },
//   {
//     label: "Pricing Model",
//     name: "pricingModel",
//     category: "Business Operations",
//   },
//   {
//     label: "Sales Channels",
//     name: "salesChannels",
//     category: "Business Operations",
//   },
//   {
//     label: "Business Operations",
//     name: "businessOperations",
//     category: "Business Operations",
//   },
//   {
//     label: "Technology Stack",
//     name: "technologyStack",
//     category: "Business Operations",
//   },
//   {
//     label: "Key Partnerships",
//     name: "keyPartnerships",
//     category: "Business Operations",
//   },
//   {
//     label: "Founding Team",
//     name: "foundingTeam",
//     category: "Team & Leadership",
//   },
//   {
//     label: "Founder Experience",
//     name: "founderExperience",
//     category: "Team & Leadership",
//   },
//   {
//     label: "Key Personnel",
//     name: "keyPersonnel",
//     category: "Team & Leadership",
//   },
//   {
//     label: "Advisors",
//     name: "advisors",
//     category: "Team & Leadership",
//   },
//   {
//     label: "Product Stage",
//     name: "productStage",
//     category: "Traction & Validation",
//   },
//   {
//     label: "Development Milestones",
//     name: "developmentMilestones",
//     category: "Traction & Validation",
//   },
//   {
//     label: "Customer Validation",
//     name: "customerValidation",
//     category: "Traction & Validation",
//   },
//   {
//     label: "Pilot Programs",
//     name: "pilotPrograms",
//     category: "Traction & Validation",
//   },
//   {
//     label: "Business Traction",
//     name: "businessTraction",
//     category: "Traction & Validation",
//   },
//   {
//     label: "Partnerships",
//     name: "partnerships",
//     category: "Traction & Validation",
//   },
//   {
//     label: "Previous Funding",
//     name: "previousFunding",
//     category: "Funding & Investment",
//   },
//   {
//     label: "Current Investors",
//     name: "currentInvestors",
//     category: "Funding & Investment",
//   },
//   {
//     label: "Funding Goal",
//     name: "fundingGoal",
//     category: "Funding & Investment",
//   },
//   {
//     label: "Use of Funds",
//     name: "useOfFunds",
//     category: "Funding & Investment",
//   },
//   {
//     label: "Valuation",
//     name: "valuation",
//     category: "Funding & Investment",
//   },
//   {
//     label: "Future Strategy",
//     name: "futureStrategy",
//     category: "Strategic Planning",
//   },
//   {
//     label: "Exit Strategy",
//     name: "exitStrategy",
//     category: "Strategic Planning",
//   },
//   {
//     label: "Key Metrics",
//     name: "keyMetrics",
//     category: "Strategic Planning",
//   },
//   {
//     label: "Risk Factors",
//     name: "riskFactors",
//     category: "Strategic Planning",
//   },
//   {
//     label: "Personal Story",
//     name: "personalStory",
//     category: "Additional Information",
//   },
//   {
//     label: "Supporting Materials",
//     name: "supportingMaterials",
//     category: "Additional Information",
//   },
// ]


// export default function PitchGenerator() {
//   const [pitch, setPitch] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [formData, setFormData] = useState<Record<string, string>>({})
//   const [showUpgradeModal, setShowUpgradeModal] = useState(false)

//   const {data:session} = useSession()
//   console.log(session.user)
//   const router = useRouter()

//   // Group fields by category
//   const fieldsByCategory = fields.reduce(
//     (acc, field) => {
//       if (!acc[field.category]) {
//         acc[field.category] = []
//       }
//       acc[field.category].push(field)
//       return acc
//     },
//     {} as Record<string, typeof fields>,
//   )

//   const categories = Object.keys(fieldsByCategory)
//   const totalSteps = categories.length

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const nextStep = () => {
//     if (currentStep < totalSteps - 1) {
//       // For free users, only allow navigation to first 4 tabs (0-3 index)
//       if (session?.user?.userPlan === 'free' && currentStep >= 3) {
//         setShowUpgradeModal(true)
//         return
//       }
//       setCurrentStep(prev => prev + 1)
//       window.scrollTo({ top: 0, behavior: 'smooth' })
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(prev => prev - 1)
//       window.scrollTo({ top: 0, behavior: 'smooth' })
//     }
//   }

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault()
//     setLoading(true)

//     // Create FormData from our form state
//     const formDataToSubmit = new FormData()
//     Object.entries(formData).forEach(([key, value]) => {
//       formDataToSubmit.append(key, value)
//     })

//     try {
//       const res = await fetch("http://127.0.0.1:8000/generate-pitch", {
//         method: "POST",
//         body: formDataToSubmit,
//       })
//       const result = await res.json()
//       setPitch(result.pitch || "No pitch generated.")
//     } catch (err) {
//       console.error(err)
//       setPitch("Error generating pitch.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   function downloadPDF() {
//     if (!pitch) return

//     const doc = new jsPDF()
//     const pageWidth = doc.internal.pageSize.width
//     const pageHeight = doc.internal.pageSize.height
//     const margin = 20
//     const maxWidth = pageWidth - 2 * margin

//     // Title
//     doc.setFontSize(20)
//     doc.setFont("helvetica", "bold")
//     doc.text("Startup Pitch", margin, 30)

//     // Content
//     doc.setFontSize(12)
//     doc.setFont("helvetica", "normal")

//     const lines = doc.splitTextToSize(pitch, maxWidth)
//     let yPosition = 50

//     lines.forEach((line: string) => {
//       if (yPosition > pageHeight - margin) {
//         doc.addPage()
//         yPosition = margin
//       }
//       doc.text(line, margin, yPosition)
//       yPosition += 7
//     })

//     doc.save("startup-pitch.pdf")
//   }

 

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Upgrade Modal */}
//       <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Upgrade to Pro</DialogTitle>
//             <DialogDescription>
//               To access all pitch sections and features, please upgrade to our Pro plan.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="mt-4 flex justify-end space-x-2">
//             <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
//               Maybe Later
//             </Button>
//             <Button onClick={() => router.push('/payment')}>
//               Upgrade Now
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-4xl font-bold tracking-tight">Startup Pitch Generator</h1>
//             <p className="text-muted-foreground mt-2">
//               Create a compelling pitch for your startup by filling out the form below
//             </p>
//           </div>
//         </div>


//         <div className="mb-8">
//           <div className="relative w-full h-14 bg-card border border-border rounded-lg shadow-sm overflow-hidden">
//             <div className="flex justify-between items-center h-full px-0">
//               {categories.map((category, index) => {
//                 const isActive = index === currentStep;
//                 const isRestricted = session?.user?.userPlan === 'free' && index >= 4;
                
//                 return (
//                   <div
//                     key={category}
//                     onClick={() => {
//                       if (isRestricted) {
//                         setShowUpgradeModal(true);
//                         return;
//                       }
//                       setCurrentStep(index);
//                     }}
//                     className={`flex-1 flex items-center justify-center text-center h-full text-sm font-medium transition-all duration-300 relative
//                       ${isActive
//                         ? "bg-primary text-primary-foreground font-semibold rounded-lg z-10"
//                         : "text-muted-foreground hover:text-foreground"
//                       }
//                       ${isRestricted ? 'opacity-50' : 'cursor-pointer'}
//                       ${isRestricted ? 'group' : ''}`}
//                   >
//                     {category}
                    
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//         </div>



//         <div className={`grid gap-8 ${currentStep === totalSteps - 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
//           <div className={currentStep === totalSteps - 1 ? 'lg:col-span-2' : ''}>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {Object.entries(fieldsByCategory)
//                 .map(([category, categoryFields], index) => (
//                 <div key={category} className={currentStep !== index ? 'hidden' : ''}>
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="text-xl">{category}</CardTitle>
//                       <CardDescription>Fill out the relevant information for this section</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                       {categoryFields.map((field) => (
//                         <div key={field.name} className="space-y-2">
//                           <Label htmlFor={field.name} className="text-sm font-medium">
//                             {field.label}
//                             {field.required && (
//                               <Badge variant="destructive" className="ml-2 text-xs">
//                                 Required
//                               </Badge>
//                             )}
//                           </Label>
//                           {field.name === "website" ? (
//                             <Input
//                               id={field.name}
//                               name={field.name}
//                               type="url"
//                               placeholder="https://example.com"
//                               required={field.required}
//                               className="w-full"
//                               value={formData[field.name] || ''}
//                               onChange={handleInputChange}
//                             />
//                           ) : (
//                             <Textarea
//                               id={field.name}
//                               name={field.name}
//                               rows={3}
//                               required={field.required}
//                               className="w-full resize-none"
//                               placeholder={`Enter ${field.label.toLowerCase()}...`}
//                               value={formData[field.name] || ''}
//                               onChange={handleInputChange}
//                             />
//                           )}
//                         </div>
//                       ))}
//                     </CardContent>
//                   </Card>
//                 </div>
//               ))}

//               <div className="flex justify-between pt-6">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={prevStep}
//                   disabled={currentStep === 0 || loading}
//                 >
//                   Previous
//                 </Button>

//                 {currentStep === 3 && session?.user?.userPlan === 'free' ? (
//                   <Button
//                     type="submit"
//                     size="lg"
//                     disabled={loading}
//                     className="w-full max-w-md"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Generating Pitch...
//                       </>
//                     ) : (
//                       "Generate Basic Pitch (Free)"
//                     )}
//                   </Button>
//                 ) : currentStep < totalSteps - 1 ? (
//                   <Button
//                     type="button"
//                     onClick={nextStep}
//                   >
//                     Next
//                   </Button>
//                 ) : (
//                   <Button
//                     type="submit"
//                     size="lg"
//                     disabled={loading}
//                     className="w-full max-w-md"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Generating Pitch...
//                       </>
//                     ) : (
//                       "Generate Pitch"
//                     )}
//                   </Button>
//                 )}
//               </div>
//             </form>
//           </div>

//           {(currentStep === totalSteps - 1 || (session?.user?.userPlan === 'free' && currentStep === 3 && pitch)) && (
//             <div className="lg:col-span-1">
//               <div className="sticky top-8">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                       Generated Pitch
//                       {pitch && (
//                         <Button variant="outline" size="sm" onClick={downloadPDF} className="ml-2 bg-transparent">
//                           <Download className="h-4 w-4 mr-2" />
//                           PDF
//                         </Button>
//                       )}
//                     </CardTitle>
//                     <CardDescription>Your generated pitch will appear here</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="flex items-center justify-center py-8">
//                         <Loader2 className="h-8 w-8 animate-spin" />
//                       </div>
//                     ) : pitch ? (
//                       <div className="prose prose-sm dark:prose-invert max-w-none">
//                         <div className="whitespace-pre-line text-sm leading-relaxed">{pitch}</div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <p>{'Fill out the form and click "Generate Pitch" to see your startup pitch here.'}</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div >
//   )
// }
