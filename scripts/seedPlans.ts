import mongoose from "mongoose";
import { planModel } from "@/models/PlanModel";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });



async function seedPlans() {
  await mongoose.connect(process.env.MONGO_URI as string);

  const plans = [
    {
      name: "standard",
      amount: 699,
      pitchesNumber: 3,
      pitchesTime: 20,
      englishVCs: 1,
      hindiVCs: 1,
      capatalistConnecction: false,
      priorityEmailSupport: true,
      pitchAnalysis: true,
      pitchImprovement: true,
      personalisedPitch: true,
    },
    {
      name: "pro",
      amount: 1999,
      pitchesNumber: 10,
      pitchesTime: 20,
      englishVCs: 6,
      hindiVCs: 6,
      capatalistConnecction: false,
      priorityEmailSupport: true,
      pitchAnalysis: true,
      pitchImprovement: true,
      personalisedPitch: false,
    },
    {
      name: "enterprise",
      amount: 4999,
      pitchesNumber: 25,
      pitchesTime: 20,
      englishVCs: 6,
      hindiVCs: 6,
      capatalistConnecction: true,
      priorityEmailSupport: true,
      pitchAnalysis: true,
      pitchImprovement: true,
      personalisedPitch: true,
    },
  ];

  for (const plan of plans) {
    await planModel.updateOne({ name: plan.name }, plan, { upsert: true });
  }

  console.log("✅ Plans seeded successfully");
  await mongoose.disconnect();
}

seedPlans().catch(console.error);
