// app/api/products/[id]/view/route.ts
import { NextResponse } from "next/server";
import myPrismaClient from "@/utils/connect";
import { ParamsProps } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: ParamsProps }
) {
  try {
    const productId = (await params).id;

    // Increment the view count
    const updatedProduct = await myPrismaClient.product.update({
      where: { id: productId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update view count" },
      { status: 500 }
    );
  }
}
