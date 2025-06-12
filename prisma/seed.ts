// prisma/seed.ts
import myPrismaClient from "@/utils/connect";
import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Fruits",
      description: "Fresh farm-grown fruits",
      imageUrl: "https://example.com/images/fruits.jpg",
    },
    {
      name: "Vegetables",
      description: "Organic and healthy vegetables",
      imageUrl: "https://example.com/images/vegetables.jpg",
    },
    {
      name: "Dairy",
      description: "Milk, cheese, and other dairy products",
      imageUrl: "https://example.com/images/dairy.jpg",
    },
    {
      name: "Grains",
      description: "Maize, rice, wheat and more",
      imageUrl: "https://example.com/images/grains.jpg",
    },
    {
      name: "Livestock",
      description: "Cattle, goats, poultry and others",
      imageUrl: "https://example.com/images/livestock.jpg",
    },
  ];

  for (const category of categories) {
    await myPrismaClient.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });