"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const idsParam = searchParams.get("ids");
    if (idsParam) {
      const idsArray = idsParam.split(",");
      setOrderIds(idsArray);
    }
    setIsVisible(true);
  }, [searchParams]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header with confetti effect */}
        <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                initial={{ opacity: 0, y: -100 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, 200],
                  x: Math.random() * 400 - 200,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
              />
            ))}
          </div>
          
          <motion.div variants={itemVariants}>
            <CheckCircle className="mx-auto h-16 w-16 text-white" />
            <h1 className="mt-4 text-4xl font-bold text-white">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-lg text-green-100">
              Your purchase was successful
            </p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-8">
          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-lg text-gray-700">
              Thank you for your order! We&apos;ve received your payment and are preparing your items.
            </p>
            <p className="mt-2 text-gray-600">
              You&apos;ll receive a confirmation email shortly with all the details.
            </p>
          </motion.div>

          {orderIds.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center mb-4">
                <ShoppingBag className="h-6 w-6 text-emerald-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Order Details
                </h2>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {orderIds.map((id) => (
                    <div key={id} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium text-gray-700">Order ID:</span>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-emerald-600">
                        {id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
          >
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </button>
            <button
              onClick={() => (window.location.href = "/orders")}
              className="px-6 py-3 bg-white border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="h-5 w-5" />
              View My Orders
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Need help? Contact our support team at support@example.com
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;