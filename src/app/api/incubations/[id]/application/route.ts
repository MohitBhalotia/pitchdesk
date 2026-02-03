import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationApplication from "@/models/IncubationApplicationModel";
import { NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";

export async function GET(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id: programId } = await context.params;

        if (!session) {
            return NextResponse.json(null); // No session, no application
        }

        const application = await IncubationApplication.findOne({
            programId,
            founderId: session.user._id
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error("Error checking application:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
