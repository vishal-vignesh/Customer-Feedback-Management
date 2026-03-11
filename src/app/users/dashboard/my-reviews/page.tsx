"use client";
import { useEffect, useState, useCallback } from "react";
import ReviewCard from "../../../../components/users/ReviewCard";
import { Review } from "../../types";
export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "responded" | "pending">("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews/mine");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/reviews/mine");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to refresh reviews:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchReviews();
    }, 1500000);

    return () => clearInterval(interval);
  }, [fetchReviews]);

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = reviews.filter((r) => {
    if (filter === "responded") return r.status === "RESOLVED";
    if (filter === "pending") return r.status === "UNRESOLVED";
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
          <p className="text-gray-500 mt-1">{reviews.length} total review{reviews.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <svg className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: reviews.length },
          { label: "Resolved", value: reviews.filter((r) => r.status === "RESOLVED").length },
          { label: "Unresolved", value: reviews.filter((r) => r.status === "UNRESOLVED").length },
        ].map((s) => (
          <div key={s.label} className="bg-white shadow rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "responded", "pending"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                ? "bg-black text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
          >
            {f === "all" ? "All" : f === "responded" ? "Responded" : "Pending"}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white shadow rounded-xl">
          <div className="text-5xl mb-4"></div>
          <h3 className="text-gray-700 font-semibold text-lg">No reviews found</h3>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "all" ? "You haven't written any reviews yet." : `No ${filter} reviews.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={handleDelete}
              onUpdate={fetchReviews}
            />
          ))}
        </div>
      )}
    </div>
  );
}
