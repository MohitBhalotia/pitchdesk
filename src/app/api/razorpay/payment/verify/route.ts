import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { orderModel } from "@/models/OrderModel"
import { userPlanModel } from "@/models/UserPlanModel";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest){
  await dbConnect()
  try{
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
    const order = await orderModel.findOne({
      razorpayOrderId: razorpay_order_id
    })

    if(!order) return NextResponse.json({
      error: "Order not found"
    }, {status: 404})

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    order.status = "paid";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await userPlanModel.create({
      userId: order.userId,
      planId: order.planId,
      isActive: true,
      usage: { pitchNumberUsed: 0, pitchTimeUsed: 0 },
    });

    return NextResponse.json({ success: true });

  }catch(error: any){
    return NextResponse.json({ error: error.message }, { status: 500 });
  } 
}