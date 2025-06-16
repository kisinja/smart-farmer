/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiLoader,
  FiCheckCircle,
  FiShoppingBag,
  FiMapPin,
  FiUser,
  FiCreditCard,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "react-hot-toast";
import PaystackPayment from "@/components/PaystackPayment";
import Image from "next/image";

const CheckoutPage = () => {
  const router = useRouter();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const { state } = useCart();
  const cartItems = state.items || [];

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "Kenya",
    email: "",
    phone: "",
    paymentMethod: "paystack",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: `${user.given_name || ""} ${user.family_name || ""}`,
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async (paystackReference: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: user?.id,
          orderItems: cartItems,
          shippingInfo: form,
          totalAmount: totalAmount + 200,
          paymentMethod: form.paymentMethod,
          paystackReference,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Order created successfully");
        setIsSuccess(true);
        router.push(
          `/order-success?ids=${result.orders.map((o: any) => o.id).join(",")}`
        );
      } else {
        throw new Error(result.error || "Order failed");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
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
            Your order has been received and is being processed.
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
          {/* Checkout Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Personal Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiUser className="text-indigo-600" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="07XX XXX XXX"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiMapPin className="text-indigo-600" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Country"
                      required
                      className="border border-gray-300 rounded-lg px-4 py-3"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-indigo-600" />
                  Payment Method
                </h2>
                <PaystackPayment
                  email={form.email}
                  amount={totalAmount + 200}
                  onSuccess={(reference) => placeOrder(reference)}
                />
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
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={64}
                    height={64}
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