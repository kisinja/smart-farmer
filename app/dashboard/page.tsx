import UserDashboard from "@/components/UserDashboard";
import myPrismaClient from "@/utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user?.id;

  const userProducts = await myPrismaClient.product.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      category: true,
      orderItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await myPrismaClient.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const orders = await myPrismaClient.order.findMany({
    where: { sellerId: userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      shippingInfo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  console.log(user);
  return (
    <div>
      <UserDashboard
        userProducts={userProducts ? userProducts : []}
        categories={categories ? categories : []}
        pendingOrders={orders ? orders.length :0}
      />
    </div>
  );
};

export default DashboardPage;
