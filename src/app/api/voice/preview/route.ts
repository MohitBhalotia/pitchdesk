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

        const apiKey = process.env.CARTESIA_API_KEY;
        if (!apiKey) {
            console.error("CARTESIA_API_KEY is missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const body = await req.json();
        const { voiceId, text } = body;

        if (!voiceId || !text) {
            return NextResponse.json({ error: "Voice ID and text required" }, { status: 400 });
        }

        // Call Cartesia TTS API
        const cartesiaResponse = await axios.post(
            'https://api.cartesia.ai/tts/bytes',
            {
                model_id: "sonic-3",
                voice: {
                    mode: "id",
                    id: voiceId
                },
                transcript: text,
                output_format: {
                    container: "mp3",
                    encoding: "mp3",
                    sample_rate: 44100
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Cartesia-Version': '2024-06-10',
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer' // Important for binary audio data
            }
        );

        // Return the audio file
        return new NextResponse(cartesiaResponse.data, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="voice-preview.mp3"'
            }
        });

    } catch (error: unknown) {
        const err = error as { response?: { data: unknown; status: number }; message?: string };
        const errorDetails = err.response ? err.response.data : (err.message || 'Unknown error');
        console.error('Voice preview error:', typeof errorDetails === 'object' ? JSON.stringify(errorDetails) : errorDetails);

        const status = err.response ? err.response.status : 500;

        return NextResponse.json(
            { error: "Voice preview failed", details: errorDetails },
            { status }
        );
    }
}
