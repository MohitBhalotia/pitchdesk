import { orderModel } from "@/models/OrderModel";
import UserModel from "@/models/UserModel";
import { userPlanModel } from "@/models/UserPlanModel";
import { planModel } from "@/models/PlanModel";



// Utility function to create user plan for free users
export const createFreeUserPlan = async (userId: string) => {
    const freePlan = await planModel.findOne({ name: "free" });

    
    
        await userPlanModel.create({
            userId: userId,
            planId: freePlan._id,
            isActive: true,
            usage: {
                pitchNumberUsed: 0,
                pitchTimeUsed: 0
            }
        });
    

    return freePlan;
};

export const activateUserPlan = async (orderId: string, paymentId: string) => {
    try {
        const order = await orderModel.findOne({ razorpayOrderId: orderId })

        if (order.status == 'paid') return order

        if (order.status == 'failed') {
            throw new Error("Cannot activate failed order")
        }


        order.status = 'paid'
        order.razorPaymentId = paymentId
        await order.save()

        // Deactivate all existing active plans for this user
        await userPlanModel.updateMany(
            { userId: order.userId },
            { isActive: false }
        );

        // Create new active plan
        await userPlanModel.create({
            userId: order.userId,
            planId: order.planId,
            isActive: true,
            usage: {
                pitchNumberUsed: 0,
                pitchTimeUsed: 0
            }
        });

        const plan = await planModel.findById(order.planId);
        const user = await UserModel.findById(order.userId);
        user.userPlan = plan.name;
        await user.save();

        return plan.name;
    } catch (error) {
        console.log(error)
    }
}