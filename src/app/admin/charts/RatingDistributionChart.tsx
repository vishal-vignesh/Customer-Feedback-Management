"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Review {
  rating: number;
}

export default function RatingDistributionChart({ reviews }: { reviews: Review[] }) {
  // Aggregate rating counts
  const dataMap = {
    "1 Star": 0,
    "2 Stars": 0,
    "3 Stars": 0,
    "4 Stars": 0,
    "5 Stars": 0,
  };

  reviews.forEach((review) => {
    if (review.rating === 1) dataMap["1 Star"]++;
    if (review.rating === 2) dataMap["2 Stars"]++;
    if (review.rating === 3) dataMap["3 Stars"]++;
    if (review.rating === 4) dataMap["4 Stars"]++;
    if (review.rating === 5) dataMap["5 Stars"]++;
  });

  const data = Object.keys(dataMap).map((key) => ({
    name: key.replace(" Stars", "★").replace(" Star", "★"),
    count: dataMap[key as keyof typeof dataMap],
  }));

  const allEmpty = data.every(item => item.count === 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Rating Distribution</h3>
      <div className="h-[300px]">
        {allEmpty ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No ratings available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 13 }}
                dy={10}
              />
              <YAxis 
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 13 }}
              />
              <Tooltip 
                cursor={{ fill: "#F1F5F9" }}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Bar 
                dataKey="count" 
                fill="#818cf8" 
                radius={[6, 6, 0, 0]} 
                animationBegin={200}
                animationDuration={800}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
