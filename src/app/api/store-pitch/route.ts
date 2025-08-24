import {  NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import PitchModel from "@/models/PitchModel"
import pitchSchema from "@/schemas/pitchSchema"

export async function POST(req: Request){
    await dbConnect()
    try{
        const body = await req.json()
        const validatedData = pitchSchema.parse(body)

        await PitchModel.create({
            userId: validatedData.userId,
            recordingUrl: validatedData.recordingUrl,
            conversationHistory: validatedData.conversationHistory
        })
        
        return NextResponse.json({
            success: true,
            message: "pitch session stored successfully"
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any){
        if(error.errors){
            return NextResponse.json({
                error: error.errors

            }, {
                status: 400
            })
        }
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500})
    }
}