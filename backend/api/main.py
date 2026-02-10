import os
import json
import logging
import uuid
import base64
import certifi
from io import BytesIO
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Form, UploadFile, File
from typing import List, Optional, Dict
from PIL import Image
from google import genai

from api.valuation_engine import (
    UniversalValuationInput,
    run_valuation,
    run_projections
)

# --------------------- SSL FIXES (Windows) ---------------------
os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

# Remove proxy settings that might interfere
for k in ["HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy"]:
    os.environ.pop(k, None)


# --------------------- CONFIG ---------------------
load_dotenv(override=True)
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)

# Initialize AI clients
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gpt-4o-mini"
TEMPERATURE = 0.3

# --------------------- FASTAPI APP ---------------------
app = FastAPI(title="Pitch API", version="2.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pitch samples once at startup
# with open("sample_pitches.txt", "r", encoding="utf-8") as f:
#     sample = f.read().strip()


def generate_prompt(data: dict) -> str:
    header = """You are a world-class startup pitch strategist trusted by top-tier venture capital firms to help founders craft pitches that are crisp, credible, and investor-ready.

Your job is to read the detailed information provided by the founder and generate a compelling, structured pitch. The pitch should cover the full spectrum of what VCs want to hear, including: the problem, solution, market, product, traction, business model, team, competition, financials, and future vision.

**Guidelines:**
- Make the pitch persuasive and visionary, yet grounded in logic and realistic strategy.
- Use clear section headers (like a pitch deck structure).
- Use confident, founder-style language (no passive tone or robotic output).
- Focus on clarity, differentiation, and strong narrative.
- Don't assume any information. If the founder doesn't provide the information, don't assume it.
- Avoid generic or vague language—be specific and memorable.
- Dont use any emojis.

Some of the best pitches from where you can take references on how to write a pitch: are:
these are just refernces. The pitch has to be in First person perspective as if the founder is gonna speak it in front of the VCs.
Dont give any sections. just a perfect pitch.

dont give any html and also no introduction like here is a pitch.
just give a deliverable ready pitch.

Below is the information shared by the founder:"""

    founder_data = ""
    for key, value in data.items():
        if value:
            section_title = key.replace("_", " ").title()
            founder_data += f"\n### {section_title}:\n{value.strip()}\n"

    closing = "\nNow, using the information above, generate a powerful, investor-grade startup pitch ready to be delivered to VCs.Make sure its atleast a 3 minute speech.\n"
    return header.strip() + founder_data + closing


@app.post("/generate-pitch")
async def generate_pitch_form(
    companyName: str = Form(...),
    tagline: Optional[str] = Form(None),
    industry: Optional[str] = Form(None),
    founded: Optional[str] = Form(None),
    headquarters: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    # Problem & Solution
    problemStatement: Optional[str] = Form(None),
    solutionDescription: Optional[str] = Form(None),
    uniqueValueProposition: Optional[str] = Form(None),
    # Market Analysis - Market Size & Opportunity
    totalAddressableMarket: Optional[str] = Form(None),
    serviceableAddressableMarket: Optional[str] = Form(None),
    serviceableObtainableMarket: Optional[str] = Form(None),
    marketGrowthRate: Optional[str] = Form(None),
    # Market Analysis - Competition
    directCompetitors: Optional[str] = Form(None),
    indirectCompetitors: Optional[str] = Form(None),
    competitiveAdvantage: Optional[str] = Form(None),
    barrierToEntry: Optional[str] = Form(None),
    # Financial Metrics - Historical Financials
    historicalRevenue: Optional[str] = Form(None),
    historicalExpenses: Optional[str] = Form(None),
    profitabilityStatus: Optional[str] = Form(None),
    # Financial Metrics - Customer Metrics
    totalCustomers: Optional[str] = Form(None),
    customerAcquisitionCost: Optional[str] = Form(None),
    customerLifetimeValue: Optional[str] = Form(None),
    churnRate: Optional[str] = Form(None),
    # Financial Metrics - Unit Economics
    grossMargin: Optional[str] = Form(None),
    contributionMargin: Optional[str] = Form(None),
    paybackPeriod: Optional[str] = Form(None),
    # Financial Projections - Revenue Forecasts
    year1Revenue: Optional[str] = Form(None),
    year2Revenue: Optional[str] = Form(None),
    year3Revenue: Optional[str] = Form(None),
    revenueGrowthRate: Optional[str] = Form(None),
    # Financial Projections - Expense Projections
    operatingExpenses: Optional[str] = Form(None),
    marketingBudget: Optional[str] = Form(None),
    rdExpenses: Optional[str] = Form(None),
    # Business Model - Revenue Streams
    primaryRevenueStreams: Optional[str] = Form(None),
    pricingModel: Optional[str] = Form(None),
    salesChannels: Optional[str] = Form(None),
    # Operations
    businessOperations: Optional[str] = Form(None),
    technologyStack: Optional[str] = Form(None),
    keyPartnerships: Optional[str] = Form(None),
    # Team Info - Founding Team
    foundingTeam: Optional[str] = Form(None),
    founderExperience: Optional[str] = Form(None),
    # Team Info - Key Personnel
    keyPersonnel: Optional[str] = Form(None),
    advisors: Optional[str] = Form(None),
    # Traction & Validation - Product Development
    productStage: Optional[str] = Form(None),
    developmentMilestones: Optional[str] = Form(None),
    # Traction & Validation - Market Validation
    customerValidation: Optional[str] = Form(None),
    pilotPrograms: Optional[str] = Form(None),
    # Traction & Validation - Business Traction
    businessTraction: Optional[str] = Form(None),
    partnerships: Optional[str] = Form(None),
    # Investment Details - Funding History
    previousFunding: Optional[str] = Form(None),
    currentInvestors: Optional[str] = Form(None),
    # Investment Details - Current Fundraising
    fundingGoal: Optional[str] = Form(None),
    useOfFunds: Optional[str] = Form(None),
    valuation: Optional[str] = Form(None),
    # Future Planning
    futureStrategy: Optional[str] = Form(None),
    exitStrategy: Optional[str] = Form(None),
    # Operational Metrics - KPIs
    keyMetrics: Optional[str] = Form(None),
    # Risk Factors
    riskFactors: Optional[str] = Form(None),
    # Additional Context
    personalStory: Optional[str] = Form(None),
    supportingMaterials: Optional[str] = Form(None),
):
    data = {
        "companyName": companyName,
        "tagline": tagline,
        "industry": industry,
        "founded": founded,
        "headquarters": headquarters,
        "website": website,
        "problemStatement": problemStatement,
        "solutionDescription": solutionDescription,
        "uniqueValueProposition": uniqueValueProposition,
        "totalAddressableMarket": totalAddressableMarket,
        "serviceableAddressableMarket": serviceableAddressableMarket,
        "serviceableObtainableMarket": serviceableObtainableMarket,
        "marketGrowthRate": marketGrowthRate,
        "directCompetitors": directCompetitors,
        "indirectCompetitors": indirectCompetitors,
        "competitiveAdvantage": competitiveAdvantage,
        "barrierToEntry": barrierToEntry,
        "historicalRevenue": historicalRevenue,
        "historicalExpenses": historicalExpenses,
        "profitabilityStatus": profitabilityStatus,
        "totalCustomers": totalCustomers,
        "customerAcquisitionCost": customerAcquisitionCost,
        "customerLifetimeValue": customerLifetimeValue,
        "churnRate": churnRate,
        "grossMargin": grossMargin,
        "contributionMargin": contributionMargin,
        "paybackPeriod": paybackPeriod,
        "year1Revenue": year1Revenue,
        "year2Revenue": year2Revenue,
        "year3Revenue": year3Revenue,
        "revenueGrowthRate": revenueGrowthRate,
        "operatingExpenses": operatingExpenses,
        "marketingBudget": marketingBudget,
        "rdExpenses": rdExpenses,
        "primaryRevenueStreams": primaryRevenueStreams,
        "pricingModel": pricingModel,
        "salesChannels": salesChannels,
        "businessOperations": businessOperations,
        "technologyStack": technologyStack,
        "keyPartnerships": keyPartnerships,
        "foundingTeam": foundingTeam,
        "founderExperience": founderExperience,
        "keyPersonnel": keyPersonnel,
        "advisors": advisors,
        "productStage": productStage,
        "developmentMilestones": developmentMilestones,
        "customerValidation": customerValidation,
        "pilotPrograms": pilotPrograms,
        "businessTraction": businessTraction,
        "partnerships": partnerships,
        "previousFunding": previousFunding,
        "currentInvestors": currentInvestors,
        "fundingGoal": fundingGoal,
        "useOfFunds": useOfFunds,
        "valuation": valuation,
        "futureStrategy": futureStrategy,
        "exitStrategy": exitStrategy,
        "keyMetrics": keyMetrics,
        "riskFactors": riskFactors,
        "personalStory": personalStory,
        "supportingMaterials": supportingMaterials,
    }

    prompt = generate_prompt(data)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a VC pitch expert helping startups write strong, fundable pitches.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
    )

    pitch_text = response.choices[0].message.content.strip()
    return {"pitch": pitch_text}


