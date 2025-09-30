import {  NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import PitchModel from "@/models/PitchModel"
import pitchSchema from "@/schemas/pitchSchema"

export async function POST(req: Request){
    await dbConnect()
    try{
        const body = await req.json()
        const validatedData = pitchSchema.parse(body)
        const pitch = await PitchModel.findById(validatedData.sessionId)
        if(!pitch) return NextResponse.json({
            success: false,
            message: "Pitch not found"
        }, {status: 404})
        pitch.endTime = new Date()
        pitch.conversationHistory = validatedData.conversationHistory
        .filter((message) => message.type === "ConversationText")
        .map((message) => ({
          role: message.role,
          content: message.content,
          timestamp: message.timeStamp,
        }));
      
        pitch.duration = (pitch.endTime.getTime() - pitch.startTime.getTime())/1000
        await pitch.save()
        // TODO: Deduct agent minutes from user
        return NextResponse.json({
            success: true,
            message: "pitch session stored successfully"
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any){
        console.error("Error ending pitch", error)
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