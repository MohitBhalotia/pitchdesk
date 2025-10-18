import { orderModel } from "@/models/OrderModel";
import UserModel from "@/models/UserModel";
import { userPlanModel } from "@/models/UserPlanModel";
import { planModel } from "@/models/PlanModel";


//creating free user plans
export const createFreeUserPlan = async (userId: string) => {
    const freePlan = await planModel.findOne({ name: "free" });

        await userPlanModel.create({
            userId: userId,
            planId: freePlan._id,
            isActive: true,
            usage: {
                pitchNumberUsed: 0,
                pitchTimeRemaining: freePlan.pitchesTime
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

        const freePlan = await planModel.findOne({name: "free"})

        const existingPlan = await userPlanModel.findOne({
            userId: order.userId
        })

        console.log(existingPlan)

        const plan = await planModel.findById(order.planId);
        console.log(plan)

        if(existingPlan?.planId === freePlan._id){
            console.log(existingPlan?.planId)
            await userPlanModel.deleteOne({
                userId: existingPlan.userId
            })
            await userPlanModel.create({
                userId: order.userId,
                planId: order.planId,
                isActive: true,
                usage: {
                    pitchNumberUsed: 0,
                    pitchTimeRemaining: 20 + plan.pitchesTime
                }
            });
        }else if(existingPlan){
            existingPlan.planId = plan._id
            existingPlan.usage.pitchTimeRemaining += plan.pitchesTime
            console.log(existingPlan)
            existingPlan.save()
        }

        const user = await UserModel.findById(order.userId);
        user.userPlan = plan.name;
        await user.save();

        return plan.name;
    } catch (error) {
        console.log(error)
    }
}