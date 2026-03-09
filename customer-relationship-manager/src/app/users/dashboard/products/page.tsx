"use client";
import { useEffect, useState, useCallback } from "react";
import ProductGrid from "../../../../components/users/ProductGrid";
import { Product, Review } from "../../types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
    const [productsRes, reviewsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/reviews/mine"),
      ]);
      const productsData = await productsRes.json();
      const reviewsData = await reviewsRes.json();
      setProducts(Array.isArray(productsData) ? productsData : []);
      setUserReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <p className="text-gray-500 mt-1">Browse and review our products</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Product Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filtered.length} of {products.length} products
      </p>

      {/* Grid */}
      <ProductGrid
        products={filtered}
        userReviews={userReviews}
        onReviewUpdate={fetchData}
      />
    </div>
  );
}