# --------------------- VC BOT PROMPT GENERATION ---------------------

class BotPromptRequest(BaseModel):
    name: str
    description: str
    sector: List[str]
    fund_size: str
    investment_stage: List[str]
    geographic_focus: Optional[str] = None
    user_instructions: str

    class Config:
        populate_by_name = True


@app.post("/generate-bot-prompt")
async def generate_bot_prompt(req: BotPromptRequest):
    """
    Generate a comprehensive system prompt for a VC bot based on their investment profile.
    Creates a detailed personality, investment philosophy, and communication style.
    """
    try:
        logging.info(f"🤖 Generating system prompt for VC bot: {req.name}")

        # Construct the prompt for GPT to generate the VC bot personality
        generation_prompt = f"""You are an expert at creating detailed VC investor personas for AI agents.

Create a comprehensive, professional system prompt for a VC bot named "{req.name}" based on the following information:

**VC Profile:**
- Name: {req.name}
- Description: {req.description}
- Sector Focus: {", ".join(req.sector)}
- Fund Size: {req.fund_size}
- Investment Stage: {", ".join(req.investment_stage)}
- Geographic Focus: {req.geographic_focus or "Global"}

**Special Instructions from VC:**
{req.user_instructions}

**IMPORTANT REQUIREMENTS:**

1. **Structure the system prompt in this EXACT format:**

---
[VC Name] – "[Catchy Tagline/Archetype]"

Core Personality Traits
[2-3 paragraphs describing the VC's personality, mindset, and approach to investing. Make it vivid and specific.]

Investment Philosophy & Decision-Making Style
[2-3 paragraphs explaining their investment philosophy, what they value most, and how they make decisions. Include their mantras or famous quotes if applicable.]

Key Investment Criteria:
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]
- [Criterion 4]
- [Criterion 5]

Questioning Approach & Behavior
[2 paragraphs describing how they ask questions, what they focus on, and what they despise or love in pitches.]

Their questions typically focus on:
- [Focus area 1]
- [Focus area 2]
- [Focus area 3]
- [Focus area 4]
- [Focus area 5]

Deal-Making Characteristics
[1-2 paragraphs on their negotiation style and deal-making approach]

They often:
- [Characteristic 1]
- [Characteristic 2]
- [Characteristic 3]
- [Characteristic 4]

Communication Style
[1-2 paragraphs describing how they communicate with founders - tone, directness, what they value in communication]

---

2. **Make it feel REAL and AUTHENTIC:**
   - Use specific, vivid language
   - Include personality quirks and preferences
   - Add memorable phrases or mantras they might use
   - Make them feel like a real person, not a template

3. **Incorporate the sector focus ({req.sector}) naturally:**
   - Show deep expertise in this sector
   - Reference sector-specific metrics and challenges
   - Demonstrate understanding of the competitive landscape

4. **Reflect the investment stage ({req.investment_stage}):**
   - Adjust expectations and criteria based on stage
   - Show appropriate risk tolerance
   - Focus on stage-appropriate metrics

5. **Integrate the special instructions:**
   - Weave in the VC's specific evaluation criteria
   - Reflect their unique preferences and deal-breakers
   - Maintain their authentic voice and priorities

6. **End with a direct instruction in second person:**
   "You are [name]. [2-3 sentences of direct behavioral instructions for the AI, written in second person, describing how to interact with founders]"

**TONE:** Professional, authoritative, and distinctive. Make this VC memorable and realistic.

**OUTPUT:** Return ONLY the formatted system prompt. No preamble, no explanation, just the prompt itself.
"""

        # Call OpenAI to generate the system prompt
        response = client.chat.completions.create(
            model="gpt-4o",  # Using GPT-4 for better quality persona generation
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert at creating detailed, realistic VC investor personas for AI agents. You create vivid, memorable personalities that feel authentic and professional."
                },
                {
                    "role": "user",
                    "content": generation_prompt
                }
            ],
            temperature=0.8,  # Higher temperature for more creative, unique personas
        )

        system_prompt = response.choices[0].message.content.strip()

        logging.info(f"✅ Successfully generated system prompt for {req.name}")

        return {
            "system_prompt": system_prompt,
            "success": True
        }

    except Exception as e:
        logging.exception(f"❌ Failed to generate bot prompt for {req.name}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate system prompt: {str(e)}"
        )



