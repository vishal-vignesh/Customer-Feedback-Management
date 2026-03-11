"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Sentiment = "EXCELLENT" | "GOOD" | "SATISFIED" | "BAD" | "POOR";

interface Review {
  sentiment: string;
}

export default function SentimentChart({ reviews }: { reviews: Review[] }) {
  // Aggregate sentiment counts
  const dataMap = {
    EXCELLENT: 0,
    GOOD: 0,
    SATISFIED: 0,
    BAD: 0,
    POOR: 0,
  };

  reviews.forEach((review) => {
    if (dataMap[review.sentiment as Sentiment] !== undefined) {
      dataMap[review.sentiment as Sentiment]++;
    }
  });

  const data = Object.keys(dataMap).map((key) => ({
    name: key,
    value: dataMap[key as Sentiment],
  })).filter(item => item.value > 0);

  const COLORS = {
    EXCELLENT: "#10b981", // Emerald 500
    GOOD: "#3b82f6",      // Blue 500
    SATISFIED: "#fbbf24", // Amber 400
    BAD: "#f97316",       // Orange 500
    POOR: "#ef4444",      // Red 500
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Sentiment Analysis</h3>
      <div className="h-[300px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No sentiment data available
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
