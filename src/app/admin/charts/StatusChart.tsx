"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type ReviewStatus = "UNRESOLVED" | "RESOLVED";

interface Review {
  status: string;
}

export default function StatusChart({ reviews }: { reviews: Review[] }) {
  // Aggregate status counts
  const dataMap = {
    UNRESOLVED: 0,
    RESOLVED: 0,
  };

  reviews.forEach((review) => {
    if (dataMap[review.status as ReviewStatus] !== undefined) {
      dataMap[review.status as ReviewStatus]++;
    }
  });

  const data = Object.keys(dataMap).map((key) => ({
    name: key,
    value: dataMap[key as ReviewStatus],
  })).filter(item => item.value > 0);

  const COLORS = {
    RESOLVED: "#10b981",    // Emerald 500 (Green)
    UNRESOLVED: "#f43f5e",  // Rose 500 (Red)
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Review Status</h3>
      <div className="h-[300px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No status data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS] || "#CBD5E1"} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
