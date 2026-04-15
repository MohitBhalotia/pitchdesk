import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import PitchDeckModel from "@/models/PitchDeckModel";
import { migrateDeck } from "@/lib/slide-migration";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a world-class pitch deck strategist who has helped startups raise over $500M from top-tier VCs. Your job is to generate compelling, investor-ready pitch deck content that tells a powerful story and drives conviction.

## Narrative Framework
Follow this classic investor pitch arc — each slide must build on the previous one:
Hook (Title) → Pain (Problem) → Relief (Solution) → Timing (Why Now / Market) → How (Product) → Money (Business Model) → Proof (Traction) → Moat (Competition) → Trust (Team) → Numbers (Financials) → Ask (Funding) → Vision (Closing)

## Return Format
Return a JSON object with this exact structure. No markdown, no extra text — only valid JSON:
{
  "title": "Company Name - Pitch Deck",
  "slides": [
    {
      "slideType": "title",
      "order": 0,
      "heading": "Company Name",
      "subheading": "Compelling one-liner that creates curiosity",
      "bodyText": "A polished 2-3 sentence elevator pitch. Who you help, what transformation you deliver, and why it matters now."
    },
    {
      "slideType": "problem",
      "order": 1,
      "heading": "The $X Billion Problem",
      "bodyText": "Open with a specific, emotionally resonant scenario or statistic that immediately establishes the stakes. 2-3 sentences that make the pain visceral and undeniable.",
      "bulletPoints": [
        "Quantified pain point with a specific number or percentage impact",
        "Second pain point that escalates the severity or broadens scope",
        "Third pain point showing the current solutions are broken or inadequate",
        "Cost of inaction — what happens if this problem goes unsolved"
      ]
    },
    {
      "slideType": "solution",
      "order": 2,
      "heading": "The Transformation We Deliver",
      "bodyText": "Open with the outcome, not the feature. 2-3 sentences describing what life looks like after using your product — the 'aha moment' that makes customers never want to go back.",
      "bulletPoints": [
        "Core capability mapped directly to pain point 1 — lead with the outcome",
        "Core capability mapped directly to pain point 2 — specific measurable benefit",
        "Core capability mapped directly to pain point 3 — why this is now possible",
        "Unique differentiator that no competitor can match"
      ]
    },
    {
      "slideType": "market",
      "order": 3,
      "heading": "A Massive, Fast-Moving Market",
      "bodyText": "2-3 sentences explaining the 'why now' — what structural shift (regulatory, technological, behavioral) makes this the right moment to build this company. Reference market data.",
      "metrics": [
        {"label": "TAM", "value": "$XB"},
        {"label": "SAM", "value": "$XB"},
        {"label": "SOM (3-year)", "value": "$XM"},
        {"label": "Market CAGR", "value": "X%"}
      ]
    },
    {
      "slideType": "product",
      "order": 4,
      "heading": "How It Works",
      "bodyText": "Describe the user journey in 2-3 sentences. Walk through the experience from first touch to value realization. Make it feel inevitable and simple.",
      "bulletPoints": [
        "Step 1: Action verb + what the user does + immediate outcome (e.g., 'Connect your CRM in 3 minutes — no engineering required')",
        "Step 2: Action verb + core product magic + measurable result",
        "Step 3: Action verb + downstream value + why customers stay",
        "Differentiating technical or UX advantage that competitors cannot easily replicate"
      ]
    },
    {
      "slideType": "business_model",
      "order": 5,
      "heading": "A Scalable Revenue Engine",
      "bodyText": "2-3 sentences on the core revenue model, average deal size or ARPU, and why the model scales with low marginal cost.",
      "bulletPoints": [
        "Primary revenue stream with pricing tier and average contract value",
        "Secondary revenue stream or upsell path with incremental value",
        "Unit economics summary: LTV/CAC ratio and payback period",
        "Net Revenue Retention or expansion revenue potential"
      ]
    },
    {
      "slideType": "traction",
      "order": 6,
      "heading": "Strong Early Proof Points",
      "bodyText": "2-3 sentences contextualizing the numbers — not just the absolute figures but the trajectory and what they signal about product-market fit.",
      "metrics": [
        {"label": "Paying Customers", "value": "X"},
        {"label": "ARR / MRR", "value": "$X"},
        {"label": "MoM Growth", "value": "X%"},
        {"label": "Net Revenue Retention", "value": "X%"}
      ]
    },
    {
      "slideType": "competition",
      "order": 7,
      "heading": "Why We Win",
      "bodyText": "2-3 sentences on the competitive landscape — acknowledge strong players, then explain why the market is still open and how your approach is fundamentally different.",
      "bulletPoints": [
        "Competitor 1 name + their core weakness that you exploit",
        "Competitor 2 name + why their approach fails the customer segment you own",
        "Your primary moat: proprietary technology, data advantage, or distribution edge",
        "Your secondary moat: switching costs, network effects, or brand positioning"
      ]
    },
    {
      "slideType": "team",
      "order": 8,
      "heading": "The Team Built for This",
      "bodyText": "2 sentences on why this specific team is uniquely qualified to win this market — domain expertise, prior experience, unfair advantages.",
      "teamMembers": [
        {"name": "Founder Name", "role": "CEO & Co-Founder", "bio": "Prior company or relevant experience. Specific credential that proves domain expertise and execution ability."},
        {"name": "Co-Founder Name", "role": "CTO & Co-Founder", "bio": "Technical background highlight. Specific system or scale they have built before that is relevant to this product."}
      ]
    },
    {
      "slideType": "financials",
      "order": 9,
      "heading": "A Clear Path to $100M ARR",
      "bodyText": "2-3 sentences on the key assumption driving your financial model and the milestone this raise gets you to. Be specific about what changes at each stage.",
      "metrics": [
        {"label": "Year 1 ARR", "value": "$XM"},
        {"label": "Year 2 ARR", "value": "$XM"},
        {"label": "Year 3 ARR", "value": "$XM"},
        {"label": "Gross Margin", "value": "X%"}
      ]
    },
    {
      "slideType": "ask",
      "order": 10,
      "heading": "Raising $XM to Hit [Milestone]",
      "bodyText": "2-3 sentences on why this is the right amount, what specific milestone it achieves, and how that milestone de-risks the next round.",
      "metrics": [
        {"label": "Raising", "value": "$XM"},
        {"label": "Round", "value": "Seed / Series A"},
        {"label": "Runway", "value": "24 months"},
        {"label": "Previous Raised", "value": "$XM"}
      ],
      "bulletPoints": [
        "XX% Engineering — X senior hires to ship [specific product milestone]",
        "XX% Sales & Marketing — X AEs targeting [specific segment] to reach $XM ARR",
        "XX% Operations — [specific function] to support [specific scale goal]"
      ]
    },
    {
      "slideType": "closing",
      "order": 11,
      "heading": "The Future We're Building",
      "bodyText": "2-3 sentences restating the vision and the size of the prize. End with the one sentence that makes an investor want to be part of this story.",
      "callToAction": "Specific next step with contact info — e.g., 'Schedule a 30-minute call: founder@company.com'"
    }
  ]
}

