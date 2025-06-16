/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

type PaystackPaymentProps = {
  email: string;
  amount: number;
  onSuccess: (reference: string) => void;
};

const PaystackPayment = ({
  email,
  amount,
  onSuccess,
}: PaystackPaymentProps) => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    toast.error("Paystack public key is not set.");
    return (
      <div className="text-red-600 text-sm mt-2">
        Paystack public key missing. Set{" "}
        <code>NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY</code> in your .env
      </div>
    );
  }

  const paystackConfig = {
    email,
    amount: amount * 100, // Paystack expects amount in kobo (or cents)
    publicKey,
    currency: "KES",
    metadata: {
      custom_fields: [
        {
          display_name: "Email",
          variable_name: "email",
          value: email,
        },
        {
          display_name: "Amount",
          variable_name: "amount",
          value: amount,
        },
      ],
    },
    onSuccess: (reference: any) => {
      console.log("Payment success reference:", reference);
      toast.success("Payment successful!");
      onSuccess(reference.reference); // Pass only the reference string
    },
    onClose: () => {
      toast.error("Payment was cancelled.");
    },
  };

  return (
    <div className="mt-4">
      <PaystackButton
        {...paystackConfig}
        text="Pay Now"
        className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors w-full"
      />
    </div>
  );
};

export default PaystackPayment;