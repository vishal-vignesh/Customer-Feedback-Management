"use client";
import { Review } from "../types";
import StarRating from "./StarRating";

export default function ReviewTable({ reviews }: { reviews: Review[] }) {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden divide-y divide-gray-100">
      {reviews.map((r) => (
        <div key={r.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-base">{r.product}</h3>
              <div className="flex items-center gap-3 mt-1">
                <StarRating rating={r.rating} readonly size="sm" />
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
              r.status === "Resolved" 
                ? "bg-green-100 text-green-700" 
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {r.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{r.message}</p>
        </div>
      ))}
    </div>
  );
}