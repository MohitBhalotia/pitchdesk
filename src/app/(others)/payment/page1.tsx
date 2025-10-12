"use client";
import { useState, useEffect } from "react";
// import Razorpay from "razorpay";

export default function Checkout() {
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
      body: JSON.stringify({ planId: "68aa8cbf5958f9468e59ca14", userId: "6886923965ec64a7db9f69a9" }),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