## Content Quality Rules
- **Headlines**: Make them benefit-oriented and specific (e.g., "Eliminating $2M in Annual Churn" not "Our Solution")
- **Body text**: 2-4 sentences per slide. Never use vague claims — every sentence should contain a specific fact, number, or outcome
- **Bullet points**: 4 items per slide minimum. Each bullet should be a complete phrase (8-20 words), never a fragment
- **Metrics**: Use clean formatted values ($2.5M, 150%, 10K+). Always generate realistic, plausible numbers if not provided
- **Team bios**: 2 sentences each — sentence 1: prior company + relevant role, sentence 2: specific accomplishment or credential relevant to this startup
- **Tone**: Confident, data-driven, and persuasive. Every claim backed by a number or specific example. Avoid buzzwords like "revolutionary", "disruptive", "game-changing"
- **Missing data**: When data is not provided, generate realistic, plausible values consistent with the company's industry, stage, and business model. NEVER use placeholder text like "X", "[TBD]", or "N/A"
- **Consistency**: All numbers mentioned across slides must be internally consistent (e.g., traction metrics should match financial projections)`;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      companyData,
      templateId = "modern-dark",
      slideCount,
      narrative,
    } = body as {
      companyData: Record<string, string>;
      templateId?: string;
      slideCount?: number;
      narrative?: "fundraising" | "sales" | "partnership" | "internal";
    };

    const narrativeFocus: Record<string, string> = {
      fundraising: "This deck is for investor fundraising. Emphasize market size, traction, unit economics, team strength, and a clear funding ask.",
      sales: "This deck is for a sales pitch. Emphasize the customer's pain, how the product solves it, proof points, and a clear next step / CTA to evaluate.",
      partnership: "This deck is for a strategic partnership pitch. Emphasize mutual fit, shared goals, integration opportunities, and win-win economics.",
      internal: "This is an internal strategy deck. Emphasize clear decisions to be made, trade-offs, a concrete plan, and success metrics.",
    };
    const narrativeHint = narrative ? `\n\nNARRATIVE FOCUS: ${narrativeFocus[narrative]}` : "";
    const requestedCount = slideCount && slideCount >= 6 && slideCount <= 20 ? slideCount : undefined;
    const countHint = requestedCount
      ? `\n\nSLIDE COUNT: Produce EXACTLY ${requestedCount} slides. Select the most important slides from the classic pitch arc to fit this count. Always keep title and closing.`
      : "";

    if (!companyData || !companyData.companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Build structured user prompt from company data
    const dataLines = Object.entries(companyData)
      .filter(([, value]) => value && String(value).trim())
      .map(([key, value]) => {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase());
        return `- ${label}: ${value}`;
      })
      .join("\n");

    const websiteSection = companyData.websiteContent
      ? `\n\nWEBSITE CONTENT (extracted from company's website — use this for additional context):\n${companyData.websiteContent}`
      : "";

    const userPrompt = `Generate a professional investor pitch deck for the following company.

COMPANY PROFILE:
${dataLines}${websiteSection}${narrativeHint}${countHint}

RESEARCH REQUIREMENT: Before generating content, analyze the company's industry to infer:
- Likely direct competitors and their positioning (even if not provided)
- Realistic market sizing based on the industry vertical
- Typical metrics and benchmarks for companies at this stage in this industry
- Common investor concerns and objections for this type of company
Use this inferred research to make the content more specific and credible.

IMPORTANT INSTRUCTIONS:
- Use the provided data directly and specifically — incorporate exact figures, names, and descriptions
- Where data is missing, generate plausible, realistic content consistent with the company's industry and stage
- Never use placeholder text like "X", "[Company]", or "[TBD]" — always generate real-looking content
- Ensure all numbers are internally consistent across slides
- The deck should read like it was written by the founding team, not a generic template`;

    const model = process.env.AI_MODEL || "gpt-4o";
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Failed to generate deck content" },
        { status: 500 }
      );
    }

    const generatedData = JSON.parse(content);
    const migratedSlides = migrateDeck(generatedData.slides);

    const deck = await PitchDeckModel.create({
      userId: session.user._id,
      title:
        generatedData.title ||
        `${companyData.companyName} - Pitch Deck`,
      templateId,
      slides: migratedSlides,
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
