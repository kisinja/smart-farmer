import {
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const statusConfig = {
    PENDING: {
      icon: <FiClock className="mr-1.5" />,
      text: "Pending",
      bg: "bg-yellow-50",
      textColor: "text-yellow-800",
      border: "border-yellow-100",
    },
    PROCESSING: {
      icon: <FiAlertCircle className="mr-1.5" />,
      text: "Processing",
      bg: "bg-blue-50",
      textColor: "text-blue-800",
      border: "border-blue-100",
    },
    SHIPPED: {
      icon: <FiTruck className="mr-1.5" />,
      text: "Shipped",
      bg: "bg-indigo-50",
      textColor: "text-indigo-800",
      border: "border-indigo-100",
    },
    DELIVERED: {
      icon: <FiCheckCircle className="mr-1.5" />,
      text: "Delivered",
      bg: "bg-green-50",
      textColor: "text-green-800",
      border: "border-green-100",
    },
    CANCELLED: {
      icon: <FiXCircle className="mr-1.5" />,
      text: "Cancelled",
      bg: "bg-red-50",
      textColor: "text-red-800",
      border: "border-red-100",
    },
    REFUNDED: {
      icon: <FiXCircle className="mr-1.5" />,
      text: "Refunded",
      bg: "bg-purple-50",
      textColor: "text-purple-800",
      border: "border-purple-100",
    },
  };

  const currentStatus =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${currentStatus.bg} ${currentStatus.textColor} ${currentStatus.border} border ${className}`}
    >
      {currentStatus.icon}
      {currentStatus.text}
    </span>
  );
};

export default StatusBadge;
