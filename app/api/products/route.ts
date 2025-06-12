import myPrismaClient from "@/utils/connect";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const product = await myPrismaClient.product.create({
      data: {
        title: body.title,
        ownerId: user?.id || "",
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        stock: body.stock,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await myPrismaClient.product.findMany({
      include: {
        category: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
