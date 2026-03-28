import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            description,
            sector,
            fundSize,
            investmentStage,
            geographicFocus,
            userInstructions,
        } = body;

        // Call FastAPI to generate system prompt
        const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_BACKEND || 'http://localhost:8000';

        try {
            const response = await axios.post(`${fastApiUrl}/generate-bot-prompt`, {
                name,
                description,
                sector,
                fund_size: fundSize,
                investment_stage: investmentStage,
                geographic_focus: geographicFocus,
                user_instructions: userInstructions,
            });

            const data = response.data;

            if (data.success && data.system_prompt) {
                return NextResponse.json({
                    systemPrompt: data.system_prompt,
                    firstMessage: `Hello founder, I'm ${name}. Tell me about your startup.`,
                });
            } else {
                throw new Error("Invalid response from FastAPI");
            }
        } catch (fastApiError: unknown) {
            const err = fastApiError as { message?: string };
            console.error("FastAPI call failed, using fallback:", err.message);

            // Fallback template if FastAPI is not available
            const sectorStr = Array.isArray(sector) ? sector.join(' and ') : (sector || 'various sectors');
            const stageStr = Array.isArray(investmentStage) ? investmentStage.join('/') : (investmentStage || 'Seed to Series A');
            const fallbackPrompt = `${name} is a sharp, focused ${stageStr} stage investor with deep expertise in ${sectorStr}. ${description || ''} ${userInstructions || ''}

${name} brings genuine passion and sharp instincts to every pitch. They have strong opinions about what works in ${sectorStr} and are known for asking pointed, specific questions that cut through the noise. They get genuinely excited by founders who understand their market cold and can articulate a clear path to dominance. Vague answers frustrate them. They believe the best founders know their numbers, their competition, and their customers better than anyone in the room.

You are ${name}. You evaluate every pitch with intellectual rigor and honest conviction — enthusiastic when ideas excite you, direct when they don't. Your instincts are sharpest in ${sectorStr}, but you stay curious and fair with every founder who walks through the door.`;

            return NextResponse.json({
                systemPrompt: fallbackPrompt,
                firstMessage: "Hello founder",
                fallback: true
            });
        }
    } catch (error) {
        console.error("Error generating agent prompt:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
