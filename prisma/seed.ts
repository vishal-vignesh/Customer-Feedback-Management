import { Sentiment, ReviewStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

 
async function main() {
 
  const product1 = "b24a4577-0e2b-4d5d-9db7-c10be4216081";
  const product2 = "f2b29055-12d2-4e55-8bf5-5c7bc9f5ea5b";
  const user1 = "114553dd-4c66-4d62-ac13-24ad41ddfa0d";
 
  await prisma.review.createMany({
    data: [
      {
        productId: product1,
        userId: user1,
        rating: 5,
        reviewText: "Amazing product, highly recommend!",
        sentiment: Sentiment.EXCELLENT,
        status: ReviewStatus.UNRESOLVED
      },
      {
        productId: product1,
        userId: user1,
        rating: 4,
        reviewText: "Good quality but delivery was slow.",
        sentiment: Sentiment.GOOD,
        status: ReviewStatus.UNRESOLVED
      },
      {
        productId: product2,
        userId: user1,
        rating: 2,
        reviewText: "Not satisfied with the product.",
        sentiment: Sentiment.BAD,
        status: ReviewStatus.UNRESOLVED
      }
    ]
  });
 
  console.log("Reviews seeded successfully");
}
 
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
 