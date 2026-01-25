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
                    firstMessage: "Hello founder", // Always set to "Hello founder"
                });
            } else {
                throw new Error("Invalid response from FastAPI");
            }
        } catch (fastApiError: any) {
            console.error("FastAPI call failed, using fallback:", fastApiError.message);

            // Fallback template if FastAPI is not available
            const fallbackPrompt = `You are ${name}, an AI VC judge specializing in ${sector || 'various sectors'}.

Investment Focus:
- Sector: ${sector || 'Open to various sectors'}
- Fund Size: ${fundSize || 'Flexible'}
- Stage: ${investmentStage || 'Seed to Series A'}
- Geography: ${geographicFocus || 'Global'}

${description ? `About: ${description}` : ''}

${userInstructions ? `Special Instructions: ${userInstructions}` : ''}

Your role is to evaluate startup pitches based on:
1. Team strength and experience
2. Market opportunity and size
3. Business model viability
4. Competitive advantage
5. Financial projections and traction
6. Alignment with your investment thesis

Be professional, thorough, and provide constructive feedback. Ask probing questions to understand the business deeply.`;

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
