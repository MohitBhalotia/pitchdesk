import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv


# --------------------------------------------------
# INPUT MODEL
# --------------------------------------------------
class UniversalValuationInput(BaseModel):
    stage_of_business: str            # pre_revenue | early_revenue | growth
    sector: str

    team_strength: str                # weak | average | strong
    market_size: str                  # niche | medium | large
    competitive_position: str         # weak | moderate | strong

    product_stage: Optional[str] = None

    customers: Optional[int] = None
    monthly_revenue: Optional[float] = None
    monthly_growth_rate: Optional[float] = None
    monthly_churn_rate: Optional[float] = None

    # QUALITY INPUTS (NEW)
    gross_margin: Optional[float] = None          # 0–1
    monthly_burn: Optional[float] = None          # INR
    top_3_customers_percent: Optional[float] = None  # %

    # ASSETS
    fixed_assets_value: Optional[float] = 0

# --------------------------------------------------
# SECTOR MULTIPLES
# --------------------------------------------------
SECTOR_ARR_MULTIPLES = { "agriculture_natural_resources": (2, 4), "mining_oil_gas": (2, 4), "manufacturing": (2, 5), "food_consumer_goods": (1.5, 3), "construction_infrastructure": (1.5, 3), "transportation_logistics": (2, 4), "retail_wholesale": (1, 2), "ecommerce_marketplaces": (2, 4), "hospitality_tourism": (1.5, 3), "healthcare_life_sciences": (2, 4), "pharmaceuticals_biotechnology": (6, 10), "education_edtech": (2, 5), "information_technology_software": (5, 9), "artificial_intelligence_data": (8, 15), "financial_services_banking": (1.5, 3), "fintech_payments": (4, 7), "insurance": (2, 4), "real_estate_proptech": (2, 4), "media_entertainment_gaming": (3, 6), "marketing_advertising_creator": (3, 6), "professional_consulting_services": (1.5, 3), "energy_ev_climatetech": (5, 10), "government_public_ngos": (1, 2), "research_innovation_deeptech": (6, 12), "space_advanced_technologies": (7, 14) }

# --------------------------------------------------
# TAM (RELATIVE, FOR NORMALIZATION)
# --------------------------------------------------
SECTOR_TAM = { "agriculture_natural_resources": 15, "mining_oil_gas": 2, "manufacturing": 16, "food_consumer_goods": 8, "construction_infrastructure": 12, "transportation_logistics": 9.5, "retail_wholesale": 25, "ecommerce_marketplaces": 6.5, "hospitality_tourism": 8, "healthcare_life_sciences": 12.5, "pharmaceuticals_biotechnology": 1.7, "education_edtech": 10, "information_technology_software": 5.5, "artificial_intelligence_data": 2.5, "financial_services_banking": 20, "fintech_payments": 1.5, "insurance": 6, "real_estate_proptech": 11, "media_entertainment_gaming": 2, "marketing_advertising_creator": 1, "professional_consulting_services": 3.5, "energy_ev_climatetech": 8.5, "government_public_ngos": 50, "research_innovation_deeptech": 2.5, "space_advanced_technologies": 0.5 }

# --------------------------------------------------
# PRE-REVENUE FLOOR (INR)
# --------------------------------------------------
PRE_REVENUE_FLOOR = {
    # Primary & Heavy Industries
    "agriculture_natural_resources": 3_500_000,
    "mining_oil_gas": 5_000_000,
    "manufacturing": 4_000_000,
    "construction_infrastructure": 4_500_000,
    "transportation_logistics": 4_000_000,

    # Consumer & Commerce
    "food_consumer_goods": 3_500_000,
    "retail_wholesale": 3_000_000,
    "ecommerce_marketplaces": 4_500_000,
    "hospitality_tourism": 3_000_000,

    # Healthcare & Life Sciences
    "healthcare_life_sciences": 5_000_000,
    "pharmaceuticals_biotechnology": 8_000_000,

    # Education & Services
    "education_edtech": 4_000_000,
    "professional_consulting_services": 3_000_000,
    "marketing_advertising_creator": 3_000_000,

    # Technology & Software
    "information_technology_software": 6_000_000,
    "artificial_intelligence_data": 7_000_000,
    "fintech_payments": 5_000_000,
    "financial_services_banking": 4_500_000,
    "insurance": 4_500_000,

    # Property & Media
    "real_estate_proptech": 5_000_000,
    "media_entertainment_gaming": 4_000_000,

    # Energy, Climate & Public
    "energy_ev_climatetech": 6_000_000,
    "government_public_ngos": 3_000_000,

    # DeepTech & Frontier
    "research_innovation_deeptech": 6_500_000,
    "space_advanced_technologies": 7_500_000,
}


# --------------------------------------------------
# SCORES
# --------------------------------------------------
TEAM_SCORE = {"weak": 0.85, "average": 1.0, "strong": 1.15}
MARKET_SCORE = {"niche": 0.85, "medium": 1.0, "large": 1.15}
COMP_SCORE = {"weak": 0.9, "moderate": 1.0, "strong": 1.1}
PRODUCT_SCORE = {"idea": 0.85, "prototype": 1.0, "MVP": 1.15}

# --------------------------------------------------
# ASSET WEIGHTS
# --------------------------------------------------
ASSET_WEIGHT = {
    "manufacturing": 0.6,
    "healthcare_life_sciences": 0.7,
    "pharmaceuticals_biotechnology": 0.6,
    "energy_ev_climatetech": 0.6,
    "real_estate_proptech": 0.75,
}
DEFAULT_ASSET_WEIGHT = 0.3

