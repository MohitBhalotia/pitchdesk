import { verifySchema } from "@/schemas/verifySchema"
import { NextResponse } from "next/server"
import { z } from "zod"
import UserModel from "@/models/UserModel";


export async function POST(req: Request) {
    const body = await req.json();
    try {
        const { code, id } = verifySchema.parse(body)
        const user = await UserModel.findById(id)
        if(!user){
            return NextResponse.json({
                success: false,
                message: "This email is not registered",
                
            }, {status: 400})
        }

        if(user?.verificationCode === code) {
            await UserModel.findByIdAndUpdate(
                id,
                {
                    $set: {
                        verificationCode: null,
                        verificationExpiry: null,
                        isVerified: true
                    }
                }
            )
        }

        return NextResponse.json({
            success: true,
            message: "User verified succesfully"
        }, {status: 200})
    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json({
                success: false,
                message: error.issues.map((e) => e.message).join(",")
            })
        }

        return NextResponse.json({
            success:false,
            message: "Internal Server Error"
        }, {status: 500})
    }
}