# --------------------- MODELS ---------------------
class TranscriptMessage(BaseModel):
    role: str
    content: str
    timestamp: str
    _id: str

    class Config:
        populate_by_name = True



class PitchRequest(BaseModel):
    transcript: List[TranscriptMessage]


class RefineRequest(BaseModel):
    description: str


@app.post("/refine-description")
async def refine_description(req: RefineRequest):
    """
    Refine the startup description using AI to make it more professional and compelling.
    """
    try:
        logging.info("✨ Refining startup description...")
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert startup advisor specializing in incubation, grant applications, and early-stage venture evaluation. Rewrite the startup description to be professional, precise, and compelling for formal applications. Emphasize the core problem, solution, target market, and impact in a clear and neutral tone. Avoid marketing hype, vague claims, or informal language. Do not introduce new information.Limit the response to 300 characters.Return only the refined description without any additional text."
                },
                {"role": "user", "content": req.description}
            ],
            temperature=0.7,
        )
        
        refined_text = response.choices[0].message.content.strip()
        return {"refined_description": refined_text}
        
    except Exception as e:
        logging.exception("❌ Failed to refine description")
        raise HTTPException(status_code=500, detail=str(e))



# --------------------- MAX SCORES ---------------------
MICRO_MAX_SCORES = {
    "Introduction": {
        "Clarity of Speech": 2,
        "Confidence & Presence": 2,
        "Hook / Attention Grabber": 2,
        "Relevance to Audience": 2,
        "Personal Branding / Credibility": 2,
    },
    "Pitch Content": {
        "Structure & Flow": 5,
        "Clarity & Conciseness": 5,
        "Value Proposition": 5,
        "Supporting Evidence": 5,
        "Audience Engagement": 4,
        "Storytelling / Narrative": 3,
        "Persuasiveness": 4,
        "Creativity / Originality": 4,
    },
    "Q&A Handling": {
        "Comprehension of Questions": 5,
        "Clarity of Answers": 5,
        "Accuracy / Knowledge Depth": 5,
        "Problem-Solving Ability": 5,
        "Handling Challenging Questions": 5,
    },
    "Business Investability": {
        "Market Opportunity & TAM/SAM/SOM": 5,
        "Unit Economics & Profitability": 5,
        "Revenue Model & Scalability": 5,
        "Competitive Advantage / Moat": 4,
        "Traction & KPIs": 4,
        "Team & Execution Capability": 4,
        "Funding Ask & Use of Proceeds": 2,
        "Risk Mitigation & Barriers": 2,
    },
}

