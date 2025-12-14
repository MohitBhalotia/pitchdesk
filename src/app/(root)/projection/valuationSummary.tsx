"use client";

import { Card } from "@/components/ui/card";

const money = (value?: number) =>
    typeof value === "number" ? `$${value.toLocaleString()}` : "—";


export default function ValuationSummary({ result }: { result: any }) {
    const v = result.valuations;
    const p = result.projections;

    const valuationCandidates = [
        v.berkus,
        v.scorecard,
        v.cost_to_duplicate,
        v.vc_method?.pre_money,
        v.risk_factor,
    ].filter((n): n is number => typeof n === "number");

    const valuationMin = Math.min(...valuationCandidates);
    const valuationMax = Math.max(...valuationCandidates);


    const negativeMonth = p.monthly.find(
        (m: any) => m.cash_balance < 0
    )?.month;

    const burns = p.monthly.map((m: any) => Math.abs(m.net_profit));
    const avgBurn =
        burns.reduce((a: number, b: number) => a + b, 0) / burns.length;

    return (
        <div className="space-y-10">
            {/* Executive Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Recommended Valuation</p>
                    <p className="text-xl font-semibold">
                        {money(v.recommended_pre_money)}
                    </p>
                </Card>

                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Valuation Range</p>
                    <p className="text-xl font-semibold">
                        {money(valuationMin)} – {money(valuationMax)}
                    </p>
                </Card>

                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Runway</p>
                    <p className="text-xl font-semibold">
                        {p.runway_months} months
                    </p>
                </Card>

                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Financial Health</p>
                    <p className="text-sm">
                        {p.runway_months < 6
                            ? "High burn, urgent funding needed"
                            : "Manageable cash position"}
                    </p>
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
                    <span>Cost to Duplicate</span><span>{money(v.cost_to_duplicate)}</span>
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

            {/* Actionable Insights */}
            <Card className="p-6">
                <h2 className="mb-3 font-semibold">What This Means For You</h2>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {p.runway_months < 6 && <li>Raise capital within the next 6 months</li>}
                    <li>Improve monetization before scaling users further</li>
                    <li>Control fixed costs to extend runway</li>
                </ul>
            </Card>
        </div>
    );
}
