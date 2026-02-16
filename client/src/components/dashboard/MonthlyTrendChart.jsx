import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonthlyTrendChart = ({ data }) => {
  // Merge created and closed data by month
  const months = Array.from(
    new Set([
      ...(data.created || []).map((d) => d._id),
      ...(data.closed || []).map((d) => d._id),
    ]),
  ).sort();

  const chartData = months.map((month) => ({
    name: month,
    Created: data.created?.find((d) => d._id === month)?.count || 0,
    Closed: data.closed?.find((d) => d._id === month)?.count || 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        No trend data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E2E8F0"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend iconType="circle" />
          <Line
            type="monotone"
            dataKey="Created"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Closed"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;