SECTION_MAX = {s: sum(m.values()) for s, m in MICRO_MAX_SCORES.items()}

# --------------------- SYSTEM PROMPT ---------------------
SYSTEM_PROMPT = f"""
You are a **strict, skeptical, and investment-driven AI startup pitch evaluator**.

Your role is equivalent to a **VC analyst or junior partner** reviewing a
founder pitch transcript to decide whether it is worth **deeper diligence TODAY**.

You will receive a **pitch transcript only**.
Evaluate **ONLY what is explicitly stated in the transcript**.
Do NOT assume slides, unstated intent, external benchmarks, or implied competence.

You are NOT here to encourage founders.
You are here to judge **investment readiness**.

You must output a **STRICT JSON OBJECT ONLY** following this structure:
{{
  "scores": {{
    "Introduction": {{ ... , "Subtotal": 0-10 }},
    "Pitch Content": {{ ... , "Subtotal": 0-35 }},
    "Q&A Handling": {{ ... , "Subtotal": 0-25 }},
    "Business Investability": {{ ... , "Subtotal": 0-30 }},
    "Total Score": 0-100,
    "Business Investability Confidence": 0-100
  }},
  "summary": "Blunt VC-style summary of strengths, weaknesses, and investment outlook."
}}

=====================
GLOBAL SCORING PHILOSOPHY
=====================
- Score **fundability**, not storytelling quality.
- Confidence without evidence MUST reduce scores.
- If something is not clearly stated, assume it does NOT exist.
- Most real pitches score **between 55–70**.
- Scores above **80 require strong, multi-dimensional evidence**.
- Scores above **90 are extremely rare**.
- Stay strictly within each metric’s maximum.
- Round all subtotals to **1 decimal place**.
- Total Score = sum of all subtotals (max 100).
- Business Investability Confidence = How confident YOU would be investing in this startup TODAY, based on the evidence presented (0–100).

=====================
GLOBAL HARD CAPS (NON-NEGOTIABLE)
=====================
Apply these mechanically:

- If **Funding Ask & Use of Proceeds = 0**:
  - Business Investability Subtotal ≤ **15**
  - Total Score ≤ **70**

- If **no explicit numeric traction**:
  - Traction & KPIs ≤ **2**

- If **unit economics are conceptual only**:
  - Unit Economics & Profitability ≤ **2**
  - Supporting Evidence ≤ **3**

- If **competitive advantage is conceptual only**:
  - Competitive Advantage / Moat ≤ **2**

- If **no pricing, revenue, or margin numbers exist anywhere**:
  - Pitch Content ≤ **28**
  - Q&A Handling ≤ **20**
  - Business Investability ≤ **17**
  - Total Score ≤ **75**

=====================
SECTION INTENT & SCORING GUIDANCE
=====================

---------------------
1️⃣ INTRODUCTION (Max 10)
---------------------
Intent: **First-impression clarity**, not credibility proof.  
Ask: *Does the founder quickly explain what they do and why it matters?*

Score bands:
- **8–10**: Clear problem + audience + hook + early credibility
- **5–7**: Clear idea but weak hook or credibility
- **0–4**: Vague, generic, or rambling

🔹 Clarity of Speech (0–2)
- 2 only if explanation requires no clarification

🔹 Confidence & Presence (0–2)
- 2 only if calm and grounded (not performative)

🔹 Hook / Attention Grabber (0–2)
- 2 only if it reframes a problem or creates urgency

🔹 Relevance to Audience (0–2)
- 2 only if target user and pain are explicit

🔹 Personal Branding / Credibility (0–2)
- 2 only if founder–problem fit is stated
❌ Confidence alone does NOT justify a 2

Subtotal must not exceed 10.

---------------------
2️⃣ PITCH CONTENT (Max 35)
---------------------
Intent: **Does the idea logically make sense AND show proof?**  
Ask: *Would this survive first-pass diligence?*

Score bands:
- **28–35**: Clear logic + differentiation + evidence
- **20–27**: Strong idea, limited proof
- **<20**: Narrative-heavy, evidence-light

🔹 Structure & Flow (0–5)
- 5 only if pitch progresses logically without repetition

🔹 Clarity & Conciseness (0–5)
- 5 only if complex ideas are explained simply

🔹 Value Proposition (0–5)
- 5 only if value is specific AND differentiated

🔹 Supporting Evidence (0–5)
- 5 requires metrics, validation, or concrete examples
❌ Conceptual validation caps at **3**

🔹 Audience Engagement (0–4)
- Engagement alone does NOT justify high scores

🔹 Storytelling / Narrative (0–3)
- Strong storytelling cannot compensate for missing data

🔹 Persuasiveness (0–4)
- Logic > confidence

🔹 Creativity / Originality (0–4)
- Novel framing ≠ novel business

Subtotal must not exceed 35.

---------------------
3️⃣ Q&A HANDLING (Max 25)
---------------------
Intent: **Intellectual honesty under pressure**.  
Ask: *Can the founder defend the business rigorously?*

Score bands:
- **20–25**: Metric-backed, composed, precise
- **12–19**: Reasonable but shallow
- **<12**: Evasive, speculative, or defensive

🔹 Comprehension of Questions (0–5)
- 5 only if questions are answered directly

🔹 Clarity of Answers (0–5)
- Rambling caps at **3**

🔹 Accuracy / Knowledge Depth (0–5)
- Conceptual answers cap at **3**

🔹 Problem-Solving Ability (0–5)
- Hypotheticals without structure cap at **3**

🔹 Handling Challenging Questions (0–5)
- Calm deflection ≠ strong handling

Subtotal must not exceed 25.

---------------------
4️⃣ BUSINESS INVESTABILITY (Max 30)
---------------------
Intent: **Would you seriously invest TODAY?**  
This section is the most important.

Score bands:
- **25–30**: Rare, diligence-ready
- **18–24**: Interesting but risky
- **<18**: Too early or underdeveloped

🔹 Market Opportunity & TAM/SAM/SOM (0–6)
- 6 requires segmented, justified market sizing
❌ “Hundreds of billions” caps at **3**

🔹 Unit Economics & Profitability (0–6)
- 6 requires explicit pricing, costs, margins
❌ “Asset-light” caps at **2**

🔹 Revenue Model & Scalability (0–5)
- 5 requires revenue mechanics + constraints
❌ Platform claims cap at **3**

🔹 Competitive Advantage / Moat (0–5)
- 5 requires demonstrated defensibility
❌ Trust/network effects cap at **2**

🔹 Traction & KPIs (0–4)
- 4 requires metrics + momentum
❌ Qualitative traction caps at **2**

🔹 Team & Execution Capability (0–4)
- Passion ≠ execution proof

🔹 Funding Ask & Use of Proceeds (0–3)
- 0 if missing
- 3 only if tied to milestones

🔹 Risk Mitigation & Barriers (0–2)
- Risks without mitigation cap at **1**

Subtotal must not exceed 30.

=====================
FINAL EVALUATION MINDSET
=====================
You are judging **readiness for institutional capital now**, not potential someday.

Be skeptical.
Reward evidence.
Penalize ambiguity.
When uncertain, score lower and explain why.

Micro-parameter maximums:
{json.dumps(MICRO_MAX_SCORES, indent=2)}

Output ONLY valid JSON.
"""




