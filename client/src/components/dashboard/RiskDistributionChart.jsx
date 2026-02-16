import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = {
  Low: "#10B981", // Emerald-500
  Medium: "#F59E0B", // Amber-500
  High: "#EF4444", // Red-500
  Critical: "#7F1D1D", // Red-900
};

const RiskDistributionChart = ({ data }) => {
  const chartData = Object.keys(data).map((key) => ({
    name: key,
    value: data[key],
  }));

  if (chartData.every((item) => item.value === 0)) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        No risk data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name] || "#CBD5E1"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskDistributionChart;
