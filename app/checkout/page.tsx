"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiLoader,
  FiCheckCircle,
  FiShoppingBag,
  FiMapPin,
  FiUser,
  FiMail,
  FiCreditCard,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const CheckoutPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    email: "",
    phone: "",
    paymentMethod: "mpesa", // Default to M-Pesa for Kenya
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {getUser} = useKindeBrowserClient();
  const user = getUser();

  // Mock cart data - replace with your actual cart context/state
  const {state} = useCart();
  const cartItems = state.items || [];

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare order data matching your Prisma model
      const orderData = {
        buyerId: user?.id, // Replace with actual user ID from auth
        orderItems: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingInfo: form,
        totalAmount,
        paymentMethod: form.paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Order creation failed");

      // Show success state briefly before redirect
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/order-success?id=${data.orderId}`);
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Your order has been received and is being processed. You'll receive
            a confirmation shortly.
          </p>
          <div className="animate-spin">
            <FiLoader className="w-8 h-8 text-indigo-600 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-indigo-900">
            Complete Your Purchase
          </h1>
          <p className="text-lg text-indigo-600 mt-2">
            Review your items and enter shipping details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping & Payment Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiUser className="text-indigo-600" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="07XX XXX XXX"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiMapPin className="text-indigo-600" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="123 Main Street"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Nairobi"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        placeholder="Kenya"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-indigo-600" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={form.paymentMethod === "mpesa"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="block font-medium">M-Pesa</span>
                      <span className="block text-sm text-gray-500">
                        Pay via M-Pesa mobile money
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === "card"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="block font-medium">
                        Credit/Debit Card
                      </span>
                      <span className="block text-sm text-gray-500">
                        Pay with Visa or Mastercard
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={form.paymentMethod === "cash"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="block font-medium">
                        Cash on Delivery
                      </span>
                      <span className="block text-sm text-gray-500">
                        Pay when you receive your order
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiShoppingBag className="text-indigo-600" />
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold">
                    KES {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">KES {totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">KES 200</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-indigo-600">KES {totalAmount + 200}</span>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin" />
                  Processing Order...
                </span>
              ) : (
                "Complete Purchase"
              )}
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              By placing your order, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;