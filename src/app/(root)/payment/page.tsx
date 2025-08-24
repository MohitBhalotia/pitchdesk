"use client";
import { useState, useEffect } from "react";
import Razorpay from "razorpay";

export default function Checkout({ planId }: { planId: string }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      body: JSON.stringify({ planId: "", userId: "" }),
    });
    const data = await res.json();



    if (!data.key) return alert("Error creating order");

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "PitchDesk",
      description: "Plan Subscription",
      handler: async function (response: any){
        const res = await fetch("/api/razorpay/payment/verify", {
          method: "POST",
          body: JSON.stringify(response),
        });

        const resData = res.json()

        console.log(resData)
        alert("Payment successful!");
      },
      prefill: {
        name: "Your User",
        email: "user@example.com",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
}
