
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: pitchId } = params;

        const pitch = await PitchModel.findById(pitchId);
        if (!pitch) {
            return NextResponse.json({ error: "Pitch not found" }, { status: 404 });
        }

        // Check if overview already exists
        if (pitch.overview) {
            return NextResponse.json({ overview: pitch.overview });
        }

        // Ensure conversationHistory exists and has content
        if (!pitch.conversationHistory || pitch.conversationHistory.length === 0) {
            return NextResponse.json({ error: "No transcript available for this pitch" }, { status: 400 });
        }

        // Call FastAPI
        const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_BACKEND || 'http://localhost:8000';

        // We need to pass the transcript exactly as PitchRequest expects: { transcript: [...] }
        try {
            const response = await axios.post(`${fastApiUrl}/generate-overview`, {
                transcript: pitch.conversationHistory
            });

            const overview = response.data.overview;

            // Save to DB
            pitch.overview = overview;
            await pitch.save();

            return NextResponse.json({ overview });
        } catch (apiError) {
            console.error("FastAPI Error:", apiError);
            return NextResponse.json({ error: "Failed to generate overview from AI engine" }, { status: 500 });
        }

    } catch (error) {
        console.error("Error generating pitch overview:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
