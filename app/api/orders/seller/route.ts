/* eslint-disable @typescript-eslint/no-explicit-any */
import myPrismaClient from "@/utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const seller = await getUser();
  if (!seller) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
  }

  try {
    const sellerOrders = await myPrismaClient.order.findMany({
      where: { sellerId: seller.id },
      include: {
        shippingInfo: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return NextResponse.json(
      { success: true, orders: sellerOrders },
      { status: 200 }
    );
  } catch (error:any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
