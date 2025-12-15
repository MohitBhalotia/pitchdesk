"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectionCharts({ data }: { data: any[] }) {
  const { theme } = useTheme();
  const axisColor = theme === "dark" ? "#ffffff" : "#6b7280";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {[
        { key: "customers", label: "Customers", color: "#3b82f6" },
        { key: "revenue", label: "Revenue", color: "#10b981" },
        { key: "cash_balance", label: "Cash Balance", color: "#f59e0b" },
      ].map((c) => (
        <Card key={c.key} className="p-4">
          <p className="mb-2 font-medium">{c.label}</p>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
              />

              <XAxis
                dataKey="month"
                stroke={axisColor}
                fontSize={12}
                tick={{ fill: axisColor }}
              />

              <YAxis
                stroke={axisColor}
                fontSize={12}
                tick={{ fill: axisColor }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{
                  color: "hsl(var(--popover-foreground))",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: "hsl(var(--popover-foreground))",
                }}
              />

              <Line
                type="monotone"
                dataKey={c.key}
                stroke={c.color}
                strokeWidth={3}
                dot={{
                  fill: c.color,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                  r: 5
                }}
                activeDot={{
                  r: 7,
                  fill: c.color,
                  stroke: "hsl(var(--background))",
                  strokeWidth: 3
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      ))}
    </div>
  );
}