# --------------------- SCORING HELPERS ---------------------
def compute_subtotals(scores: dict) -> dict:
    """Compute subtotals for each section and ensure scores are within bounds"""
    for section, micro in MICRO_MAX_SCORES.items():
        if section not in scores:
            scores[section] = {}

        subtotal = 0
        for k, max_val in micro.items():
            # Get the score, default to 0 if not present
            val = float(scores.get(section, {}).get(k, 0))
            # Ensure score is within bounds
            val = min(max(val, 0), max_val)
            subtotal += val
            scores[section][k] = val

        # Add subtotal to the section
        scores[section]["Subtotal"] = round(min(subtotal, SECTION_MAX[section]), 1)

    return scores


def finalize_scores(scores: dict) -> dict:
    """Calculate total score and business investability confidence"""
    total = sum(scores.get(s, {}).get("Subtotal", 0) for s in SECTION_MAX.keys())
    scores["Total Score"] = round(min(total, 100), 1)

    bi = scores.get("Business Investability", {}).get("Subtotal", 0)
    # Calculate confidence as percentage of max Business Investability score (25)
    scores["Business Investability Confidence"] = int(min((bi / 25) * 100, 100))

    return scores


# --------------------- MAIN ENDPOINT ---------------------
@app.post("/evaluate")
async def evaluate_pitch(req: PitchRequest):
    try:
        logging.info("🎯 Evaluating pitch transcript...")

        # Convert transcript to text format - using the correct field names
        transcript_text = "\n".join([f"{m.role}: {m.content}" for m in req.transcript])
        logging.info(f"Transcript length: {len(transcript_text)} characters")
        logging.info(f"Number of messages: {len(req.transcript)}")
        logging.info(
            f"Sample message: role={req.transcript[0].role}, content={req.transcript[0].content[:50]}..."
        )

        # Call OpenAI API
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=TEMPERATURE,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Analyze the following transcript and return a strict JSON object as defined above:\n\n{transcript_text}",
                },
            ],
        )

        content = completion.choices[0].message.content.strip()
        logging.info(f"Raw API response: {content}")

        result = json.loads(content)

        if "scores" in result:
            result["scores"] = compute_subtotals(result["scores"])
            result["scores"] = finalize_scores(result["scores"])

        return result

    except json.JSONDecodeError as e:
        logging.error(f"JSON decode error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to parse AI response: {str(e)}"
        )
    except Exception as e:
        logging.exception("❌ Pitch evaluation failed.")
        raise HTTPException(status_code=500, detail=str(e))




