import { Cart, Order } from "@/lib/generated/prisma";
import { getGreeting } from "@/utils";
import Image from "next/image";
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiShoppingCart,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";
import { RiRefund2Line } from "react-icons/ri";
import { Skeleton } from "./ui/skeleton";
import StatCard from "./StatCard";
import OrderCard from "./OrderCard";

const UserDashboard = ({
  user,
  orders,
  cart,
}: {
  orders: Order[];
  cart: Cart;
}) => {
  // Sample data structure (replace with actual data from your backend)
  const userStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "PENDING").length,
    deliveredOrders: orders.filter((o) => o.status === "DELIVERED").length,
    cartItems: cart?.cartItems?.length || (0 as number),
  };

  const userImg =
    user?.picture ||
    "https://i.pinimg.com/474x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg";

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-800 text-white shadow-lg max-w-6xl mx-auto rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
              {user ? (
                <div className="flex items-center mt-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                    <Image
                      src={userImg}
                      width={40}
                      height={40}
                      className="rounded-full"
                      alt="User profile"
                    />
                  </div>
                  <div>
                    <p className="text-indigo-100">
                      {getGreeting()}, {user.given_name || "Seller"}!
                    </p>
                    <p className="text-sm text-indigo-200">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <Skeleton className="h-4 w-[200px] mt-2" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiPackage className="text-3xl" />}
            title="Total Orders"
            value={userStats.totalOrders}
            color="bg-indigo-200"
          />
          <StatCard
            icon={<FiClock className="text-3xl" />}
            title="Pending"
            value={userStats.pendingOrders}
            color="bg-amber-200"
          />
          <StatCard
            icon={<FiCheckCircle className="text-3xl" />}
            title="Delivered"
            value={userStats.deliveredOrders}
            color="bg-emerald-200"
          />
          <StatCard
            icon={<FiShoppingCart className="text-3xl" />}
            title="Cart Items"
            value={userStats.cartItems}
            color="bg-purple-200"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-indigo-800 text-white p-4 flex items-center">
                <FiPackage className="mr-2" />
                <h2 className="text-xl font-semibold">Recent Orders</h2>
              </div>
              <div className="p-4">
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                    <button className="w-full py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded">
                      View All Orders
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiPackage className="mx-auto text-4xl mb-2" />
                    <p>You haven&apos;t placed any orders yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Info Sidebar */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-indigo-800 text-white p-4 flex items-center">
                <FiMapPin className="mr-2" />
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>
              <div className="p-4">
                {orders[0]?.shippingInfo ? (
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {orders[0].shippingInfo.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {orders[0].shippingInfo.address}
                    </p>
                    <p>
                      <span className="font-medium">City:</span>{" "}
                      {orders[0].shippingInfo.city}
                    </p>
                    <p>
                      <span className="font-medium">Country:</span>{" "}
                      {orders[0].shippingInfo.country}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {orders[0].shippingInfo.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {orders[0].shippingInfo.phone}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No shipping information available
                  </p>
                )}
                <button className="mt-4 text-indigo-600 font-medium hover:underline">
                  Update Shipping Info
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-indigo-800 text-white p-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                  <FiShoppingCart className="text-2xl text-indigo-600 mb-2" />
                  <span>View Cart</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                  <FiHome className="text-2xl text-indigo-600 mb-2" />
                  <span>Continue Shopping</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                  <RiRefund2Line className="text-2xl text-indigo-600 mb-2" />
                  <span>Request Return</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                  <FiDollarSign className="text-2xl text-indigo-600 mb-2" />
                  <span>Payment Methods</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
