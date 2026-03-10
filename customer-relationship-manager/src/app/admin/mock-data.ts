import { Product, Review } from "./types";

export const products: Product[] = [
  { id: 1, name: "iPhone", avgRating: 4.5 },
  { id: 2, name: "Laptop", avgRating: 3.8 },
];

export const reviews: Review[] = [
  {
    id: 1,
    productId: 1,
    product: "iPhone",
    rating: 5,
    message: "Excellent phone",
    status: "New",
  },
  {
    id: 2,
    productId: 2,
    product: "Laptop",
    rating: 2,
    message: "Battery bad",
    status: "Resolved",
  },
];