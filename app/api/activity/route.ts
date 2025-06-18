import { NextResponse } from "next/server";
import myPrismaClient from "@/utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  try {
    // Get recent orders with their related data
    const recentOrders = await myPrismaClient.order.findMany({
      where: { sellerId: user?.id},
      take: 5, // Limit to 5 most recent
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        shippingInfo: true,
      },
    });

    // Transform orders into activity items
    const activities = recentOrders.map((order) => {
      const productNames = order.orderItems
        .map((item) => item.product.title)
        .join(", ");

      let activityMessage = "";
      let icon = "truck";

      switch (order.status) {
        case "PENDING":
          activityMessage = `New order received for ${productNames}`;
          icon = "shopping-cart";
          break;
        case "SHIPPED":
          activityMessage = `Order shipped to ${order.shippingInfo.fullName}`;
          icon = "truck";
          break;
        case "DELIVERED":
          activityMessage = `Order delivered to ${order.shippingInfo.fullName}`;
          icon = "package";
          break;
        default:
          activityMessage = `Order update: ${order.status}`;
      }

      return {
        id: order.id,
        title: `Order #${order.id.substring(0, 8)}`,
        description: activityMessage,
        icon,
        createdAt: order.createdAt,
        type: "order",
      };
    });

    // You could add other activity types here (like product updates, etc.)
    // For example:
    // const productUpdates = await prisma.product.findMany(...)
    // activities.push(...productUpdates.map(...))

    // Sort all activities by date
    activities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(activities.slice(0, 5)); // Return only top 5
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}
