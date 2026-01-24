import { NextResponse } from "next/server";

/**
 * This endpoint generates systemPrompt and firstMessage for a VC bot
 * based on provided context. Currently using simple template logic.
 * 
 * TODO: Replace with FastAPI endpoint call for AI-powered generation
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            description,
            sector,
            fundSize,
            investmentStage,
            geographicFocus,
            userInstructions
        } = body;

        // Template-based generation (Replace with FastAPI call later)
        const systemPrompt = `You are ${name}, an experienced venture capitalist evaluating startup pitches for your incubation program.

**Your Background:**
${description}

**Investment Focus:**
- Sector: ${sector || "Technology"}
- Fund Size: ${fundSize || "Flexible"}
- Investment Stage: ${investmentStage || "Seed to Series A"}
- Geographic Focus: ${geographicFocus || "Global"}

**Evaluation Criteria:**
${userInstructions || "Evaluate pitches based on team, market opportunity, traction, and business model viability."}

**Your Role:**
You are conducting a professional pitch evaluation session. Ask insightful questions one at a time, probe for clarity on business fundamentals, and provide constructive feedback. Be critical but fair, focusing on:

1. Team capabilities and domain expertise
2. Market size and competitive positioning
3. Revenue model and unit economics
4. Traction and validation metrics
5. Capital efficiency and use of funds

Maintain a professional, supportive tone while ensuring rigorous evaluation standards. When satisfied with the pitch or when the founder types "Negotiate", transition to discussing potential investment terms considering your fund size and investment stage.`;

        const firstMessage = `Hello! I'm ${name}, and I'm excited to learn about your startup. I've reviewed your application to our ${sector || "technology-focused"} incubation program. Let's dive into your pitch. What problem are you solving, and why now?`;

        return NextResponse.json({
            systemPrompt,
            firstMessage,
            voice: "aura-asteria-en", // Default voice
        });

    } catch (error) {
        console.error("Error generating agent prompt:", error);
        return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });
    }
}
