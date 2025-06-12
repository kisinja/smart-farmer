import { PrismaClient } from "@/lib/generated/prisma";

// Create a type for the global prisma instance (for TypeScript)
const myPrismaClient = new PrismaClient();

export default myPrismaClient;