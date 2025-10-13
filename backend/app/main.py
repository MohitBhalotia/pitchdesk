import os
import json
import logging
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Form
from typing import List, Optional


# --------------------- CONFIG ---------------------
load_dotenv(override=True)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
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
    header = f"""
You are a world-class startup pitch strategist trusted by top-tier venture capital firms to help founders craft pitches that are crisp, credible, and investor-ready.

Your job is to read the detailed information provided by the founder and generate a compelling, structured pitch. The pitch should cover the full spectrum of what VCs want to hear, including: the problem, solution, market, product, traction, business model, team, competition, financials, and future vision.

**Guidelines:**
- Make the pitch persuasive and visionary, yet grounded in logic and realistic strategy.
- Use clear section headers (like a pitch deck structure).
- Use confident, founder-style language (no passive tone or robotic output).
- Focus on clarity, differentiation, and strong narrative.
- Avoid generic or vague language—be specific and memorable.

Some of the best pitches from where you can take references on how to write a pitch: are:
these are just refernces. The pitch has to be in First person perspective as if the founder is gonna speak it in front of the VCs.
Dont give any sections. just a perfect pitch.

dont give any html and also no introduction like here is a pitch.
just give a deliverable ready pitch.

Below is the information shared by the founder:
"""

    founder_data = ""
    for key, value in data.items():
        if value:
            section_title = key.replace('_', ' ').title()
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
    supportingMaterials: Optional[str] = Form(None)
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
            {"role": "system", "content": "You are a VC pitch expert helping startups write strong, fundable pitches."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        
    )

    pitch_text = response.choices[0].message.content.strip()
    return {"pitch": pitch_text}


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

# --------------------- MAX SCORES ---------------------
MICRO_MAX_SCORES = {
    "Introduction": {
        "Clarity of Speech": 2,
        "Confidence & Presence": 2,
        "Hook / Attention Grabber": 2,
        "Relevance to Audience": 2,
        "Personal Branding / Credibility": 2
    },
    "Pitch Content": {
        "Structure & Flow": 5,
        "Clarity & Conciseness": 5,
        "Value Proposition": 5,
        "Supporting Evidence": 5,
        "Audience Engagement": 4,
        "Storytelling / Narrative": 3,
        "Persuasiveness": 4,
        "Creativity / Originality": 4
    },
    "Q&A Handling": {
        "Comprehension of Questions": 5,
        "Clarity of Answers": 5,
        "Accuracy / Knowledge Depth": 5,
        "Problem-Solving Ability": 5,
        "Handling Challenging Questions": 5
    },
    "Delivery & Style": {
        "Voice Modulation": 2,
        "Energy & Enthusiasm": 2,
        "Language Fluency": 1
    },
    "Business Investability": {
        "Market Opportunity & TAM/SAM/SOM": 5,
        "Unit Economics & Profitability": 4,
        "Revenue Model & Scalability": 4,
        "Competitive Advantage / Moat": 3,
        "Traction & KPIs": 3,
        "Team & Execution Capability": 4,
        "Funding Ask & Use of Proceeds": 1,
        "Risk Mitigation & Barriers": 1
    }
}

SECTION_MAX = {s: sum(m.values()) for s, m in MICRO_MAX_SCORES.items()}

# --------------------- SYSTEM PROMPT ---------------------
SYSTEM_PROMPT = f"""
You are a strict AI startup pitch evaluator.

You will receive a pitch transcript and must output a **strict JSON object only** following this structure:
{{
  "scores": {{
    "Introduction": {{ ... , "Subtotal": 0-10 }},
    "Pitch Content": {{ ... , "Subtotal": 0-35 }},
    "Q&A Handling": {{ ... , "Subtotal": 0-25 }},
    "Delivery & Style": {{ ... , "Subtotal": 0-5 }},
    "Business Investability": {{ ... , "Subtotal": 0-25 }},
    "Total Score": 0-100,
    "Business Investability Confidence": 0-100
  }},
  "summary": "Brief summary of strengths, weaknesses, and investment factors."
}}

Rules:
- Never include non-JSON text before or after the object.
- Strictly stay within each micro-parameter's maximum.
- Penalize vague, generic, or incomplete answers.
- Round all subtotals to 1 decimal place.
- Total Score = sum of all subtotals (max 100).
- Business Investability Confidence = (Business Investability Subtotal / 25) * 80.
- Give lower scores to encourage improvement.

Micro-parameter maximums:
{json.dumps(MICRO_MAX_SCORES, indent=2)}
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
        logging.info(f"Sample message: role={req.transcript[0].role}, content={req.transcript[0].content[:50]}...")

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
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        logging.exception("❌ Pitch evaluation failed.")
        raise HTTPException(status_code=500, detail=str(e))

# --------------------- ROOT ---------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "Pitch Evaluation API is running 🚀"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Pitch Evaluation API"}
