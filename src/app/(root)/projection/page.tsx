"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

import ProjectionCharts from "./projectionCharts";
import ValuationSummary from "./valuationSummary";

/* ---------------- Schema ---------------- */

const sectorOptions = [
    { value: "agriculture_natural_resources", label: "Agriculture & Natural Resources" },
    { value: "mining_oil_gas", label: "Mining, Oil & Gas" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "food_consumer_goods", label: "Food & Consumer Goods" },
    { value: "construction_infrastructure", label: "Construction & Infrastructure" },
    { value: "transportation_logistics", label: "Transportation & Logistics" },
    { value: "retail_wholesale", label: "Retail & Wholesale" },
    { value: "ecommerce_marketplaces", label: "E-Commerce & Marketplaces" },
    { value: "hospitality_tourism", label: "Hospitality & Tourism" },
    { value: "healthcare_life_sciences", label: "Healthcare & Life Sciences" },
    { value: "pharmaceuticals_biotechnology", label: "Pharmaceuticals & Biotechnology" },
    { value: "education_edtech", label: "Education & EdTech" },
    { value: "information_technology_software", label: "IT & Software" },
    { value: "artificial_intelligence_data", label: "AI & Data" },
    { value: "financial_services_banking", label: "Financial Services & Banking" },
    { value: "fintech_payments", label: "Fintech & Payments" },
    { value: "insurance", label: "Insurance" },
    { value: "real_estate_proptech", label: "Real Estate & PropTech" },
    { value: "media_entertainment_gaming", label: "Media, Entertainment & Gaming" },
    { value: "marketing_advertising_creator", label: "Marketing, Advertising & Creators" },
    { value: "professional_consulting_services", label: "Professional & Consulting Services" },
    { value: "energy_ev_climatetech", label: "Energy, EV & ClimateTech" },
    { value: "government_public_ngos", label: "Government, Public & NGOs" },
    { value: "research_innovation_deeptech", label: "Research, Innovation & DeepTech" },
    { value: "space_advanced_technologies", label: "Space & Advanced Tech" },
];

const formSchema = z
    .object({
        stage_of_business: z.enum(["pre_revenue", "early_revenue", "growth"]),
        sector: z.string().min(1, "Sector is required"),
        team_strength: z.enum(["weak", "average", "strong"]),
        market_size: z.enum(["niche", "medium", "large"]),
        competitive_position: z.enum(["weak", "moderate", "strong"]),

        // Pre-revenue fields
        product_stage: z.enum(["idea", "prototype", "MVP"]).optional(),

        // Revenue/Growth fields
        customers: z.string().optional().refine(
            (val) => !val || Number(val) >= 0,
            { message: "Customers cannot be negative" }
        ),
        monthly_revenue: z.string().optional().refine(
            (val) => !val || Number(val) >= 0,
            { message: "Monthly revenue cannot be negative" }
        ),

        // Advanced/optional
        gross_margin: z.string().optional().refine(
            (val) => !val || (Number(val) >= 0 && Number(val) <= 1),
            { message: "Gross margin must be between 0 and 1 (e.g., 0.55 for 55%)" }
        ),
        monthly_burn: z.string().optional().refine(
            (val) => !val || Number(val) >= 0,
            { message: "Monthly burn cannot be negative" }
        ),
        monthly_churn_rate: z.string().optional().refine(
            (val) => !val || (Number(val) >= 0 && Number(val) <= 1),
            { message: "Churn rate must be between 0 and 1 (e.g., 0.02 for 2%)" }
        ),
        monthly_growth_rate: z.string().optional().refine(
            (val) => !val || (Number(val) >= -1 && Number(val) <= 10),
            { message: "Growth rate must be between -1 and 10 (e.g., 0.05 for 5%)" }
        ),
        top_3_customers_percent: z.string().optional().refine(
            (val) => !val || (Number(val) >= 0 && Number(val) <= 100),
            { message: "Top 3 customers % must be between 0 and 100" }
        ),
        fixed_assets_value: z.string().optional().refine(
            (val) => !val || Number(val) >= 0,
            { message: "Fixed assets value cannot be negative" }
        ),
        initial_cash: z.string().optional().refine(
            (val) => !val || Number(val) >= 0,
            { message: "Initial cash cannot be negative" }
        ),
    })
    .superRefine((data, ctx) => {
        // Pre-revenue validation
        if (data.stage_of_business === "pre_revenue") {
            if (!data.product_stage) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Product stage is required",
                    path: ["product_stage"],
                });
            }
        }

        // Early revenue & Growth validation
        if (data.stage_of_business === "early_revenue" || data.stage_of_business === "growth") {
            if (!data.customers || data.customers === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Customers is required",
                    path: ["customers"],
                });
            }
            if (!data.monthly_revenue || data.monthly_revenue === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Monthly revenue is required",
                    path: ["monthly_revenue"],
                });
            }
            if (!data.monthly_growth_rate || data.monthly_growth_rate === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Monthly growth rate is required",
                    path: ["monthly_growth_rate"],
                });
            }
            // Validate that monthly_revenue is positive
            if (data.monthly_revenue && Number(data.monthly_revenue) <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Monthly revenue must be greater than 0",
                    path: ["monthly_revenue"],
                });
            }
            // Validate that customers is positive
            if (data.customers && Number(data.customers) <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Customers must be greater than 0",
                    path: ["customers"],
                });
            }
        }
    });

