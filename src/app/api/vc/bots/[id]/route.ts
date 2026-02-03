import dbConnect from "@/lib/db";
import Agent from "@/models/AgentModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { RouteContext } from "@/types/route-context";

export async function GET(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await context.params;

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bot = await Agent.findById(id);

        if (!bot) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404 });
        }

        // Verify ownership
        if (bot.vcId?.toString() !== session.user._id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json(bot);
    } catch (error) {
        console.error("Error fetching bot:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
