import { ParamsProps } from "@/types";
import myPrismaClient from "@/utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { buyerId, orderItems, shippingInfo, totalAmount, paymentMethod } =
      body;

    if (!buyerId || !orderItems || orderItems.length === 0 || !shippingInfo) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Create the order
    const order = await myPrismaClient.order.create({
      data: {
        buyerId,
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
        totalAmount,
        paymentMethod,
        orderItems: {
          create: orderItems.map((item: any) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        shippingInfo: true,
        orderItems: true,
      },
    });

    return NextResponse.json(
      { success: true, orderId: order.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Get order details by ID
export async function GET(req: NextRequest, {params}:{params:ParamsProps}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  try {
    const orderId = (await params).id

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch the order details
    const order = await myPrismaClient.order.findUnique({
      where: { id: orderId, buyerId: user?.id },
      include: {
        shippingInfo: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
