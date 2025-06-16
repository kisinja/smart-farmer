"use client";

import Image from "next/image";
import {
  FiPackage,
  FiDollarSign,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiShoppingCart,
  FiTruck,
  FiUser,
  FiXCircle,
  FiSave,
  FiChevronDown,
  FiCalendar,
} from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { Category, Order, Product } from "@/lib/generated/prisma";
import Link from "next/link";
import { formatPrice, getGreeting } from "@/utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DeleteConfirmationModal from "./DeleteModalConfirmation";
import StatusBadge from "./StatusBadge";

const validStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

type UserProductsProps = {
  userProducts: Product[];
  categories: Category[];
  pendingOrders?: number;
};

const SellerDashboard = ({
  userProducts,
  categories,
  pendingOrders,
}: UserProductsProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalViews: 0,
    pendingOrders: pendingOrders,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    title?: string;
  } | null>(null);
  const [orders, setOrders] = useState<Order[] | []>();
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Track per-order update loading and errors
  const [updatingOrders, setUpdatingOrders] = useState<string[]>([]);
  const [errorOrders, setErrorOrders] = useState<string[]>([]);

  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const router = useRouter();

  // View action - redirect to product page
  const handleView = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  // Edit action - redirect to edit page
  const handleEdit = (productId: string) => {
    router.push(`/products/${productId}/edit`);
  };

  // Delete action
  const handleDeleteClick = (productId: string, productTitle?: string) => {
    setProductToDelete({ id: productId, title: productTitle });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        router.refresh();
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Error deleting product");
      console.error("Delete error:", error);
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    // Calculate stats from userProducts
    const calculateStats = () => {
      const totalProducts = userProducts.length;
      const totalRevenue = userProducts.reduce(
        (sum, product) => sum + product.price * (product.stock || 0),
        0
      );
      const totalViews = userProducts.reduce(
        (sum, product) => sum + (product.views || 0),
        0
      );

      setDashboardStats({
        totalProducts,
        totalRevenue,
        totalViews,
        pendingOrders,
      });

      setLoading(false);
    };

    // Fetch recent activity
    const fetchRecentActivity = async () => {
      setActivityLoading(true);
      try {
        const res = await fetch("/api/activity");
        const data = await res.json();
        setRecentActivity(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setActivityLoading(false);
      }
    };

    // Fetch orders
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch("/api/orders/seller");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
    calculateStats();
    fetchRecentActivity();
  }, [userProducts, pendingOrders]);

  const handleOrderUpdate = async ({
    orderId,
    newStatus,
    newTrackingNumber,
  }: {
    orderId: string;
    newStatus: string;
    newTrackingNumber: string;
  }) => {
    setUpdatingOrders((ids) => [...ids, orderId]);
    setErrorOrders((ids) => ids.filter((id) => id !== orderId));

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: newTrackingNumber,
        }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      const { order: updatedOrder } = await res.json();

      // Show success notification
      toast.success(`Order #${orderId.slice(0, 6)} updated successfully`, {
        position: "bottom-right",
        icon: "✅",
      });

      setOrders((prev) =>
        prev?.map((order) => (order.id === orderId ? updatedOrder : order))
      );
    } catch (e) {
      console.error(e);
      setErrorOrders((ids) => [...ids, orderId]);

      // Show error notification
      toast.error(`Failed to update order #${orderId.slice(0, 6)}`, {
        position: "bottom-right",
        icon: "❌",
      });

      // Revert optimistic update
      setOrders((prev) =>
        prev?.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status:
                  orders?.find((or) => or.id === orderId)?.status || newStatus,
              }
            : o
        )
      );
    } finally {
      setUpdatingOrders((ids) => ids.filter((id) => id !== orderId));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCategoryChange = (e: any) => {
    setSelectedCategory(e.target.value);
  };

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "All"
      ? userProducts
      : userProducts.filter(
          (product) => product.categoryId === selectedCategory
        );

  // Stats cards data
  const stats = [
    {
      title: "Total Products",
      value: dashboardStats.totalProducts,
      icon: <FiPackage className="text-indigo-500" />,
      change: "+0%",
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: `${formatPrice(dashboardStats.totalRevenue)}`,
      icon: <FiDollarSign className="text-green-500" />,
      change: "+0%",
      trend: "up",
    },
    {
      title: "Total Views",
      value: dashboardStats.totalViews,
      icon: <FiEye className="text-blue-500" />,
      change: "+0%",
      trend: "up",
    },
    {
      title: "Orders Pending",
      value: dashboardStats.pendingOrders,
      icon: <FiShoppingCart className="text-yellow-500" />,
      change: "+0",
      trend: "up",
    },
  ];

  console.log(orders);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        productTitle={productToDelete?.title}
      />

      <header className="bg-gradient-to-r from-indigo-600 to-purple-800 text-white shadow-lg max-w-6xl mx-auto rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Seller Dashboard</h1>
              {user ? (
                <div className="flex items-center mt-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        width={40}
                        height={40}
                        className="rounded-full"
                        alt="User profile"
                      />
                    ) : (
                      <FiUser className="text-white text-xl" />
                    )}
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
            <Link href="/products/new">
              <button className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-indigo-600 px-4 py-2 rounded-lg transition-colors shadow-md">
                <FiPlus size={18} />
                <span>Add Product</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                  >
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-8 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))
            : stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                  <div
                    className={`mt-4 flex items-center text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                    <span className="ml-1">
                      {stat.trend === "up" ? "↑" : "↓"}
                    </span>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* Recent activity and orders section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
          {/* Recent Activity */}
          <div className="w-full">
            {activityLoading ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start pb-4 border-b border-gray-100 last:border-0"
                      >
                        <Skeleton className="h-10 w-10 rounded-full mr-4" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                </div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                        {activity.icon === "shopping-cart" ? (
                          <FiShoppingCart className="text-indigo-600" />
                        ) : activity.icon === "package" ? (
                          <FiPackage className="text-indigo-600" />
                        ) : (
                          <FiTruck className="text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h2>
                </div>
                <p className="text-sm text-gray-500 py-4 text-center">
                  No recent activity
                </p>
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div className="w-full md:col-span-2 bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Order Management
              </h2>
              <div className="flex items-center space-x-2">
                <FiPackage className="text-indigo-500 text-xl" />
                <span className="text-sm font-medium text-gray-500">
                  {orders?.length || 0} orders
                </span>
              </div>
            </div>

            {loadingOrders ? (
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="relative overflow-hidden">
                      <div className="h-36 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl animate-pulse" />
                      <div className="absolute inset-0 flex flex-col justify-between p-5">
                        <div className="flex justify-between">
                          <div className="space-y-2">
                            <div className="h-6 w-32 bg-gray-300 rounded-lg" />
                            <div className="h-4 w-24 bg-gray-200 rounded-lg" />
                          </div>
                          <div className="h-6 w-24 bg-gray-300 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-4 bg-gray-200 rounded-lg" />
                          <div className="h-4 bg-gray-200 rounded-lg" />
                          <div className="h-4 bg-gray-200 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <FiShoppingCart className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No orders yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your products haven't received any orders yet. Keep promoting!
                </p>
              </div>
            ) : (
              <div className="space-y-4 h-[500px] overflow-y-scroll" id="orders-section">
                {orders.map((order) => {
                  const isUpdating = updatingOrders.includes(order.id);
                  const hasError = errorOrders.includes(order.id);
                  const orderDate = new Date(order.createdAt);
                  const formattedDate = orderDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const formattedTime = orderDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  // Safely calculate total items
                  const totalItems =
                    order.orderItems?.reduce(
                      (sum, item) => sum + (item.quantity || 0),
                      0
                    ) || 0;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`relative group overflow-hidden rounded-2xl shadow-sm ${
                        hasError
                          ? "border-2 border-red-200 bg-red-50/30"
                          : "border border-gray-200/80 bg-white"
                      } hover:shadow-md transition-all duration-200`}
                    >
                      {/* Status indicator bar */}
                      <div
                        className={`absolute top-0 left-0 h-1 w-full ${
                          order.status === "PENDING"
                            ? "bg-yellow-400"
                            : order.status === "SHIPPED"
                            ? "bg-blue-500"
                            : order.status === "DELIVERED"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>

                      <div className="p-5">
                        {/* Header section */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-semibold bg-gray-100 px-3 py-1.5 rounded-lg">
                              #{order.id?.slice(0, 6).toUpperCase() || "ORDER"}
                            </span>
                            <StatusBadge status={order.status || "PENDING"} />
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCalendar className="text-gray-400" />
                            <span>{formattedDate}</span>
                            <span className="text-gray-400">•</span>
                            <span>{formattedTime}</span>
                          </div>
                        </div>

                        {/* Main content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Order summary */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-500">
                              Order Summary
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Items</span>
                                <span className="font-medium">
                                  {totalItems}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total</span>
                                <span className="font-semibold text-gray-900">
                                  {formatPrice(order.totalAmount || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Payment</span>
                                <span className="capitalize font-medium">
                                  {order.paymentMethod?.toLowerCase() ||
                                    "unknown"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Product preview */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                              Products
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {order.orderItems?.slice(0, 4).map(
                                (item) =>
                                  item?.product && (
                                    <div
                                      key={item.id}
                                      className="relative group cursor-pointer"
                                      onClick={() =>
                                        router.push(
                                          `/products/${item.product.id}`
                                        )
                                      }
                                    >
                                      <div className="h-14 w-14 rounded-lg bg-white border border-gray-200 overflow-hidden shadow-xs">
                                        {item.product.imageUrl && (
                                          <Image
                                            width={56}
                                            height={56}
                                            className="h-full w-full object-cover"
                                            src={item.product.imageUrl}
                                            alt={
                                              item.product.title ||
                                              "Product image"
                                            }
                                          />
                                        )}
                                      </div>
                                      <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                                        {item.quantity || 1}
                                      </div>
                                    </div>
                                  )
                              )}
                              {order.orderItems?.length > 4 && (
                                <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                  +{order.orderItems.length - 4}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Status controls */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-500">
                              Update Status
                            </h3>
                            <div className="space-y-3">
                              <div className="relative">
                                <select
                                  disabled={isUpdating}
                                  className={`w-full appearance-none border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10 ${
                                    hasError
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300"
                                  } ${
                                    isUpdating
                                      ? "bg-gray-100 cursor-not-allowed"
                                      : "bg-white hover:border-gray-400"
                                  } transition-colors`}
                                  value={order.status || "PENDING"}
                                  onChange={(e) => {
                                    setOrders((prev) =>
                                      prev?.map((o) =>
                                        o.id === order.id
                                          ? { ...o, status: e.target.value }
                                          : o
                                      )
                                    );
                                  }}
                                >
                                  {validStatuses.map((status) => (
                                    <option key={status} value={status}>
                                      {status.charAt(0) +
                                        status.slice(1).toLowerCase()}
                                    </option>
                                  ))}
                                </select>
                                <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                              </div>

                              <div className="relative">
                                <FiTruck className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Tracking number"
                                  disabled={isUpdating}
                                  value={order.trackingNumber || ""}
                                  onChange={(e) => {
                                    setOrders((prev) =>
                                      prev?.map((o) =>
                                        o.id === order.id
                                          ? {
                                              ...o,
                                              trackingNumber: e.target.value,
                                            }
                                          : o
                                      )
                                    );
                                  }}
                                  className={`w-full pl-10 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    hasError
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300"
                                  } ${
                                    isUpdating
                                      ? "bg-gray-100 cursor-not-allowed"
                                      : "bg-white hover:border-gray-400"
                                  } transition-colors`}
                                />
                              </div>

                              <button
                                disabled={isUpdating}
                                onClick={() =>
                                  handleOrderUpdate({
                                    orderId: order.id,
                                    newStatus: order.status || "PENDING",
                                    newTrackingNumber:
                                      order.trackingNumber || "",
                                  })
                                }
                                className={`w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                  isUpdating
                                    ? "bg-indigo-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                                } text-white`}
                              >
                                {isUpdating ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Updating...
                                  </>
                                ) : (
                                  "Save Changes"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {hasError && (
                          <div className="mt-4 flex items-center text-sm text-red-600 bg-red-50/50 px-4 py-2 rounded-lg">
                            <FiXCircle className="flex-shrink-0 mr-2" />
                            <span>
                              Failed to update order. Please try again.
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Products
            </h2>
            <div className="flex space-x-3">
              {loading ? (
                <Skeleton className="h-9 w-32 rounded-md" />
              ) : (
                <select
                  className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Stock
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, i) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(i += 1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Image
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={product.imageUrl}
                                  alt={product.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.title}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category?.name || "Uncategorized"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.stock > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleView(product.id)}
                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                aria-label="View product"
                                title="View"
                              >
                                <FiEye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(product.id)}
                                className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                aria-label="Edit product"
                                title="Edit"
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteClick(product.id, product.title)
                                }
                                className="text-red-600 hover:text-red-900 cursor-pointer"
                                aria-label="Delete product"
                                title="Delete"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          {selectedCategory === "All"
                            ? "You haven't added any products yet"
                            : "No products found in this category"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">
                      {filteredProducts.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredProducts.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      aria-current="page"
                      className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      1
                    </button>
                    <button
                      disabled
                      className="bg-white border-gray-300 text-gray-300 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      2
                    </button>
                    <button
                      disabled
                      className="bg-white border-gray-300 text-gray-300 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      3
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