type FormValues = z.infer<typeof formSchema>;

export default function ProjectionPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            stage_of_business: "pre_revenue",
            sector: "manufacturing",
            team_strength: "average",
            market_size: "medium",
            competitive_position: "moderate",
            product_stage: "idea",
            customers: "",
            monthly_revenue: "",
            monthly_growth_rate: "",
            monthly_churn_rate: "",
            gross_margin: "",
            monthly_burn: "",
            top_3_customers_percent: "",
            fixed_assets_value: "",
        },
    });

    const stage = form.watch("stage_of_business");

    async function onSubmit(values: FormValues) {
        setLoading(true);

        // Convert and map for backend
        const payload = {
            ...values,
            customers: values.customers ? Number(values.customers) : undefined,
            monthly_revenue: values.monthly_revenue ? Number(values.monthly_revenue) : undefined,
            monthly_growth_rate: values.monthly_growth_rate ? Number(values.monthly_growth_rate) : undefined,
            monthly_churn_rate: values.monthly_churn_rate ? Number(values.monthly_churn_rate) : undefined,
            gross_margin: values.gross_margin ? Number(values.gross_margin) : undefined,
            monthly_burn: values.monthly_burn ? Number(values.monthly_burn) : undefined,
            top_3_customers_percent: values.top_3_customers_percent ? Number(values.top_3_customers_percent) : undefined,
            fixed_assets_value: values.fixed_assets_value ? Number(values.fixed_assets_value) : undefined,
            initial_cash: values.initial_cash ? Number(values.initial_cash) : undefined,
        };

        const res = await fetch("/api/projection", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        setResult(data);
        setLoading(false);
        
        // Scroll to results after a brief delay to ensure rendering
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }

    return (
        <div className="container mx-auto max-w-7xl space-y-10 px-4 py-8">
            <h1 className="text-3xl font-bold">Company Projection & Valuation</h1>

            {/* ---------------- FORM ---------------- */}
            <Card className="p-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 gap-6 md:grid-cols-2"
                    >
                        {/* Stage */}
                        <FormField
                            control={form.control}
                            name="stage_of_business"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stage of Business</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pre_revenue">Pre-Revenue</SelectItem>
                                            <SelectItem value="early_revenue">Early Revenue</SelectItem>
                                            <SelectItem value="growth">Growth</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Sector */}
                        <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sector</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sectorOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Team Strength */}
                        <FormField
                            control={form.control}
                            name="team_strength"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Strength</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="weak">Weak</SelectItem>
                                            <SelectItem value="average">Average</SelectItem>
                                            <SelectItem value="strong">Strong</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Market Size */}
                        <FormField
                            control={form.control}
                            name="market_size"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Market Size</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="niche">Niche</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="large">Large</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Competitive Position */}
                        <FormField
                            control={form.control}
                            name="competitive_position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Competitive Position</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="weak">Weak</SelectItem>
                                            <SelectItem value="moderate">Moderate</SelectItem>
                                            <SelectItem value="strong">Strong</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />


                        {/* Pre-Revenue */}
                        {stage === "pre_revenue" && (
                            <FormField
                                control={form.control}
                                name="product_stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Stage</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="idea">Idea</SelectItem>
                                                <SelectItem value="prototype">Prototype</SelectItem>
                                                <SelectItem value="MVP">MVP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Revenue / Growth */}
                        {stage !== "pre_revenue" && (
                            <>
                                {[
                                    { name: "customers", label: "Customers" },
                                    { name: "monthly_revenue", label: "Monthly Revenue (INR)" },
                                ].map(({ name, label }) => (
                                    <FormField
                                        key={name}
                                        control={form.control}
                                        name={name as keyof FormValues}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{label}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <FormField
                                    control={form.control}
                                    name="monthly_growth_rate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Monthly Revenue Growth Rate
                                                <span className="text-xs text-muted-foreground ml-2">(decimal, e.g., 0.05 for 5% growth)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={-1}
                                                    max={10}
                                                    step={0.01}
                                                    placeholder="0.05"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* Advanced/Optional Fields */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/50 rounded-md p-4 border mt-2">
                            <span className="font-medium md:col-span-2 mb-0.5 text-sm text-muted-foreground">Optional / Advanced Inputs</span>
                            
                            {stage !== "pre_revenue" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="monthly_churn_rate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Monthly Churn Rate
                                                    <span className="text-xs text-muted-foreground ml-2">(decimal, e.g., 0.02 for 2%)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={1}
                                                        step={0.01}
                                                        placeholder="0.02"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={e => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gross_margin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Gross Margin
                                                    <span className="text-xs text-muted-foreground ml-2">(Value 0-1, e.g., 0.55)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={1}
                                                        step={0.01}
                                                        placeholder="0.55"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={e => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="monthly_burn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Monthly Burn (INR)
                                                    <span className="text-xs text-muted-foreground ml-2">(Monthly cash outflow, e.g., 25000)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step={1}
                                                        placeholder="25000"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={e => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="top_3_customers_percent"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Top 3 Customers %
                                                    <span className="text-xs text-muted-foreground ml-2">(e.g., 40 for 40%)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        placeholder="40"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={e => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            
                            <FormField
                                control={form.control}
                                name="fixed_assets_value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Fixed Assets Value (INR)
                                            <span className="text-xs text-muted-foreground ml-2">(e.g., 60000)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                step={100}
                                                placeholder="60000"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={e => field.onChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="initial_cash"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Initial Cash Balance (INR)
                                            <span className="text-xs text-muted-foreground ml-2">(e.g., 500000, default: 200000)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                step={1000}
                                                placeholder="200000"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={e => field.onChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="md:col-span-2 w-full"
                            disabled={loading}
                        >
                            {loading ? "Calculating..." : "Generate Projection"}
                        </Button>
                    </form>
                </Form>
            </Card>

            {/* ---------------- RESULTS ---------------- */}
            {result && (
                <div ref={resultsRef} className="space-y-12">
                    {/* Executive + Valuation + Burn */}
                    <ValuationSummary result={result} />

                    {/* Growth & Cash Charts */}
                    <ProjectionCharts data={result.projections.monthly} />

                    {/* AI Analysis & Insights */}
                    {result.explanations && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">AI Analysis & Insights</h2>
                            
                            {/* Overall Summary */}
                            {result.explanations.overall_summary && (
                                <Card className="p-6 bg-primary/5 border-primary/20">
                                    <h3 className="mb-3 font-semibold text-lg">Investment Summary</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{result.explanations.overall_summary}</p>
                                </Card>
                            )}

                            {/* Valuation Explanations */}
                            {result.explanations.valuations && (
                                <Card className="p-6">
                                    <h3 className="mb-4 font-semibold text-lg">Valuation Analysis</h3>
                                    <div className="space-y-4">
                                        {result.explanations.valuations.scorecard && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Scorecard Method</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{result.explanations.valuations.scorecard}</p>
                                            </div>
                                        )}
                                        {result.explanations.valuations.vc_method?.pre_money && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">VC Method</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{result.explanations.valuations.vc_method.pre_money}</p>
                                            </div>
                                        )}
                                        {result.explanations.valuations.risk_factor && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Risk Factor Analysis</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{result.explanations.valuations.risk_factor}</p>
                                            </div>
                                        )}
                                        {result.explanations.valuations.recommended_pre_money && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Recommended Valuation</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{result.explanations.valuations.recommended_pre_money}</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Projection Explanations */}
                            {result.explanations.projections && (
                                <Card className="p-6">
                                    <h3 className="mb-4 font-semibold text-lg">Financial Projections Analysis</h3>
                                    <div className="space-y-4">
                                        {result.explanations.projections.annual_revenue && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Annual Revenue Projection</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{result.explanations.projections.annual_revenue}</p>
                                            </div>
                                        )}
                                        {result.explanations.projections.runway_months && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Runway Analysis</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{result.explanations.projections.runway_months}</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
