"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  FiCheckCircle,
  FiHome,
  FiPackage,
  FiTruck,
  FiClock,
  FiCheck,
  FiX,
  FiTruck as FiShipped,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
        icon: <FiClock className="w-4 h-4 text-amber-500" />,
      };
    case "SHIPPED":
      return {
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: <FiShipped className="w-4 h-4 text-blue-500" />,
      };
    case "DELIVERED":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-200",
        icon: <FiCheck className="w-4 h-4 text-emerald-500" />,
      };
    case "CANCELLED":
      return {
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-200",
        icon: <FiX className="w-4 h-4 text-red-500" />,
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-800",
        border: "border-gray-200",
        icon: <FiClock className="w-4 h-4 text-gray-500" />,
      };
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = getStatusColor(status);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}
    >
      {statusColors.icon}
      <span className="capitalize">{status.toLowerCase()}</span>
    </div>
  );
};

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();

  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch order details");
        }

        setOrderDetails(data.order);
        setShowConfetti(true);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };

    fetchOrderDetails();

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [orderId, router]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-700">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4 relative overflow-hidden">
      {showConfetti && width && height && (
        <Confetti
          width={width}
          height={height}
          colors={["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"]}
          recycle={false}
          numberOfPieces={300}
        />
      )}

      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-indigo-100 opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-purple-100 opacity-20 blur-xl"></div>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative z-10 border border-indigo-50">
        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
          <FiCheckCircle className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-indigo-900 mb-2 text-center">
          Order Confirmed!
        </h1>

        <div className="flex justify-center mb-4">
          <StatusBadge status={orderDetails.status} />
        </div>

        <p className="text-indigo-700 mb-6 text-center">
          Thank you for your purchase! We've sent a confirmation to your email.
        </p>

        <div className="bg-indigo-50 rounded-xl p-4 mb-6 border border-indigo-100 flex flex-col items-center">
          <p className="text-sm text-indigo-800 font-medium">
            Order Number: <span className="font-bold">{orderId}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow hover:shadow-md"
          >
            <FiHome className="w-5 h-5" />
            Go to Home
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 flex items-center justify-center gap-2 text-indigo-600 border-2 border-indigo-600 py-3 px-6 rounded-lg hover:bg-indigo-50 transition-all"
          >
            <FiPackage className="w-5 h-5" />
            {showDetails ? "Hide" : "View"} Details
          </button>
        </div>

        {showDetails && (
          <div className="mt-6 space-y-6 border-t border-indigo-100 pt-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <FiPackage className="text-indigo-600" />
                Order Items
              </h3>
              <ul className="space-y-2">
                {orderDetails.orderItems?.map((item: any, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between text-indigo-800"
                  >
                    <span>
                      {item.quantity}x {item.product?.title || "Product"}
                    </span>
                    <span>KES {(item.product?.price || 0).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <FiTruck className="text-indigo-600" />
                Shipping Information
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-indigo-800">
                <div>
                  <p className="text-indigo-600 font-medium">Name</p>
                  <p>{orderDetails.shippingInfo?.fullName}</p>
                </div>
                <div>
                  <p className="text-indigo-600 font-medium">Address</p>
                  <p>{orderDetails.shippingInfo?.address}</p>
                </div>
                <div>
                  <p className="text-indigo-600 font-medium">City</p>
                  <p>{orderDetails.shippingInfo?.city}</p>
                </div>
                <div>
                  <p className="text-indigo-600 font-medium">Country</p>
                  <p>{orderDetails.shippingInfo?.country}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-indigo-600 font-medium">
                    Estimated Delivery
                  </p>
                  <p>{orderDetails.shippingInfo?.estimatedDelivery || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-100">
              <div className="flex justify-between text-lg font-bold text-indigo-900">
                <span>Total Amount:</span>
                <span>KES {orderDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-indigo-400 mt-6 text-center">
          Need help? Contact our support team at support@example.com
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;