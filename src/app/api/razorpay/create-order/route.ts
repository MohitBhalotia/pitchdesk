import { NextRequest, NextResponse } from "next/server"
import { razorpay } from "@/lib/razorpay"
import { orderModel } from "@/models/OrderModel"
import { planModel } from "@/models/PlanModel"
import dbConnect from "@/lib/db"

export async function POST(req: NextRequest) {
  await dbConnect()
  try{
    const { planId, userId } = await req.json()

    const plan = await planModel.findById(planId)
    
    if(!plan){
      return NextResponse.json({
        success:false,
        message: "plan does not exist"
      }, {status: 400})
    }

    const options = {
      amount: plan.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    }

    const razorpayOrder = await razorpay.orders.create(options)

    await orderModel.create({
      userId,
      planId,
      amount: plan.amount,
      razorpayOrderId: razorpayOrder.id,
      status: "created"
    })

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZOR_KEY_ID
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(error: any){
    console.log(error);
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}