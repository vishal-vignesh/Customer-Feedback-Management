"use client";

import Link from "next/link";
import { Product } from "../types";
import { format } from "date-fns";
import { useState } from "react";

export default function ProductTable({ products }: { products: Product[] }) {
  // keep products in local state
  const [productList, setProductList] = useState(products);

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      // remove from UI immediately
      setProductList(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  const getAvgRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return "No ratings";
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  const fallbackImage = `https://ui-avatars.com/api/?name=Product&background=000000&color=fff&size=200&bold=true`;

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden divide-y divide-gray-100">
      {productList.map((p) => (
        <div key={p.id} className="p-4 flex items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
          {/* IMAGE */}
          <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={p.imageUrl?.startsWith("http") ? p.imageUrl : p.imageUrl || fallbackImage}
              alt={p.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
            />
          </div>

          {/* DETAILS */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate">{p.name}</h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-semibold text-green-600">${p.price}</span>
              <span className="text-sm text-amber-600 font-medium">⭐ {getAvgRating(p.reviews)}</span>
              <span className="text-xs text-gray-400">Created: {format(new Date(p.createdAt), "dd/MM/yyyy")}</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 flex-shrink-0">
            <Link 
              href={`/admin/products/${p.id}/reviews`} 
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Reviews
            </Link>
            <button 
              onClick={() => deleteProduct(p.id)} 
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}