import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Receive FormData (file) from frontend
        const formData = await req.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return NextResponse.json({ error: "Image file required" }, { status: 400 });
        }

        // Create a new FormData to send to FastAPI
        const fastApiFormData = new FormData();
        fastApiFormData.append('image', imageFile, 'input-image.jpg');

        // Call FastAPI Gemini endpoint using Axios
        const fastApiUrl = process.env.FASTAPI_BASE_URL || 'http://localhost:8000';

        const response = await axios.post(`${fastApiUrl}/generate-avatars`, fastApiFormData, {
            // Axios should automatically handle Content-Type for FormData
        });

        const data = response.data;

        // Explicitly check for successful response format
        if (!data.avatars || !Array.isArray(data.avatars)) {
            console.error("Invalid response from FastAPI:", data);
            return NextResponse.json({ error: "Invalid response format from AI service" }, { status: 502 });
        }

        return NextResponse.json({
            avatars: data.avatars, // Array of base64 strings
            success: true
        });

    } catch (error: any) {
        const errorDetails = error.response ? error.response.data : (error.message || 'Unknown error');
        console.error("Avatar generation error:", typeof errorDetails === 'object' ? JSON.stringify(errorDetails) : errorDetails);

        const status = error.response ? error.response.status : 500;

        return NextResponse.json(
            { error: "Internal server error", details: errorDetails },
            { status }
        );
    }
}
