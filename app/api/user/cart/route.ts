import myPrismaClient from "@/utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  try {
    const userCart = await myPrismaClient.cart.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ cart: userCart }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user cart" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const body = await req.json();

  try {
    // 1. Find or create the cart
    let cart = await myPrismaClient.cart.findFirst({
      where: { userId: user?.id || "" },
    });

    if (!cart) {
      cart = await myPrismaClient.cart.create({
        data: {
          userId: user?.id || "",
        },
      });
    }

    // 2. Check if item already in cart
    const existingItem = await myPrismaClient.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: body.productId,
      },
    });

    if (existingItem) {
      await myPrismaClient.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + 1,
        },
      });
    } else {
      await myPrismaClient.cartItem.create({
        data: {
          cartId: cart.id,
          productId: body.productId,
          quantity: 1,
        },
      });
    }

    // Return updated cart
    const updatedCart = await myPrismaClient.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ cart: updatedCart }, { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update cart" }),
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const body = await req.json(); // { productId: string, quantity: number }

  try {
    const cart = await myPrismaClient.cart.findFirst({
      where: { userId: user?.id || "" },
    });

    if (!cart) {
      return new Response("Cart not found", { status: 404 });
    }

    const updatedItem = await myPrismaClient.cartItem.updateMany({
      where: {
        cartId: cart.id,
        productId: body.productId,
      },
      data: {
        quantity: body.quantity,
      },
    });

    const updatedCart = await myPrismaClient.cart.findUnique({
      where: { id: cart.id },
      include: { cartItems: { include: { product: true } } },
    });

    return NextResponse.json({ cart: updatedCart }, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return new Response("Failed to update item quantity", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const { productId } = await req.json();

  try {
    const cart = await myPrismaClient.cart.findFirst({
      where: { userId: user?.id || "" },
    });

    if (!cart) {
      return new Response("Cart not found", { status: 404 });
    }

    await myPrismaClient.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    const updatedCart = await myPrismaClient.cart.findUnique({
      where: { id: cart.id },
      include: { cartItems: { include: { product: true } } },
    });

    return NextResponse.json({ cart: updatedCart }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response("Failed to delete item", { status: 500 });
  }
}
