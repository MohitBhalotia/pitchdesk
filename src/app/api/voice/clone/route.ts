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

        // Check for API Key immediately
        const apiKey = process.env.CARTESIA_API_KEY;
        if (!apiKey) {
            console.error("CARTESIA_API_KEY is missing in environment variables");
            return NextResponse.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
        }

        const formData = await req.formData();
        const audioBlob = formData.get('audio') as Blob;
        const voiceName = formData.get('name') as string;
        const voiceDescription = formData.get('description') as string;

        if (!audioBlob) {
            return NextResponse.json({ error: "Audio file required" }, { status: 400 });
        }

        // Create FormData for Cartesia API
        const cartesiaFormData = new FormData();
        cartesiaFormData.append('clip', audioBlob, 'voice-clip.webm');
        cartesiaFormData.append('name', voiceName || `VC Voice ${Date.now()}`);
        if (voiceDescription) {
            cartesiaFormData.append('description', voiceDescription);
        }
        cartesiaFormData.append('enhance', 'true'); // Enable voice enhancement

        // Call Cartesia API using Axios
        const cartesiaResponse = await axios.post('https://api.cartesia.ai/v1/voices/clone', cartesiaFormData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Cartesia-Version': '2024-06-10',
                // Axios + FormData in Node environment usually handles boundaries automatically
            },
        });

        const voiceData = cartesiaResponse.data;

        return NextResponse.json({
            voiceId: voiceData.id,
            name: voiceData.name,
            description: voiceData.description,
            language: voiceData.language,
            success: true
        });
    } catch (error: any) {
        const errorDetails = error.response ? error.response.data : (error.message || 'Unknown error');
        console.error('Cartesia API error:', errorDetails);

        const status = error.response ? error.response.status : 500;

        return NextResponse.json(
            { error: "Voice cloning failed", details: errorDetails },
            { status }
        );
    }
}
