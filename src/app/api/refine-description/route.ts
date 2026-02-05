
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { description } = body;

        if (!description) {
            return NextResponse.json({ error: "Description is required" }, { status: 400 });
        }

        const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_BACKEND || 'http://localhost:8000';

        try {
            const response = await axios.post(`${fastApiUrl}/refine-description`, {
                description
            });

            return NextResponse.json(response.data);
        } catch (apiError) {
            console.error("FastAPI Error:", apiError);
            return NextResponse.json({ error: "Failed to refine description with AI" }, { status: 500 });
        }

    } catch (error) {
        console.error("Error refining description:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
