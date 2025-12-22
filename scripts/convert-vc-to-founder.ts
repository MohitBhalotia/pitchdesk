import "dotenv/config";
import dbConnect from "../src/lib/db";
import UserModel from "../src/models/UserModel";
import { userPlanModel } from "../src/models/UserPlanModel";
import { planModel } from "../src/models/PlanModel";
import { createFreeUserPlan } from "../src/lib/razorpayUtils";

/**
 * One-time migration script to convert all VC users to Founder users
 * 
 * This script will:
 * 1. Find all users with role "vc"
 * 2. Update their role to "founder"
 * 3. Set isVerified to true
 * 4. Create UserPlan document if it doesn't exist
 */

async function convertVCToFounder() {
  try {
    console.log("🚀 Starting VC to Founder conversion...");
    
    // Connect to database
    await dbConnect();
    console.log("✅ Database connected");

    // Find all VC users
    const vcUsers = await UserModel.find({ role: "vc" });
    console.log(`📊 Found ${vcUsers.length} VC users to convert`);

    if (vcUsers.length === 0) {
      console.log("ℹ️  No VC users found. Nothing to convert.");
      process.exit(0);
    }

    // Verify free plan exists (createFreeUserPlan will also check, but we verify upfront)
    const freePlan = await planModel.findOne({ name: "free" });
    if (!freePlan) {
      throw new Error("Free plan not found in database. Please ensure plans are seeded.");
    }
    console.log("✅ Free plan found in database");

    let convertedCount = 0;
    let planCreatedCount = 0;
    let planExistsCount = 0;
    let errors: Array<{ email: string; error: string }> = [];

    // Process each VC user
    for (const user of vcUsers) {
      try {
        console.log(`\n🔄 Processing user: ${user.email} (${user._id})`);

        // Check if UserPlan already exists
        const existingPlan = await userPlanModel.findOne({
          userId: user._id
        });

        if (existingPlan) {
          console.log(`   ⚠️  UserPlan already exists for this user, skipping plan creation`);
          planExistsCount++;
        } else {
          // Create UserPlan document using the utility function for consistency
          await createFreeUserPlan(user._id.toString());
          console.log(`   ✅ Created UserPlan document using createFreeUserPlan utility`);
          planCreatedCount++;
        }

        // Update user role and verification status
        await UserModel.findByIdAndUpdate(user._id, {
          role: "founder",
          isVerified: true
        });
        console.log(`   ✅ Updated role to "founder" and set isVerified to true`);
        convertedCount++;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Error processing user ${user.email}:`, errorMessage);
        errors.push({ email: user.email, error: errorMessage });
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📈 CONVERSION SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Successfully converted: ${convertedCount} users`);
    console.log(`📦 UserPlans created: ${planCreatedCount}`);
    console.log(`ℹ️  UserPlans already existed: ${planExistsCount}`);
    console.log(`❌ Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log("\n⚠️  ERRORS:");
      errors.forEach(({ email, error }) => {
        console.log(`   - ${email}: ${error}`);
      });
    }

    console.log("\n✅ Migration completed!");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Fatal error during migration:", error);
    process.exit(1);
  }
}

// Run the migration
convertVCToFounder();

