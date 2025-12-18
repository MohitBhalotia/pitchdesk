"use client";

import { Card } from "@/components/ui/card";

const money = (value?: number) =>
    typeof value === "number" ? `₹${value.toLocaleString("en-IN")}` : "—";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ValuationSummary({ result }: { result: any }) {
    const v = result.valuations;
    const p = result.projections;
    const e = result.explanations;

    const valuationCandidates = [
        v?.berkus,
        v?.scorecard,
        v?.cost_to_duplicate,
        v?.vc_method?.pre_money,
        v?.risk_factor,
    ].filter((n): n is number => typeof n === "number");
    const valuationMin = valuationCandidates.length > 0 ? Math.min(...valuationCandidates) : null;
    const valuationMax = valuationCandidates.length > 0 ? Math.max(...valuationCandidates) : null;

    const annualRevenue = p?.annual_revenue ?? null;
    const negativeMonth = p?.monthly?.find((m: any) => m.cash_balance < 0)?.month;
    const burns = p?.monthly?.map((m: any) => Math.abs(m.net_profit)) || [];
    const avgBurn = burns.length > 0 ? burns.reduce((a: number, b: number) => a + b, 0) / burns.length : 0;
    const runwayMonths = p?.runway_months;
    const highBurn = typeof runwayMonths === "number" && runwayMonths < 6 ? true : false;
    const highlight = highBurn ? "bg-destructive/10 border-destructive/50 text-destructive" : "bg-success/10 border-success/40 text-success-800";

    return (
        <div className="space-y-10">
            {/* Executive, Revenue, Runway */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <Card className="p-4 md:col-span-2 flex flex-col gap-1 justify-between">
                    <div>
                        <p className="text-muted-foreground text-xs">Recommended Valuation</p>
                        <p className="text-2xl font-bold tracking-tight lg:text-3xl">{money(v?.recommended_pre_money)}</p>
                    </div>
                    <p className="text-xs pt-1 text-muted-foreground">
                        Pre-money estimate, based on blended methods
                    </p>
                </Card>
                <Card className="p-4 flex flex-col gap-1">
                    <p className="text-muted-foreground text-xs">Valuation Range</p>
                    <p className="text-lg font-semibold">
                        {valuationMin !== null && valuationMax !== null
                            ? `${money(valuationMin)} – ${money(valuationMax)}`
                            : "—"}
                    </p>
                </Card>
                <Card className={`p-4 flex flex-col gap-1 border-2 ${highlight}`}>
                    <p className="text-muted-foreground text-xs">Runway (Last 3 Months)</p>
                    <p className="text-lg font-semibold">
                        {typeof runwayMonths === "number" ? `${runwayMonths} mo` : "Profitable"}
                    </p>
                    <span className="text-xs font-medium">
                        {typeof runwayMonths === "number" 
                            ? (highBurn ? "⚠ Raise capital soon!" : "Healthy runway") 
                            : "No losses in recent months"}
                    </span>
                </Card>
                <Card className="p-4 flex flex-col gap-1">
                    <p className="text-muted-foreground text-xs">12-Month Revenue</p>
                    <p className="text-lg font-semibold">
                        {annualRevenue !== null ? money(annualRevenue) : "—"}
                    </p>
                    <span className="text-xs">predicted by cashflow model</span>
                </Card>
            </div>

            {/* Valuation Breakdown */}
            <Card className="p-6">
                <h2 className="mb-4 font-semibold">Valuation Breakdown</h2>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {typeof v.berkus === "number" && (
                        <>
                            <span>Berkus Method</span>
                            <span>{money(v.berkus)}</span>
                        </>
                    )}
                    <span>Scorecard Method</span><span>{money(v.scorecard)}</span>
                    <span>VC Method (Pre)</span><span>{money(v.vc_method.pre_money)}</span>
                    <span>Risk Factor</span><span>{money(v.risk_factor)}</span>
                    <span className="font-medium">Recommended</span>
                    <span className="font-medium">
                        {money(v.recommended_pre_money)}
                    </span>
                </div>
            </Card>

            {/* Burn & Runway */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Avg Monthly Burn</p>
                    <p className="text-lg font-semibold">
                        {money(Math.round(avgBurn))}
                    </p>
                </Card>

                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Peak Burn</p>
                    <p className="text-lg font-semibold">
                        {money(Math.max(...burns))}
                    </p>
                </Card>

                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Cash Exhausted</p>
                    <p className="text-lg font-semibold">
                        Month {negativeMonth ?? "—"}
                    </p>
                </Card>
            </div>
        </div>
    );
}
