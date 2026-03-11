import { Product, Review } from "../../app/users/types";
import ProductCard from "./ProductCard";
interface ProductGridProps {
  products: Product[];
  userReviews: Review[];
  onReviewUpdate: () => void;
}

export default function ProductGrid({ products, userReviews, onReviewUpdate }: ProductGridProps) {
  const getUserReview = (productId: string) =>
    userReviews.find((r) => r.productId === productId) || null;

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white shadow rounded-xl">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-gray-700 font-semibold text-lg">No products found</h3>
        <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          userReview={getUserReview(product.id)}
          onReviewUpdate={onReviewUpdate}
        />
      ))}
    </div>
  );
}