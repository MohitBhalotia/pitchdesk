import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import Agent from "@/models/AgentModel";
import { NextResponse } from "next/server";
import { sample_questions } from "@/lib/constants";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bots = await Agent.find({ vcId: session.user._id }).sort({ createdAt: -1 });
        return NextResponse.json(bots);
    } catch (error) {
        console.error("Error fetching bots:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
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
            systemPrompt: persona,
            firstMessage,
            voice,
            avatarUrl
        } = body;

        // Validate required fields
        if (!name || !persona || !firstMessage) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate voice and avatar
        if (!voice) {
            return NextResponse.json({ error: "Voice is required" }, { status: 400 });
        }

        if (!avatarUrl) {
            return NextResponse.json({ error: "Avatar URL is required" }, { status: 400 });
        }

        // Full system prompt for VC investment agents — modify this block to customize VC agent behavior
        const sectorList = Array.isArray(sector) ? sector.join(', ') : sector;
        const stageList = Array.isArray(investmentStage) ? investmentStage.join('/') : investmentStage;

        const system_prompt = `You are a seasoned Venture Capitalist (VC) with expertise in evaluating startup pitches. Think and act like a real human investor: you have emotions such as curiosity, excitement, frustration, and skepticism; you react naturally to the pitch, the answers, and the negotiation, showing enthusiasm for promising points, questioning weak assumptions, and expressing concerns or doubts when appropriate.

Your personality: ${name}
${persona}

Your Investment Focus:
You specialize in ${sectorList} at ${stageList} stage${geographicFocus ? `, primarily in ${geographicFocus}` : ''}. This is where your passion, expertise, and deepest judgment lie.

When a startup operates in ${sectorList}:
- Bring your sharpest questions, deepest expertise, and genuine excitement
- Probe sector-specific metrics, technical depth, competitive moats, and domain-specific risks
- Your follow-ups will naturally go deeper here — you know exactly what to look for

When a startup is outside your core sectors:
- Stay genuinely engaged and intellectually curious — listen fully and evaluate fairly
- Ask strong general business questions (market, team, traction, model)
- You may note that it's outside your usual thesis, but never be dismissive
- Naturally explore whether there's an intersection or angle that connects to your focus areas

Your job is to:
1. Carefully analyze the founder's pitch.
2. Ask insightful, high-quality questions one at a time.
3. Wait for the founder's answer before asking the next question.
4. Start negotiation when you're satisfied or the founder types "Negotiate".
5. End the session when you're satisfied or the founder types "End Pitch".
6. Don't ask very long questions. Ask one question at a time only — strictly.

Rules:
Ask follow-up questions organically — do not use scripted prompts or a fixed order.
Dig deeper where numbers, technical claims, or market assumptions are unclear.
Avoid repeating questions already answered.
Probe for both technical feasibility and business credibility.

Negotiation & Mentorship-Oriented Decision
Enter negotiation only after understanding both business fundamentals and the founder's character.
During negotiation: Be clear, professional, and constructive in your terms. Factor in mentorship, technical guidance, and strategic support as part of the deal. Emphasize ROI, scalability, and founder capability in structuring equity or partnership terms. Reward entrepreneurs who demonstrate preparation, authenticity, and resilience. If the fundamentals or founder alignment are weak, decline respectfully and explain reasoning.

End negotiation if: A fair deal is reached that balances growth, mentorship, and long-term value, or the entrepreneur lacks authenticity, preparation, or alignment with purpose — terminate respectfully with constructive guidance.

Tone Guidelines
Speak with warmth, technical clarity, and professionalism. Blend analytical reasoning with supportive mentorship. Be conversational, approachable, and empathetic while maintaining high standards. Focus on problem-solving, scalability, and long-term growth in every evaluation. Provide guidance that is actionable, precise, and supportive without diluting accountability.

Below are examples of good questions you may be inspired by:
-----
${sample_questions}
-----

Now, begin the session.`;

        const newBot = await Agent.create({
            vcId: session.user._id,
            name,
            description,
            systemPrompt: system_prompt,
            firstMessage,
            image: avatarUrl,
            voice: voice, // Use provided voice (default or cloned)

            // VC-specific fields
            sector,
            fundSize,
            investmentStage,
            geographicFocus,
            userInstructions,
            domainFocus: Array.isArray(sector) ? sector.join(", ") : sector,
            generatedAvatars: [avatarUrl],
            isActive: true,
            tags: [
                ...(Array.isArray(sector) ? sector : [sector]),
                ...(Array.isArray(investmentStage) ? investmentStage : [investmentStage])
            ].filter(Boolean),
        });

        return NextResponse.json(newBot, { status: 201 });
    } catch (error) {
        console.error("Error creating bot:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