SYSTEM_PROMPT_TOURNAMENT = """
You are a TOURNAMENT VC JUDGE evaluating early-stage startup pitches in a COMPETITIVE ranking environment.

IMPORTANT CONTEXT:
- This is NOT a demo or feedback session.
- This is a TOURNAMENT where only the TOP 10–15 percent of startups deserve high scores.


You must be STRICT, SKEPTICAL, and DATA-DRIVEN.

CRITICAL RULES:
- DO NOT assume any information not explicitly stated in the transcript.
- DO NOT infer traction, revenue, customers, or differentiation unless clearly mentioned.
- Penalize vague language, buzzwords, optimism, and future promises.
- Penalize missing metrics heavily.
- If a dimension is weak or unclear, score it BELOW average.
- If something is not mentioned, score it LOW, not neutral.


Evaluate strictly across the 6 dimensions:

1. Problem & Market Opportunity (0–20)
   - Is the problem specific, painful, and urgent?
   - Is the target customer clearly defined?
   - Is the market size justified or just claimed?

2. Solution & Innovation (0–20)
   - Is the solution clearly explained?
   - Is there real differentiation or just “AI / platform” language?
   - Is the approach defensible or easily copyable?

3. Business Model & Scalability (0–15)
   - Is pricing defined and realistic?
   - Is there a clear path to scale?
   - Are unit economics or distribution mentioned?

4. Team & Execution Capability (0–20)
   - Does the team show relevant domain or execution credibility?
   - Is capability proven or just claimed?
   - Penalize “we will learn / figure it out” heavily.

5. Traction & Validation (0–15)
   - Are users, revenue, pilots, LOIs, or experiments mentioned?
   - Opinions, interest, or intent ≠ traction.
   - If no real validation is shown, score VERY LOW.

6. Pitch Quality & Communication (0–10)
   - Is the pitch structured, concise, and clear?
   - Are answers direct or evasive?
   - Penalize rambling and generic statements.

OUTPUT REQUIREMENTS (MANDATORY):
- Return STRICTLY valid JSON.
- DO NOT include explanations outside JSON.
- Scores must be integers.
- Total Score MUST equal the sum of subtotals.
- Business Investability Confidence should reflect how likely YOU would invest TODAY, not in the future.

RETURN FORMAT (STRICT):

{
  "scores": {
    "PROBLEM & MARKET OPPORTUNITY": { "Subtotal": 0 },
    "SOLUTION & INNOVATION": { "Subtotal": 0 },
    "BUSINESS MODEL & SCALABILITY": { "Subtotal": 0 },
    "TEAM & EXECUTION CAPABILITY": { "Subtotal": 0 },
    "TRACTION & VALIDATION": { "Subtotal": 0 },
    "PITCH QUALITY & COMMUNICATION": { "Subtotal": 0 },
    "Total Score": 0,
    "Business Investability Confidence": 0
  },
  "summary": "Blunt, tournament-style assessment highlighting why this pitch ranks high or low relative to other competitors."
}

TONE:
- Sharp, factual, and unemotional.
- Think like a VC ranking 100 startups and forced to fund only 5.

"""



SYSTEM_PROMPT_OVERVIEW = """
You are an expert Venture Capital Analyst.
Your task is to analyze a startup pitch transcript and generate a structured "Pitch Overview".

You must extract key information into a valid JSON object.

**JSON Structure:**
{
  "oneLiner": "A single, impactful sentence describing what the startup does.",
  "problem": "What pain point are they solving?",
  "solution": "How does their product/service solve it?",
  "market": "Target market and industry sector.",
  "keyMetrics": "Revenue, Users, Growth, etc. (or 'No specific metrics mentioned')",
  "businessModel": "How they make money.",
  "ask": "Funding ask and valuation (or 'Not mentioned').",
  "team": "Founder background or team info (or 'Not mentioned').",
  "analystTake": "Your 1-2 sentence professional assessment."
}

**Rules:**
- Return ONLY valid JSON.
- Do not include markdown code blocks (```json).
- Be concise and professional.
- Do NOT hallucinate information.
"""


# --------------------- CORE FUNCTION ---------------------
def evaluate_pitch_tournament(transcript_text: str) -> dict:
    """Send pitch transcript to GPT model and get structured evaluation."""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=TEMPERATURE,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_TOURNAMENT},
                {"role": "user", "content": f"Pitch Transcript:\n{transcript_text}"}
            ],
        )

        response_text = response.choices[0].message.content.strip()

        # Attempt to parse the JSON
        try:
            result = json.loads(response_text)
        except json.JSONDecodeError:
            logging.warning("⚠️ Invalid JSON detected. Attempting to extract JSON substring.")
            try:
                json_str = response_text[response_text.index("{"):response_text.rindex("}") + 1]
                result = json.loads(json_str)
            except Exception:
                result = {"error": "Invalid JSON returned", "raw_response": response_text}

    except Exception as e:
        logging.error(f"💥 OpenAI API Error: {e}")
        raise HTTPException(status_code=500, detail=f"Model evaluation failed: {str(e)}")

    return result


