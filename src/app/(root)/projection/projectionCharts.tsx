"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

export default function ProjectionCharts({ data }: { data: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {[
        { key: "customers", label: "Customers" },
        { key: "revenue", label: "Revenue" },
        { key: "cash_balance", label: "Cash Balance" },
      ].map((c) => (
        <Card key={c.key} className="p-4">
          <p className="mb-2 font-medium">{c.label}</p>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />

              {/* ✅ FIXED TOOLTIP */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: 500,
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                }}
              />

              <Line
                type="monotone"
                dataKey={c.key}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      ))}
    </div>
  );
}
