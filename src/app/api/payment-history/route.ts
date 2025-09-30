import dbConnect from "@/lib/db";
import {orderModel}  from "@/models/OrderModel";
import "@/models/PlanModel";
import { getServerSession } from "next-auth";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";

export  async function GET(req:Request) {
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const orders = await orderModel.find({
      userId: user._id,
      status: { $in: ["paid", "failed"] },
    })
      .populate("planId")
      .sort({ createdAt: -1 });
    const result = orders.map((order) => ({
      id: order._id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      createdAt: order.createdAt,
      plan: order.planId ? {
        name: order.planId.name,
        amount: order.planId.amount,
      } : null,
      razorpayOrderId: order.razorpayOrderId,
      razorPaymentId: order.razorPaymentId,
      razorpaySignature: order.razorpaySignature,
    }));
    return NextResponse.json({ payments: result }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
  }
}