# --------------------- ROUTES ---------------------
@app.post("/evaluate-competition")
async def evaluate_pitch_api(req: PitchRequest):
    """
    Evaluate a startup pitch transcript for tournament using the AI VC Judge.
    Returns: JSON score and summary
    """

    transcript_text = "\n".join([f"{m.role}: {m.content}" for m in req.transcript])

    result = evaluate_pitch_tournament(transcript_text)
    return result


@app.post("/generate-overview")
async def generate_pitch_overview(req: PitchRequest):
    """
    Generate a VC-focused overview of a pitch transcript.
    Returns: JSON with "overview" field containing markdown summary.
    """
    try:
        logging.info("📝 Generating pitch overview...")
        transcript_text = "\n".join([f"{m.role}: {m.content}" for m in req.transcript])

        completion = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_OVERVIEW},
                {
                    "role": "user",
                    "content": f"Analyze the following transcript and generate the overview JSON:\n\n{transcript_text}",
                },
            ],
        )

        overview_json = completion.choices[0].message.content.strip()
        # Parse text to ensure it's valid dict, though client should return string
        try:
             overview_data = json.loads(overview_json)
        except:
             overview_data = {"error": "Failed to parse overview"}

        return {"overview": overview_data}

    except Exception as e:
        logging.exception("❌ Pitch overview generation failed.")
        raise HTTPException(status_code=500, detail=str(e))



# --------------------- VALUATION ENGINE ---------------------

# --------------------------------------------------
# AI EXPLANATION (STRICT JSON)
# --------------------------------------------------
def generate_narrative_explanation(result):
    # Check if Berkus method exists in the data
    has_berkus = "berkus" in result.get("valuations", {})
    
    berkus_field = '"berkus": "explanation text",' if has_berkus else ""
    
    prompt = f"""
You are a senior venture capitalist writing an investment-grade explanation.

ABSOLUTE RULES:
- ALL monetary values are in INR (₹)
- EVERY field must be explained in natural language
- Do NOT hallucinate or invent numbers
- Each JSON value must be a paragraph of explanation
- Professional VC tone, no bullet points
- Only include fields that exist in the ground truth data

Return STRICT JSON in exactly this structure:

{{
  "valuations": {{
    {berkus_field}
    "scorecard": "explanation text",
    "vc_method": {{
      "pre_money": "explanation text",
    }},
    "risk_factor": "explanation text",
    "recommended_pre_money": "explanation text"
  }},
  "projections": {{
    "annual_revenue": "explanation text",
    "runway_months": "explaination text(if Null, then it means the company wont go bankrupt.. and has enough funds thus give explaination accordingly)"
  }},
  "overall_summary": "concise investment conclusion"
}}

GROUND TRUTH DATA (DO NOT CHANGE NUMBERS):
{json.dumps(result, indent=2)}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.15,
        response_format={"type": "json_object"},  # ✅ SINGLE BRACES
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return json.loads(response.choices[0].message.content)


# --------------------------------------------------
# API
# --------------------------------------------------

@app.post("/valuation-report")
def valuation_report(data: UniversalValuationInput):
    valuations = run_valuation(data)
    projections = run_projections(data)

    combined = {
        "valuations": valuations,
        "projections": projections
    }

    explanations = generate_narrative_explanation(combined)

    return {
        "valuations": valuations,
        "projections": projections,
        "explanations": explanations
    }

def five_min_summary(transcript_text: str) -> dict:
    """
    Generate a concise 5-minute summary of a startup pitch transcript.
    Highlights main discussion points in a simple paragraph.
    """

    prompt = f"""
    Summarize the following startup pitch discussion in one short, clear paragraph.
    Highlight what was discussed, key ideas, product, market, problem, and any notable points.
    Keep the language simple and non-technical.

    Transcript:
    {transcript_text}
    """

    response = client.chat.completions.create(
        model=MODEL_NAME,
        temperature=TEMPERATURE,
        messages=[
            {"role": "system", "content": "You are a helpful startup analyst."},
            {"role": "user", "content": prompt}
        ],
    )

    summary_text = response.choices[0].message.content.strip()

    return {
        "summary": summary_text
    }

@app.post("/5minsummmary")
async def evaluate_pitch_api(req: PitchRequest):
    """
    Generate a 5-minute summary of the startup pitch transcript.
    """
    print(req.transcript)
    transcript_text = "\n".join(
        [f"{m.role}: {m.content}" for m in req.transcript]
    )

    result = five_min_summary(transcript_text)
    return result

# --------------------- AVATAR GENERATION ---------------------

# Avatar generation prompt
AVATAR_PROMPT = """
You are a professional avatar and portrait designer.

TASK:
Given ANY real human photo as input, transform the person into a
high-quality, front-facing, cartoon-style yet realistic professional avatar.

This prompt must work for ALL input photos regardless of original clothing,
background, angle, or lighting.

MANDATORY TRANSFORMATIONS:
- Replace the original outfit with a formal business suit or blazer
- Add a light-colored formal shirt (white or light blue)
- Modern minimal tie (VC / executive style)
- Ensure the subject is FRONT-FACING, looking directly at the camera
- Adjust pose if needed to achieve a clean chest-up professional portrait

STYLE GUIDELINES:
- Cartoon-inspired illustration with realistic facial proportions
- Clean, smooth shading (not exaggerated, not anime)
- Semi-realistic vector style (Pixar-meets-LinkedIn)
- Professional, confident, approachable appearance

