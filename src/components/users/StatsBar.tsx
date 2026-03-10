interface StatsBarProps {
  totalProducts: number;
  totalReviews: number;
  avgRating: number;
  pendingResponses: number;
}

export default function StatsBar({
  totalProducts,
  totalReviews,
  avgRating,
  pendingResponses,
}: StatsBarProps) {
  const stats = [
    { title: "Products", value: totalProducts, icon: "🛍️" },
    { title: "Your Reviews", value: totalReviews, icon: "✍️" },
    {
      title: "Avg Rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : "—",
      icon: "⭐",
    },
    { title: "Awaiting Reply", value: pendingResponses, icon: "💬" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white shadow rounded-xl p-5">
          <div className="text-2xl mb-1">{stat.icon}</div>
          <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          <p className="text-gray-500 text-sm mt-0.5">{stat.title}</p>
        </div>
      ))}
    </div>
  );
}