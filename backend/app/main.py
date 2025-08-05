# from fastapi import FastAPI
# from pydantic import BaseModel
# from typing import Optional
# from dotenv import load_dotenv
# from openai import OpenAI
# import os
# from fastapi.middleware.cors import CORSMiddleware

# load_dotenv(override=True)
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Or ["http://localhost:3000"] for stricter security
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# class BusinessIdeaData(BaseModel):
#     companyName: str
#     tagline: Optional[str] = None
#     industry: Optional[str] = None
#     founded: Optional[str] = None
#     headquarters: Optional[str] = None
#     website: Optional[str] = None

#     problemStatement: Optional[str] = None
#     solutionDescription: Optional[str] = None
#     uniqueValueProposition: Optional[str] = None

#     totalAddressableMarket: Optional[str] = None
#     serviceableAddressableMarket: Optional[str] = None
#     serviceableObtainableMarket: Optional[str] = None
#     marketGrowthRate: Optional[str] = None

#     directCompetitors: Optional[str] = None
#     indirectCompetitors: Optional[str] = None
#     competitiveAdvantage: Optional[str] = None
#     barrierToEntry: Optional[str] = None

#     historicalRevenue: Optional[str] = None
#     historicalExpenses: Optional[str] = None
#     profitabilityStatus: Optional[str] = None

#     totalCustomers: Optional[str] = None
#     customerAcquisitionCost: Optional[str] = None
#     customerLifetimeValue: Optional[str] = None
#     churnRate: Optional[str] = None

#     grossMargin: Optional[str] = None
#     contributionMargin: Optional[str] = None
#     paybackPeriod: Optional[str] = None

#     year1Revenue: Optional[str] = None
#     year2Revenue: Optional[str] = None
#     year3Revenue: Optional[str] = None
#     revenueGrowthRate: Optional[str] = None

#     operatingExpenses: Optional[str] = None
#     marketingBudget: Optional[str] = None
#     rdExpenses: Optional[str] = None

#     primaryRevenueStreams: Optional[str] = None
#     pricingModel: Optional[str] = None
#     salesChannels: Optional[str] = None

#     businessOperations: Optional[str] = None
#     technologyStack: Optional[str] = None
#     keyPartnerships: Optional[str] = None

#     foundingTeam: Optional[str] = None
#     founderExperience: Optional[str] = None
#     keyPersonnel: Optional[str] = None
#     advisors: Optional[str] = None

#     productStage: Optional[str] = None
#     developmentMilestones: Optional[str] = None

#     customerValidation: Optional[str] = None
#     pilotPrograms: Optional[str] = None
#     businessTraction: Optional[str] = None
#     partnerships: Optional[str] = None

#     previousFunding: Optional[str] = None
#     currentInvestors: Optional[str] = None

#     fundingGoal: Optional[str] = None
#     useOfFunds: Optional[str] = None
#     valuation: Optional[str] = None

#     futureStrategy: Optional[str] = None
#     exitStrategy: Optional[str] = None

#     keyMetrics: Optional[str] = None
#     riskFactors: Optional[str] = None

#     personalStory: Optional[str] = None
#     supportingMaterials: Optional[str] = None

# def generate_prompt(data: dict) -> str:
#     header = f"""
# You are a world-class startup pitch strategist trusted by top-tier venture capital firms to help founders craft pitches that are crisp, credible, and investor-ready.

# Your job is to read the detailed information provided by the founder and generate a compelling, structured pitch. The pitch should cover the full spectrum of what VCs want to hear, including: the problem, solution, market, product, traction, business model, team, competition, financials, and future vision.

# **Guidelines:**
# - Make the pitch persuasive and visionary, yet grounded in logic and realistic strategy.
# - Use clear section headers (like a pitch deck structure).
# - Use confident, founder-style language (no passive tone or robotic output).
# - Focus on clarity, differentiation, and strong narrative.
# - Avoid generic or vague language—be specific and memorable.

# Some of the best pitches from where you can take references on how to write a pitch: are:
# these are just refernces. The pitch has to be in First person perspective as if the founder is gonna speak it in front of the VCs.
# Dont give any sections. just a perfect pitch.

# dont give any html and also no introduction like here is a pitch.
# just give a deliverable ready pitch.

# Below is the information shared by the founder:
# """

#     founder_data = ""
#     for key, value in data.items():
#         if value:
#             section_title = key.replace('_', ' ').title()
#             founder_data += f"\n### {section_title}:\n{value.strip()}\n"

#     closing = "\nNow, using the information above, generate a powerful, investor-grade startup pitch ready to be delivered to VCs.Make sure its atleast a 3 minute speech.\n"
#     return header.strip() + founder_data + closing

# @app.post("/generate-pitch")
# async def generate_pitch(data: BusinessIdeaData):
#     data_dict = data.dict()
#     prompt = generate_prompt(data_dict)

#     response = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": "You are a VC pitch expert helping startups write strong, fundable pitches."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.7,
#     )

#     pitch_text = response.choices[0].message.content.strip()
#     return {"result": pitch_text}


# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional
# import os
# from openai import OpenAI
# from dotenv import load_dotenv

# load_dotenv()
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Or ["http://localhost:3000"] for stricter security
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class BusinessIdeaData(BaseModel):
#     problem: str
#     solution: str
#     market: str
#     product: str
#     traction: str
#     business_model: str
#     team: str
#     competition: str
#     financials: str
#     future_vision: str

# class PitchResponse(BaseModel):
#     success: bool
#     pitch: Optional[str] = None
#     error: Optional[str] = None

# @app.post("/generate-pitch")
# async def generate_pitch():
#     try:
#         def generate_prompt(d: dict) -> str:
#             header = """
# You are a world-class startup pitch strategist trusted by top-tier venture capital firms to help founders craft pitches that are crisp, credible, and investor-ready.

# Your job is to read the detailed information provided by the founder and generate a compelling, structured pitch. The pitch should cover the full spectrum of what VCs want to hear, including: the problem, solution, market, product, traction, business model, team, competition, financials, and future vision.

# **Guidelines:**
# - Make the pitch persuasive and visionary, yet grounded in logic and realistic strategy.
# - Use clear section headers (like a pitch deck structure).
# - Use confident, founder-style language (no passive tone or robotic output).
# - Focus on clarity, differentiation, and strong narrative.
# - Avoid generic or vague language—be specific and memorable.

# Some of the best pitches from where you can take references on how to write a pitch: are:
# these are just refernces. The pitch has to be in First person perspective as if the founder is gonna speak it in front of the VCs.
# Dont give any sections. just a perfect pitch.

# dont give any html and also no introduction like here is a pitch.
# just give a deliverable ready pitch.

# Below is the information shared by the founder:
# """.strip()

#             founder_data = ""
#             for key, value in d.items():
#                 if value:
#                     section_title = key.replace('_', ' ').title()
#                     founder_data += f"\n### {section_title}:\n{value.strip()}\n"

#             closing = "\nNow, using the information above, generate a powerful, investor-grade startup pitch ready to be delivered to VCs. Make sure it's at least a 3-minute speech.\n"
#             return header + founder_data + closing

#         prompt = generate_prompt(data.dict())

#         response = client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {"role": "system", "content": "You are a VC pitch expert helping startups write strong, fundable pitches."},
#                 {"role": "user", "content": prompt}
#             ],
#             temperature=0.7,
#         )

#         pitch_text = response.choices[0].message.content.strip()
#         return {"success": True, "pitch": pitch_text}

#     except Exception as e:
#         return {"success": False, "error": str(e)}


import os
from fastapi import FastAPI, Form
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
#from groq import Groq
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(override=True)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()
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
