"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// English content normalized from the original source text.
interface SalesChartProps {
  data: { name: string; totalSales: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">English content normalized from the original source text.</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#FE2020"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#FE2020"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          // English content normalized from the original source text.
          tickFormatter={(value) => `${value.toLocaleString("vi-VN")}English content normalized from the original source text.`}
        />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Bar dataKey="totalSales" fill="#FE2020" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
