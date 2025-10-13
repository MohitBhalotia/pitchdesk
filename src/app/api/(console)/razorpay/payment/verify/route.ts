import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { orderModel } from "@/models/OrderModel"
import dbConnect from "@/lib/db";
import { activateUserPlan } from "@/lib/razorpayUtils";

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

    console.log("verify active")

    await activateUserPlan(razorpay_order_id, razorpay_payment_id)

    return NextResponse.json({ success: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(error: any){
    return NextResponse.json({ error: error.message }, { status: 500 });
  } 
}