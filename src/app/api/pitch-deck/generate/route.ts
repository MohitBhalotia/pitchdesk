import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import PitchDeckModel from "@/models/PitchDeckModel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert pitch deck content strategist. Given company information, generate structured content for a professional investor pitch deck.

Return a JSON object with this exact structure:
{
  "title": "Company Name - Pitch Deck",
  "slides": [
    {
      "slideType": "title",
      "order": 0,
      "heading": "Company Name",
      "subheading": "Tagline or one-liner",
      "bodyText": "Brief elevator pitch (1-2 sentences)"
    },
    {
      "slideType": "problem",
      "order": 1,
      "heading": "The Problem",
      "bodyText": "Clear problem description",
      "bulletPoints": ["Pain point 1", "Pain point 2", "Pain point 3"]
    },
    {
      "slideType": "solution",
      "order": 2,
      "heading": "Our Solution",
      "bodyText": "Solution description",
      "bulletPoints": ["Key benefit 1", "Key benefit 2", "Key benefit 3"]
    },
    {
      "slideType": "market",
      "order": 3,
      "heading": "Market Opportunity",
      "bodyText": "Market overview",
      "metrics": [
        {"label": "TAM", "value": "$X B"},
        {"label": "SAM", "value": "$X B"},
        {"label": "SOM", "value": "$X M"}
      ]
    },
    {
      "slideType": "product",
      "order": 4,
      "heading": "How It Works",
      "bodyText": "Product description",
      "bulletPoints": ["Feature 1", "Feature 2", "Feature 3"]
    },
    {
      "slideType": "business_model",
      "order": 5,
      "heading": "Business Model",
      "bodyText": "Revenue model explanation",
      "bulletPoints": ["Revenue stream 1", "Revenue stream 2"]
    },
    {
      "slideType": "traction",
      "order": 6,
      "heading": "Traction & Milestones",
      "bodyText": "Progress summary",
      "metrics": [
        {"label": "Customers", "value": "X"},
        {"label": "Revenue", "value": "$X"},
        {"label": "Growth", "value": "X%"}
      ]
    },
    {
      "slideType": "competition",
      "order": 7,
      "heading": "Competitive Landscape",
      "bodyText": "How we differentiate",
      "bulletPoints": ["Advantage 1", "Advantage 2", "Advantage 3"]
    },
    {
      "slideType": "team",
      "order": 8,
      "heading": "Our Team",
      "bodyText": "Team overview",
      "teamMembers": [
        {"name": "Name", "role": "CEO", "bio": "Brief background"}
      ]
    },
    {
      "slideType": "financials",
      "order": 9,
      "heading": "Financial Overview",
      "bodyText": "Financial summary",
      "metrics": [
        {"label": "Year 1", "value": "$X"},
        {"label": "Year 2", "value": "$X"},
        {"label": "Year 3", "value": "$X"}
      ]
    },
    {
      "slideType": "ask",
      "order": 10,
      "heading": "The Ask",
      "bodyText": "What we're raising and why",
      "metrics": [
        {"label": "Raising", "value": "$X"},
        {"label": "Use of Funds", "value": "Summary"}
      ],
      "bulletPoints": ["Fund allocation 1", "Fund allocation 2", "Fund allocation 3"]
    },
    {
      "slideType": "closing",
      "order": 11,
      "heading": "Let's Build Together",
      "bodyText": "Closing statement",
      "callToAction": "Contact info or next steps"
    }
  ]
}

Rules:
- Generate exactly 12 slides in the order shown above
- Make content compelling, concise, and investor-ready
- Use real numbers from the provided data where available
- Where data is missing, create realistic placeholder content marked with realistic estimates
- Keep bullet points to 3-4 items max per slide
- Keep headings short and impactful
- Body text should be 1-3 sentences max
- Metrics should use clean formatted values (e.g., "$2.5M", "150%", "10K+")
- Team bios should be 1 sentence each
- Return ONLY valid JSON, no markdown or extra text`;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { companyData, templateId = "modern-dark" } = body;

    if (!companyData || !companyData.companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Build the user prompt from company data
    const userPrompt = Object.entries(companyData)
      .filter(([, value]) => value && String(value).trim())
      .map(([key, value]) => {
        // Convert camelCase to readable label
        const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
        return `${label}: ${value}`;
      })
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generate a professional pitch deck for the following company:\n\n${userPrompt}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Failed to generate deck content" },
        { status: 500 }
      );
    }

    const generatedData = JSON.parse(content);

    const deck = await PitchDeckModel.create({
      userId: session.user._id,
      title: generatedData.title || `${companyData.companyName} - Pitch Deck`,
      templateId,
      slides: generatedData.slides,
      companyData,
      status: "draft",
    });

    return NextResponse.json({
      message: "Deck generated successfully",
      deck: {
        _id: deck._id,
        title: deck.title,
        templateId: deck.templateId,
        slides: deck.slides,
        status: deck.status,
        createdAt: deck.createdAt,
      },
    });
  } catch (error) {
    console.error("Error generating pitch deck:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
