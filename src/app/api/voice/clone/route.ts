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

        console.log('🎤 Cloning voice:', voiceName);
        console.log('📦 Audio blob size:', audioBlob.size, 'bytes');

        // Convert Blob to Buffer for Cartesia API
        const arrayBuffer = await audioBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create FormData for Cartesia API (matching official docs)
        const cartesiaFormData = new FormData();
        cartesiaFormData.append('clip', new Blob([buffer], { type: 'audio/webm' }), 'voice-clip.webm');
        cartesiaFormData.append('name', voiceName || `VC Voice ${Date.now()}`);
        cartesiaFormData.append('description', voiceDescription || 'AI VC Judge Voice');
        cartesiaFormData.append('language', 'en'); // English language
        // Note: base_voice_id is optional, not including it

        console.log('📡 Calling Cartesia API...');

        // Call Cartesia API - Matching official documentation exactly
        const cartesiaResponse = await axios.post(
            'https://api.cartesia.ai/voices/clone',
            cartesiaFormData,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Cartesia-Version': '2024-06-10',
                    // Content-Type is automatically set by axios for FormData
                },
                timeout: 30000, // 30 second timeout
            }
        );

        const voiceData = cartesiaResponse.data;
        console.log('✅ Voice cloned successfully:', voiceData.id);

        // Return response matching Cartesia API format
        return NextResponse.json({
            voiceId: voiceData.id,
            userId: voiceData.user_id,
            isPublic: voiceData.is_public,
            name: voiceData.name,
            description: voiceData.description,
            createdAt: voiceData.created_at,
            language: voiceData.language,
            success: true
        });
    } catch (error: any) {
        console.error('❌ Cartesia API error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            headers: error.config?.headers,
        });

        const errorDetails = error.response?.data || error.message || 'Unknown error';
        const status = error.response?.status || 500;

        // Provide more helpful error messages
        let userMessage = "Voice cloning failed";
        if (status === 404) {
            userMessage = "Cartesia API endpoint not found. Please verify your API configuration.";
        } else if (status === 401 || status === 403) {
            userMessage = "Invalid Cartesia API key. Please check your credentials.";
        } else if (status === 429) {
            userMessage = "Rate limit exceeded. Please try again later.";
        } else if (status === 400) {
            userMessage = "Invalid audio format or parameters. Please try recording again.";
        }

        return NextResponse.json(
            {
                error: userMessage,
                details: typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails)
            },
            { status }
        );
    }
}
