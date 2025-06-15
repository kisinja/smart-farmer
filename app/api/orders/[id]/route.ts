import { ParamsProps } from "@/types";
import myPrismaClient from "@/utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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