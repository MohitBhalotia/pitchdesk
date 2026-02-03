import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
    try {
        // Temporary: No auth required for testing
        const apiKey = process.env.CARTESIA_API_KEY;
        if (!apiKey) {
            console.error("CARTESIA_API_KEY is missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Call Cartesia API to list available voices
        const cartesiaResponse = await axios.get(
            'https://api.cartesia.ai/voices',
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Cartesia-Version': '2024-06-10',
                },
                params: {
                    limit: 100, // Get more voices
                    is_public: true, // Include public/default voices
                }
            }
        );

        return NextResponse.json({
            voices: cartesiaResponse.data || [],
            success: true
        });

    } catch (error: unknown) {
        const err = error as { response?: { data: unknown; status: number }; message?: string };
        const errorDetails = err.response ? err.response.data : (err.message || 'Unknown error');
        console.error('List voices error:', typeof errorDetails === 'object' ? JSON.stringify(errorDetails) : errorDetails);

        const status = err.response ? err.response.status : 500;

        return NextResponse.json(
            { error: "Failed to list voices", details: errorDetails },
            { status }
        );
    }
}