import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { CompetitionPayment } from "@/models/CompetitionPaymentModel";
import Competition from "@/models/Competition";
import Participant from "@/models/Participant";
import { sendInviteEmailEvent } from "@/lib/inngest/email-helpers";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const payment = await CompetitionPayment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // HMAC-SHA256 signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Idempotent: if already paid, return success
    if (payment.status === "paid") {
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    // Mark payment as paid
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;

    if (payment.type === "registration") {
      const result = await fulfillRegistration(payment);
      await payment.save();
      return NextResponse.json({ success: true, participant: result });
    } else if (payment.type === "chance_fee") {
      await fulfillChanceFee(payment);
      await payment.save();
      return NextResponse.json({ success: true, chanceRestored: true });
    }

    await payment.save();
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Competition verify error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function fulfillRegistration(
  payment: InstanceType<typeof CompetitionPayment>
) {
  const regData = payment.pendingRegistrationData as Record<string, unknown>;
  if (!regData) {
    throw new Error("No pending registration data found");
  }

  const comp = await Competition.findById(payment.competitionId);
  if (!comp) throw new Error("Competition not found");

  const minSize = comp.teamSize?.min || 1;

  // Generate invite tokens for team members
  const inviteBaseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite-competition?token=`;
  const teamMembers = ((regData.teamMembers as Array<{ name: string; email: string }>) || []).map(
    (member) => {
      const inviteToken = crypto.randomBytes(28).toString("base64url");
      return {
        ...member,
        status: "pending" as const,
        inviteToken,
      };
    }
  );

  const participant = await Participant.create({
    competitionId: payment.competitionId,
    userId: payment.userId,
    teamName: regData.teamName,
    teamLeader: regData.teamLeader,
    teamMembers,
    pitchTime: regData.pitchTime || comp.pitchTime,
    teamStatus: minSize !== 1 ? "incomplete" : "validated",
  });

  // Send invite emails via Inngest
  await Promise.all(
    teamMembers.map(async (member) => {
      const inviteLink = `${inviteBaseUrl}${encodeURIComponent(member.inviteToken)}`;
      await sendInviteEmailEvent(
        member.name,
        member.email,
        regData.teamName as string,
        (regData.teamLeader as { name: string }).name,
        comp.title,
        inviteLink,
        (participant._id as mongoose.Types.ObjectId).toString()
      );
    })
  );

  // Update total registered count
  await Competition.findByIdAndUpdate(payment.competitionId, {
    $inc: { totalRegistered: 1 },
  });

  // Store participantId on payment, clear pending data
  payment.participantId = participant._id as mongoose.Types.ObjectId;
  payment.pendingRegistrationData = undefined;

  return participant;
}

export async function fulfillChanceFee(
  payment: InstanceType<typeof CompetitionPayment>
) {
  const participant = await Participant.findById(payment.participantId);
  if (!participant) throw new Error("Participant not found");

  const comp = await Competition.findById(payment.competitionId);
  if (!comp) throw new Error("Competition not found");

  // Reset pitch state (old evaluations are kept — leaderboard uses best score)
  participant.pitchSubmitted = false;
  participant.pitchEvaluated = false;
  participant.pitchTime = comp.pitchTime;
  await participant.save();
}
