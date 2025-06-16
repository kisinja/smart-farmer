import UserDashboard from "@/components/UserDashboard";
import myPrismaClient from "@/utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

const UserDashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user)

  const userOrders = await myPrismaClient.order.findMany({
    where: { buyerId: user?.id },
    include: { orderItems: true, shippingInfo: true },
  });

  const userCart = await myPrismaClient.cart.findFirst({
    where: { userId: user?.id },
    include: { cartItems: true },
  });
  return (
    <div>
      <UserDashboard user={user} orders={userOrders} cart={userCart} />
    </div>
  );
};

export default UserDashboardPage;
