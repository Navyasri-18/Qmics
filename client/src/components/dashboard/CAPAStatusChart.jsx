import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = {
  Open: "#3B82F6", // Blue-500
  "In Progress": "#60A5FA", // Blue-400
  Closed: "#10B981", // Emerald-500
  Overdue: "#EF4444", // Red-500
  Escalated: "#7F1D1D", // Red-900
};

const CAPAStatusChart = ({ data }) => {
  const chartData = [
    { name: "Open", count: data.openCapa || 0 },
    { name: "In Progress", count: data.inProgressCapa || 0 },
    { name: "Closed", count: data.closedCapa || 0 },
    { name: "Overdue", count: data.overdueCapa || 0 },
    { name: "Escalated", count: data.escalatedCapa || 0 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E2E8F0"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            cursor={{ fill: "#F1F5F9" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name] || "#CBD5E1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CAPAStatusChart;
