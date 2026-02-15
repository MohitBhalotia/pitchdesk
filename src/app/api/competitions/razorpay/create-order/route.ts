import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { CompetitionPayment } from "@/models/CompetitionPaymentModel";
import Competition from "@/models/Competition";
import Participant from "@/models/Participant";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { userId, competitionId, type, registrationData, participantId } =
      await req.json();

    const comp = await Competition.findById(competitionId);
    if (!comp) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    if (!comp.paymentConfig?.isPaid) {
      return NextResponse.json(
        { error: "This competition does not require payment" },
        { status: 400 }
      );
    }

    let amount: number;

    if (type === "registration") {
      amount = comp.paymentConfig.registrationFee ?? 0;

      // Check user not already registered
      const existing = await Participant.findOne({
        competitionId,
        $or: [
          { userId },
          { "teamMembers.userId": userId, "teamMembers.status": "accepted" },
        ],
      });
      if (existing) {
        return NextResponse.json(
          { error: "Already registered for this competition" },
          { status: 400 }
        );
      }
    } else if (type === "chance_fee") {
      amount = comp.paymentConfig.chanceFee ?? 0;
      console.log(amount);
      
      if (!participantId) {
        return NextResponse.json(
          { error: "participantId is required for chance_fee" },
          { status: 400 }
        );
      }
      const participant = await Participant.findById(participantId);
      if (!participant) {
        return NextResponse.json(
          { error: "Participant not found" },
          { status: 404 }
        );
      }
      if (!participant.pitchSubmitted) {
        return NextResponse.json(
          { error: "Pitch has not been submitted yet" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Invalid payment type" },
        { status: 400 }
      );
    }

    // Razorpay requires minimum 1 INR (100 paise)

    const options = {
      amount:type==="registration"?amount*100*89:amount*100*98, // Convert to cents
      currency: "INR",
      receipt: `comp_${type}_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    await CompetitionPayment.create({
      userId,
      competitionId,
      type,
      razorpayOrderId: razorpayOrder.id,
      amount,
      status: "created",
      ...(type === "registration" && registrationData
        ? { pendingRegistrationData: registrationData }
        : {}),
      ...(type === "chance_fee" && participantId ? { participantId } : {}),
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZOR_KEY_ID,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Competition create-order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
