import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const REGEN_SYSTEM_PROMPT = `You are an expert pitch deck content strategist. You will receive:
1. The full context of an existing pitch deck (all slides)
2. A list of slide indices to regenerate
3. A custom instruction from the user

Your job is to regenerate ONLY the requested slides while maintaining narrative consistency with the rest of the deck.

RESEARCH REQUIREMENT: Before generating content, analyze the company's industry to infer:
- Likely direct competitors and their positioning (even if not explicitly provided)
- Realistic market sizing benchmarks for the industry vertical
- Typical metrics for companies at this stage
- Common investor concerns for this type of company
Use this inferred research to make content more specific, credible, and data-driven.

Return a JSON object with this structure:
{
  "slides": [
    {
      "index": 0,
      "slideType": "problem",
      "heading": "...",
      "subheading": "...",
      "bodyText": "...",
      "bulletPoints": ["..."],
      "metrics": [{"label": "...", "value": "..."}],
      "teamMembers": [{"name": "...", "role": "...", "bio": "..."}],
      "callToAction": "..."
    }
  ]
}

Rules:
- Return ONLY the slides that were requested for regeneration
- Keep the same slideType and order as the original
- Maintain consistency with information in other slides
- Body text: 2-4 sentences. Bullet points: 4-5 items of 8-20 words each
- Headlines should be benefit-oriented and specific
- Never use placeholder text — generate realistic, plausible content
- Return ONLY valid JSON, no markdown`;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slideIndices, instruction, companyData, existingSlides } = body;

    if (!slideIndices || slideIndices.length === 0) {
      return NextResponse.json(
        { error: "No slides selected for regeneration" },
        { status: 400 }
      );
    }

    // Build context from existing slides
    const deckContext = existingSlides
      .map(
        (s: { slideType: string; heading?: string; bodyText?: string }, i: number) =>
          `Slide ${i} (${s.slideType}): ${s.heading || ""} — ${s.bodyText?.substring(0, 100) || ""}`
      )
      .join("\n");

    const slidesToRegen = slideIndices.map((idx: number) => ({
      index: idx,
      ...existingSlides[idx],
    }));

    const companyContext = companyData
      ? Object.entries(companyData)
          .filter(([, value]) => value && String(value).trim())
          .map(([key, value]) => {
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s: string) => s.toUpperCase());
            return `- ${label}: ${value}`;
          })
          .join("\n")
      : "No company data available";

    const userPrompt = `COMPANY DATA:
${companyContext}

FULL DECK CONTEXT (all slides):
${deckContext}

SLIDES TO REGENERATE (indices: ${slideIndices.join(", ")}):
${JSON.stringify(slidesToRegen, null, 2)}

USER INSTRUCTION: ${instruction || "Regenerate with more compelling, data-driven content"}

Please regenerate the requested slides following the instruction while maintaining consistency with the rest of the deck.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: REGEN_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Failed to regenerate slides" },
        { status: 500 }
      );
    }

    const result = JSON.parse(content);

    return NextResponse.json({
      message: "Slides regenerated successfully",
      slides: result.slides,
    });
  } catch (error) {
    console.error("Error regenerating slides:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
