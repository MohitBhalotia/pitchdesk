import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import dbConnect from "@/lib/db";
import { activateUserPlan } from "@/lib/razorpayUtils";

export async function POST(req: NextRequest){
    await dbConnect()

    const secret = process.env.RAZOR_PAY_SECRET
    const payload = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
    return NextResponse.json({ error: "Signature missing" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(payload);

  if (event.event === "payment.captured") {
    const { order_id, id: payment_id } = event.payload.payment.entity;

    console.log("webhook active")

    try {
      await activateUserPlan(order_id, payment_id);

    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}