import { Order } from "@/lib/generated/prisma";
import { formatPrice } from "@/utils";
import React from "react";
import { FiPackage, FiTruck } from "react-icons/fi";

const OrderCard = ({ order }: { order: Order }) => {
  const statusColors = {
    PENDING: "bg-amber-100 text-amber-800",
    SHIPPED: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">
            Order #{order.id.slice(-6).toUpperCase()}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[order.status as keyof typeof statusColors]
          }`}
        >
          {order.status}
        </span>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-medium">{formatPrice(order.totalAmount)}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <FiPackage className="mr-1" />
        <span>{order.orderItems.length} items</span>
        {order.trackingNumber && (
          <>
            <span className="mx-2">•</span>
            <FiTruck className="mr-1" />
            <span>Track #{order.trackingNumber}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
