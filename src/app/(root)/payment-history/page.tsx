"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, XCircle, CheckCircle } from "lucide-react";

interface Payment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  plan: {
    name: string;
    amount: number;
  } | null;
  razorpayOrderId?: string;
  razorPaymentId?: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const res = await fetch("/api/payment-history");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load history");
        setPayments(data.payments);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment History</h1>
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-destructive">{error}</div>
      ) : payments.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          No payment history found.
        </div>
      ) : (
        <div className="space-y-6">
          {payments.map((payment) => (
            <Card key={payment.id} className="shadow-md ">
              <CardHeader className="flex flex-row items-center justify-between gap-4 py-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {payment.plan?.name?.charAt(0).toUpperCase() + payment.plan?.name?.slice(1) || "Unknown Plan"}
                    <Badge
                      variant={payment.status === "paid" ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {payment.status === "paid" ? (
                        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span>
                      ) : (
                        <span className="flex items-center gap-1"><XCircle className="w-4 h-4" /> Failed</span>
                      )}
                    </Badge>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Order ID: <span className="font-mono">{payment.razorpayOrderId || payment.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ₹{payment.amount}
                    <span className="text-base font-normal text-muted-foreground ml-1">{payment.currency}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(payment.createdAt).toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                {payment.razorPaymentId && (
                  <div className="text-xs text-muted-foreground">
                    Payment ID: <span className="font-mono">{payment.razorPaymentId}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}