import { orderModel } from "@/models/OrderModel";
import { userPlanModel } from "@/models/UserPlanModel";

export const activateUserPlan = async (orderId: string, paymentId: string) => {
    try{
        const order = await orderModel.findOne({ razorpayOrderId: orderId })

        if(order.status == 'paid') return order

        if(order.status == 'failed'){
            throw new Error("Cannot activate failed order")
        }


        order.status = 'paid'
        order.razorPaymentId = paymentId
        await order.save()

        // const existingPlan = await userPlanModel.find({userId: order.userId, planId: order.planId})
        // if(!existingPlan){
            await userPlanModel.create({
                userId: order.userId,
                planId: order.planId,
                isActive: true,
                usage: {
                    pitchNumberUsed: 0,
                    pitchTimeUsed: 0
                }
            })
        //}

        return order
    }catch(error){
        console.log(error)
    }
}