"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

export default function ReviewModal({ review }: any) {
  const router = useRouter();
  const [showBox, setShowBox] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // DELETE REVIEW
  const handleDelete = async (reviewId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to delete review");
        return;
      }

      alert("Review deleted successfully");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // ADMIN RESPONSE
  const handleRespond = async () => {
    if (!message.trim()) {
      alert("Response cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reviewId: review.id,
          message
        })
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to send response");
        return;
      }

      setMessage("");
      setShowBox(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "EXCELLENT":
      case "GOOD":
        return "text-green-600 bg-green-50";
      case "SATISFIED":
        return "text-yellow-600 bg-yellow-50";
      case "BAD":
      case "POOR":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-lg">{review.reviewText}</p>
          <div className="flex items-center gap-4 mt-2">
            <StarRating rating={review.rating} readonly size="sm" />
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment)}`}>
          {review.sentiment}
        </span>
      </div>

      {/* ADMIN RESPONSE DISPLAY */}
      {review.responses?.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Admin Response</span>
          </div>
          <p className="text-sm text-gray-600">{review.responses[0].message}</p>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 mt-4">
        {review.responses?.length === 0 && (
          <button
            onClick={() => setShowBox(!showBox)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {showBox ? "Cancel" : "Respond"}
          </button>
        )}
        
        <button
          onClick={() => handleDelete(review.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>

      {/* RESPONSE TEXTAREA */}
      {showBox && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Response
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows={3}
            placeholder="Write your response..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleRespond}
            disabled={loading}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Response"}
          </button>
        </div>
      )}
    </div>
  );
}