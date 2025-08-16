import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import PitchModel from "@/models/PitchModel"
import pitchSchema from "@/schemas/pitchSchema"

export async function POST(req: Request){
    await dbConnect()
    try{
        const body = await req.json()
    }catch(error){

    }
}