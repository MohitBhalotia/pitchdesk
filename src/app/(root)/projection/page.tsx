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

const formSchema = z
    .object({
        stage_of_business: z.enum(["pre_revenue", "early_revenue", "growth"]),
        team_strength: z.enum(["weak", "average", "strong"]),
        market_size: z.enum(["niche", "medium", "large"]),
        competitive_position: z.enum(["weak", "moderate", "strong"]),

        product_stage: z.enum(["idea", "prototype", "MVP"]).optional(),
        expected_customers_year1: z.number().optional(),
        expected_monthly_revenue_year1: z.number().optional(),

        customers: z.number().optional(),
        monthly_revenue: z.number().optional(),
        monthly_growth_rate: z.number().optional(),
        monthly_churn_rate: z.number().optional(),
    })
    .refine(
        (d) =>
            d.stage_of_business !== "pre_revenue" ||
            d.product_stage !== undefined,
        {
            message: "Product stage is required for pre-revenue startups",
            path: ["product_stage"],
        }
    );

type FormValues = z.infer<typeof formSchema>;

export default function ProjectionPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            stage_of_business: "pre_revenue",
            team_strength: "average",
            market_size: "medium",
            competitive_position: "moderate",
        },
    });

    const stage = form.watch("stage_of_business");

    async function onSubmit(values: FormValues) {
        setLoading(true);
        const res = await fetch("/api/projection", {
            method: "POST",
            body: JSON.stringify(values),
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
                                                    onChange={(e) =>
                                                        field.onChange(+e.target.value)
                                                    }
                                                />
                                            </FormControl>
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
                                                    onChange={(e) =>
                                                        field.onChange(+e.target.value)
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* Revenue / Growth */}
                        {stage !== "pre_revenue" && (
                            <>
                                {[
                                    "customers",
                                    "monthly_revenue",
                                    "monthly_growth_rate",
                                    "monthly_churn_rate",
                                ].map((name) => (
                                    <FormField
                                        key={name}
                                        control={form.control}
                                        name={name as any}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{name.replace("_", " ")}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(+e.target.value)
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </>
                        )}

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
