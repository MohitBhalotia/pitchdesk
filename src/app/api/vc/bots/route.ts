import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import Agent from "@/models/AgentModel";
import { NextResponse } from "next/server";

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
            systemPrompt,
            firstMessage,
            voice,
            avatarUrl
        } = body;

        // Validate required fields
        if (!name || !systemPrompt || !firstMessage) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate voice and avatar
        if (!voice) {
            return NextResponse.json({ error: "Voice is required" }, { status: 400 });
        }

        if (!avatarUrl) {
            return NextResponse.json({ error: "Avatar URL is required" }, { status: 400 });
        }

        const newBot = await Agent.create({
            vcId: session.user._id,
            name,
            description,
            systemPrompt,
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