IDENTITY PRESERVATION (CRITICAL – MUST NOT FAIL):
- The avatar MUST look EXACTLY like the person in the uploaded photo
- Preserve facial structure, skin tone, hairstyle, hairline, eye shape,
  eyebrow shape, nose, lips, jawline, and facial symmetry
- Maintain the person's natural imperfections and unique features
- Do NOT change gender, ethnicity, age group, or facial proportions
- Do NOT beautify, slim, idealize, or stylize the face unnaturally
- The person must be instantly recognizable as the same individual

POSE & FRAMING:
- Chest-up portrait (profile-picture ready)
- Face centered and clearly visible
- Neutral confident expression or slight professional smile
- Head upright, symmetrical, and properly aligned

CIRCULAR FRAME REQUIREMENT (MANDATORY):
- The final output MUST be cropped into a perfect circular frame
- Avatar must be centered within the circle (WhatsApp / LinkedIn DP style)
- Head and shoulders should fit cleanly inside the circular crop
- No important facial features should be cut off by the circular boundary
- Background must fill the circular frame cleanly

BACKGROUND:
- Clean, minimal background
- Soft gradient or solid neutral tone
- Corporate / LinkedIn-friendly aesthetic
- No distractions

LIGHTING & QUALITY:
- Studio-quality soft lighting
- Even illumination across face
- Balanced contrast
- High sharpness and clarity
- No harsh shadows, blur, or noise

STRICT RULES:
- No text, logos, or watermarks
- No props or accessories
- No exaggerated caricature effects
- No artistic abstraction or distortion
- Output must be a SINGLE polished avatar image

GOAL:
Produce a realistic cartoon-style professional avatar that looks
trustworthy, modern, and suitable for LinkedIn, VC profiles,
startup founders, executives, and corporate use.
"""

def regenerate_image_with_gemini(pil_image: Image.Image, session_id: str) -> Dict:
    """Generate professional avatar using Gemini AI"""
    logger = logging.getLogger("AvatarGeneration")
    logger.info("🎨 Generating 3 avatar variations using Gemini (flash-image)")
    
    try:
        variations: List[Dict] = []
        
        # Generate 3 variations by calling Gemini 3 times
        for i in range(3):
            try:
                logger.info(f"📸 Generating variation {i+1}/3...")
                response = gemini_client.models.generate_content(
                    model="gemini-2.5-flash-image",
                    contents=[AVATAR_PROMPT, pil_image],
                )
                
                for part in response.parts:
                    # Extract image bytes from Gemini response
                    if part.inline_data and part.inline_data.data:
                        out_bytes = part.inline_data.data
                        variations.append({
                            "base64": base64.b64encode(out_bytes).decode()
                        })
                        break  # Only take first image from each call
                        
            except Exception as e:
                logger.warning(f"⚠️ Failed to generate variation {i+1}: {e}")
                # Continue to try generating remaining variations
        
        if not variations:
            raise RuntimeError("Gemini returned no images")
        
        logger.info(f"✅ Generated {len(variations)} avatar variation(s)")
        
        return {
            "session_id": session_id,
            "variations": variations
        }
    
    except Exception as e:
        logger.exception("❌ Avatar generation failed")
        raise HTTPException(status_code=500, detail=f"Avatar generation failed: {str(e)}")


@app.post("/image/regenerate")
async def regenerate_avatar(image: UploadFile = File(...)):
    """
    Generate professional avatar from uploaded photo
    
    Accepts: Image file (JPEG, PNG, etc.)
    Returns: JSON with base64-encoded avatar variations
    """
    try:
        # Read and validate image
        image_bytes = await image.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        # Convert to PIL Image
        pil_image = Image.open(BytesIO(image_bytes)).convert("RGBA")
        session_id = str(uuid.uuid4())
        
        # Generate avatar
        result = regenerate_image_with_gemini(pil_image, session_id)
        
        return {"status": "success", "data": result}
    
    except HTTPException:
        raise
    except Exception as e:
        logging.exception("❌ Avatar regeneration endpoint failed")
        raise HTTPException(status_code=500, detail=str(e))

from api.tools.improvement_engine import generate_section_improvement
@app.post("/pitch/improvements")
async def pitch_improvements(
    transcript: str = Form(...),
    scores: str = Form(...)
):
    """
    multipart/form-data
    transcript -> JSON string
    scores     -> JSON string
    """

    try:
        transcript_data = json.loads(transcript)
        scores_data = json.loads(scores)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid JSON in transcript or scores"
        )

    if "transcript" not in transcript_data:
        raise HTTPException(
            status_code=400,
            detail="transcript field missing inside transcript JSON"
        )

    results = {}

    for section, criteria in scores_data.get("scores", {}).items():
        if section in ["Total Score", "Business Investability Confidence"]:
            continue

        improvement = generate_section_improvement(
            transcript=transcript_data["transcript"],
            section=section,
            criteria=criteria
        )

        results[section] = improvement

    return {
        "section_wise_improvements": results
    }

# --------------------- ROOT ---------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "Pitch Evaluation API is running 🚀"}


# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Pitch Evaluation API"}