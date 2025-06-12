import myPrismaClient from "@/utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  try {
    const products = await myPrismaClient.product.findMany({
      where: {
        ownerId: user?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching user products:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user products" }),
      { status: 500 }
    );
  }
}
