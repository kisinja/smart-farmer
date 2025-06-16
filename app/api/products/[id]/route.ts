import { ParamsProps, UpdateProductDto } from "@/types";
import myPrismaClient from "@/utils/connect";
import { getUser } from "@/utils/kinde/getUser";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: ParamsProps }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const body: UpdateProductDto = await request.json();
    const productId = (await params).id;

    // Validate at least one field is being updated
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    // Validate field types and values
    if (body.price !== undefined && body.price < 0) {
      return NextResponse.json(
        { error: "Price cannot be negative" },
        { status: 400 }
      );
    }

    if (body.stock !== undefined && body.stock < 0) {
      return NextResponse.json(
        { error: "Stock cannot be negative" },
        { status: 400 }
      );
    }

    const updatedProduct = await myPrismaClient.product.update({
      where: {
        id: productId,
        ownerId: user?.id,
      },
      data: body, // Prisma automatically ignores undefined values
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function GET(
  { params }: { params: ParamsProps }
) {
  try {
    const productId = (await params).id;
    const product = await myPrismaClient.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get owner info
    let owner = null;
    try {
      owner = await getUser(product.ownerId);
    } catch (error) {
      console.error("Error fetching owner:", error);
    }

    return NextResponse.json({
      ...product,
      owner: {
        name: owner?.first_name
          ? `${owner?.first_name} ${owner?.last_name}`
          : "Unknown Seller",
        imageUrl: owner?.picture,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: ParamsProps }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const productId = (await params).id;
    await myPrismaClient.product.delete({
      where: { id: productId, ownerId: user?.id },
    });
    return NextResponse.json({ message: "Product deleted !" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
