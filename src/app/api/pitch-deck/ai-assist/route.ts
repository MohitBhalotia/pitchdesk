import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { instruction, content, scope } = await req.json();

    if (!instruction || !content) {
      return NextResponse.json({ error: "instruction and content are required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert pitch deck writer and startup communication specialist.
Your job is to improve pitch deck content based on specific instructions.

Rules:
- Return ONLY the improved content, no explanations or meta-commentary
- Preserve the HTML formatting if the input contains HTML tags
- Keep the same general structure but improve clarity, impact, and persuasiveness
- Use specific numbers and data where possible, not vague statements
- Write in a confident, professional tone
- If improving a heading: make it punchy and benefit-oriented (max 10 words)
- If improving body text: make it compelling and specific (2-4 sentences)
- If improving bullet points: each bullet should be 8-20 words, action-oriented
- Never use buzzwords like "revolutionary", "game-changing", "disruptive", "innovative"`;

    const userPrompt = `Scope: ${scope || "element"}

Instruction: ${instruction}

Current content:
${content}

Return the improved version:`;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = completion.choices[0]?.message?.content?.trim() || content;

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI assist failed:", error);
    return NextResponse.json({ error: "AI assist failed" }, { status: 500 });
  }
}
