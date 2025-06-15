import { NextRequest, NextResponse } from "next/server";
import myPrismaClient from "@/utils/connect";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyerId, orderItems, shippingInfo, totalAmount, paymentMethod, paymentReference } = body;

    if (!buyerId || !orderItems || orderItems.length === 0 || !shippingInfo || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing or invalid order data" },
        { status: 400 }
      );
    }

    // Filter valid items
    const validOrderItems = orderItems.filter((item: any) => item.id);
    if (validOrderItems.length !== orderItems.length) {
      return NextResponse.json(
        { error: "Some order items are missing product ID" },
        { status: 400 }
      );
    }

    // Fetch product info
    const productIds = validOrderItems.map((item: any) => item.id);
    const products = await myPrismaClient.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        price: true,
        ownerId: true,
      },
    });

    if (products.length !== productIds.length) {
      const missingProducts = productIds.filter(
        (id: string) => !products.some((p) => p.id === id)
      );
      return NextResponse.json(
        { error: `Products not found: ${missingProducts.join(", ")}` },
        { status: 404 }
      );
    }

    // Group items by seller
    const itemsBySeller = new Map<string, any[]>();
    for (const item of validOrderItems) {
      const product = products.find((p) => p.id === item.id);
      if (!product) continue;

      if (!itemsBySeller.has(product.ownerId)) {
        itemsBySeller.set(product.ownerId, []);
      }
      itemsBySeller.get(product.ownerId)?.push(item);
    }

    const createdOrders = [];

    for (const [sellerId, sellerItems] of itemsBySeller.entries()) {
      const sellerAmount = sellerItems.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);
        return sum + (product?.price || 0) * item.quantity + 200;
      }, 0);

      const order = await myPrismaClient.order.create({
        data: {
          buyerId,
          sellerId,
          paymentMethod,
          paymentReference,
          totalAmount: sellerAmount,
          shippingInfo: {
            create: {
              fullName: shippingInfo.fullName,
              email: shippingInfo.email,
              phone: shippingInfo.phone,
              address: shippingInfo.address,
              city: shippingInfo.city,
              country: shippingInfo.country,
            },
          },
          orderItems: {
            create: sellerItems.map((item: any) => ({
              quantity: item.quantity,
              product: {
                connect: { id: item.id },
              },
            })),
          },
        },
        include: {
          shippingInfo: true,
          orderItems: true,
        },
      });

      createdOrders.push({
        id: order.id,
        sellerId: order.sellerId,
        amount: order.totalAmount,
      });
    }

    // ✅ Clear user's cart
    await myPrismaClient.cartItem.deleteMany({
      where: {
        cart: {
          userId: buyerId,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Orders created and cart cleared successfully",
        orders: createdOrders,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}