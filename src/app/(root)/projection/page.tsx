"use client";

import { useState } from "react";
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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
        expected_customers_year1: z.string().optional(),
        expected_monthly_revenue_year1: z.string().optional(),

        // Revenue/Growth fields
        customers: z.string().optional(),
        monthly_revenue: z.string().optional(),
        monthly_growth_rate: z.string().optional(),
        monthly_churn_rate: z.string().optional(),

        // Advanced/optional
        gross_margin: z.string().optional(),
        monthly_burn: z.string().optional(),
        top_3_customers_percent: z.string().optional(),
        fixed_assets_value: z.string().optional(),
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
            if (!data.expected_customers_year1 || data.expected_customers_year1 === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Expected customers is required",
                    path: ["expected_customers_year1"],
                });
            }
            if (!data.expected_monthly_revenue_year1 || data.expected_monthly_revenue_year1 === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Expected revenue is required",
                    path: ["expected_monthly_revenue_year1"],
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
            if (!data.monthly_churn_rate || data.monthly_churn_rate === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Monthly churn rate is required",
                    path: ["monthly_churn_rate"],
                });
            }
        }
    });

type FormValues = z.infer<typeof formSchema>;

export default function ProjectionPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            stage_of_business: "pre_revenue",
            sector: "manufacturing",
            team_strength: "average",
            market_size: "medium",
            competitive_position: "moderate",
            product_stage: "idea",
            expected_customers_year1: "",
            expected_monthly_revenue_year1: "",
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
            customers:
                values.stage_of_business === "pre_revenue"
                    ? values.expected_customers_year1
                        ? Number(values.expected_customers_year1)
                        : undefined
                    : values.customers
                        ? Number(values.customers)
                        : undefined,
            monthly_revenue:
                values.stage_of_business === "pre_revenue"
                    ? values.expected_monthly_revenue_year1
                        ? Number(values.expected_monthly_revenue_year1)
                        : undefined
                    : values.monthly_revenue
                        ? Number(values.monthly_revenue)
                        : undefined,
            monthly_growth_rate: values.monthly_growth_rate ? Number(values.monthly_growth_rate) : undefined,
            monthly_churn_rate: values.monthly_churn_rate ? Number(values.monthly_churn_rate) : undefined,
            gross_margin: values.gross_margin ? Number(values.gross_margin) : undefined,
            monthly_burn: values.monthly_burn ? Number(values.monthly_burn) : undefined,
            top_3_customers_percent: values.top_3_customers_percent ? Number(values.top_3_customers_percent) : undefined,
            fixed_assets_value: values.fixed_assets_value ? Number(values.fixed_assets_value) : undefined,
        };

        const res = await fetch("/api/projection", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        setResult(data);
        setLoading(false);
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
                            <>
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

                                <FormField
                                    control={form.control}
                                    name="expected_customers_year1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expected Customers (Year 1)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="expected_monthly_revenue_year1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expected Revenue (Year 1)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
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

                        {/* Revenue / Growth */}
                        {stage !== "pre_revenue" && (
                            <>
                                {[
                                    { name: "customers", label: "Customers" },
                                    { name: "monthly_revenue", label: "Monthly Revenue" },
                                    { name: "monthly_growth_rate", label: "Monthly Growth Rate (%)" },
                                    { name: "monthly_churn_rate", label: "Monthly Churn Rate (%)" },
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
                            </>
                        )}

                        {/* Advanced/Optional Fields */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/50 rounded-md p-4 border mt-2">
                            <span className="font-medium md:col-span-2 mb-0.5 text-sm text-muted-foreground">Optional / Advanced Inputs</span>
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
                                            Monthly Burn
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
                            <FormField
                                control={form.control}
                                name="fixed_assets_value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Fixed Assets Value
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
                        </div>
                        <Button
                            type="submit"
                            className="md:col-span-2"
                            disabled={loading}
                        >
                            {loading ? "Calculating..." : "Generate Projection"}
                        </Button>
                    </form>
                </Form>
            </Card>

            {/* ---------------- RESULTS ---------------- */}
            {result && (
                <div className="space-y-12">
                    {/* Executive + Valuation + Burn */}
                    <ValuationSummary result={result} />

                    {/* Growth & Cash Charts */}
                    <ProjectionCharts data={result.projections.monthly} />

                    {/* Investor Memo */}
                    <Card className="p-6">
                        <h2 className="mb-4 text-lg font-semibold">Investor Memo</h2>
                        <Accordion type="single" collapsible>
                            {Object.entries(result.explanations).map(
                                ([k, v]) =>
                                    typeof v === "string" && (
                                        <AccordionItem key={k} value={k}>
                                            <AccordionTrigger className="capitalize">
                                                {k.replace("_", " ")}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-sm text-muted-foreground">
                                                {v}
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                            )}
                        </Accordion>
                    </Card>
                </div>
            )}
        </div>
    );
}