# --------------------------------------------------
# HELPERS
# --------------------------------------------------
# --------------------------------------------------
# 12-MONTH FINANCIAL PROJECTIONS
# --------------------------------------------------
def run_projections(d: UniversalValuationInput):
    MONTHS = 12

    # -------- SAFETY DEFAULTS --------
    customers = d.customers or 100
    revenue = d.monthly_revenue or 0
    growth = d.monthly_growth_rate or 0.04
    churn = d.monthly_churn_rate or 0.02
    margin = d.gross_margin or 0.5
    burn = d.monthly_burn or 0

    # Cost assumptions
    fixed_cost = burn if burn > 0 else revenue * (1 - margin)
    variable_cost_per_customer = (
        (revenue * (1 - margin)) / max(customers, 1)
        if customers > 0 else 0
    )

    cash = 200_000  # conservative opening cash buffer

    monthly = []

    for m in range(1, MONTHS + 1):
        customers = customers * (1 + growth) * (1 - churn)

        arpu = revenue / max(d.customers or customers, 1)
        revenue = customers * arpu

        gross_profit = revenue * margin
        total_cost = fixed_cost + (customers * variable_cost_per_customer)
        net_profit = revenue - total_cost

        cash += net_profit

        monthly.append({
            "month": m,
            "customers": int(customers),
            "revenue": round(revenue, 2),
            "gross_profit": round(gross_profit, 2),
            "net_profit": round(net_profit, 2),
            "cash_balance": round(cash, 2)
        })

    # -------- RUNWAY --------
    recent_months = monthly[-3:]  # last 3 months
    recent_losses = [m["net_profit"] for m in recent_months if m["net_profit"] < 0]

    if not recent_losses:
        runway = None  # profitable or breakeven business
    else:
        avg_burn = abs(sum(recent_losses) / len(recent_losses))
        runway = round(cash / avg_burn, 2)


    return {
        "monthly": monthly,
        "annual_revenue": round(sum(p["revenue"] for p in monthly), 2),
        "runway_months": runway
    }

def tam_multiplier(sector, market_size):
    tam = SECTOR_TAM[sector]
    expected = "large" if tam >= 15 else "medium" if tam >= 5 else "niche"
    if market_size == expected:
        return 1.0
    if market_size == "large" and expected != "large":
        return 0.85
    if market_size == "niche" and expected == "large":
        return 1.1
    return 0.95

def conviction(d):
    return (
        TEAM_SCORE[d.team_strength] *
        MARKET_SCORE[d.market_size] *
        COMP_SCORE[d.competitive_position] *
        tam_multiplier(d.sector, d.market_size)
    )

def margin_multiplier(margin, sector):
    if margin is None:
        return 0.9
    ideal = 0.4 if sector == "manufacturing" else 0.65
    if margin >= ideal:
        return 1.1
    if margin >= ideal * 0.7:
        return 1.0
    return 0.85

def concentration_penalty(pct):
    if pct is None:
        return 1.0
    if pct > 60:
        return 0.8
    if pct > 40:
        return 0.9
    return 1.0

def burn_efficiency(revenue, burn):
    if burn is None or burn <= 0:
        return 1.05
    burn_multiple = burn / max(revenue, 1)
    if burn_multiple <= 1:
        return 1.0
    if burn_multiple <= 1.5:
        return 0.95
    return 0.85

# --------------------------------------------------
# VALUATION ENGINE
# --------------------------------------------------
def run_valuation(d: UniversalValuationInput):
    c = conviction(d)

    asset_weight = ASSET_WEIGHT.get(d.sector, DEFAULT_ASSET_WEIGHT)
    asset_value = (d.fixed_assets_value or 0) * asset_weight

    # ---------- PRE-REVENUE ----------
    if d.stage_of_business == "pre_revenue":
        base = PRE_REVENUE_FLOOR[d.sector] * PRODUCT_SCORE[d.product_stage]
        final = (base * c) + asset_value
        final=final*0.80

        return {
            "scorecard": final,
            "cost_to_duplicate": 500_000,
            "vc_method": {"pre_money": final, "post_money": final * 1.2},
            "risk_factor": final * 0.9,
            "recommended_pre_money": round(final, 2)
        }

    # ---------- EARLY / GROWTH ----------
    arr = d.monthly_revenue * 12
    low, high = SECTOR_ARR_MULTIPLES[d.sector]

    growth_bonus = min((d.monthly_growth_rate or 0) * 2, 0.25)
    churn_penalty = 0.15 if (d.monthly_churn_rate or 0) > 0.05 else 0

    base_multiple = low + (high - low) * (growth_bonus + 0.1)

    quality = (
        margin_multiplier(d.gross_margin, d.sector) *
        concentration_penalty(d.top_3_customers_percent) *
        burn_efficiency(d.monthly_revenue, d.monthly_burn)
    )
    quality *= COMP_SCORE[d.competitive_position]

    operating_value = arr * base_multiple * c * quality * (1 - churn_penalty)
    final = operating_value + asset_value
    final=final*0.80

    return {
        "scorecard": final * 0.9,
        "vc_method": {"pre_money": final, "post_money": final * 1.1},
        "risk_factor": final * 0.92,
        "recommended_pre_money": round(final, 2)
    }




