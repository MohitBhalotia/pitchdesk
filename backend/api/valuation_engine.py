from typing import Optional
from pydantic import BaseModel


# --------------------------------------------------
# UNIVERSAL INPUT MODEL
# --------------------------------------------------
class UniversalValuationInput(BaseModel):
    stage_of_business: str                    # pre_revenue | early_revenue | growth

    team_strength: str                        # weak | average | strong
    market_size: str                          # niche | medium | large
    competitive_position: str                 # weak | moderate | strong

    # Pre-Revenue Inputs
    product_stage: Optional[str] = None       # idea | prototype | MVP
    expected_customers_year1: Optional[int] = None
    expected_monthly_revenue_year1: Optional[float] = None

    # Early/Growth Inputs
    customers: Optional[int] = None
    monthly_revenue: Optional[float] = None
    monthly_growth_rate: Optional[float] = None
    monthly_churn_rate: Optional[float] = None


# --------------------------------------------------
# CONFIGURATION (Minimal Hard-Coding)
# --------------------------------------------------
STAGE_CONFIG = {
    "pre_revenue": {
        "base_value": 1_200_000,
        "fixed_costs": 25_000,
        "variable_cost": 5,
        "gross_margin": 0.65,
        "default_growth": 0.10,
        "default_churn": 0.00,
        "default_cash": 150_000,
        "exit_multiplier": 8
    },
    "early_revenue": {
        "base_value": 2_500_000,
        "fixed_costs": 40_000,
        "variable_cost": 8,
        "gross_margin": 0.70,
        "default_growth": 0.08,
        "default_churn": 0.04,
        "default_cash": 150_000,
        "exit_multiplier": 12
    },
    "growth": {
        "base_value": 8_000_000,
        "fixed_costs": 80_000,
        "variable_cost": 12,
        "gross_margin": 0.75,
        "default_growth": 0.12,
        "default_churn": 0.03,
        "default_cash": 200_000,
        "exit_multiplier": 20
    }
}

BERKUS_MAP = {
    "idea":        [100_000, 20_000, 50_000, 20_000, 0],
    "prototype":   [200_000, 100_000, 150_000, 80_000, 0],
    "MVP":         [300_000, 250_000, 200_000, 150_000, 50_000]
}

TEAM_RISK = {"weak": -150_000, "average": 0, "strong": 200_000}
MARKET_RISK = {"niche": -200_000, "medium": 0, "large": 250_000}
COMP_RISK = {"weak": -100_000, "moderate": 0, "strong": 150_000}

CTD_TEMPLATE = {
    "pre_revenue": {"engineering": 80_000, "design": 20_000, "legal": 10_000},
    "early_revenue": {"engineering": 150_000, "design": 40_000, "legal": 20_000},
    "growth": {"engineering": 300_000, "design": 80_000, "legal": 40_000}
}

WEIGHTS = {
    "market": 0.3,
    "competition": 0.1,
    "team": 0.25,
    "product": 0.15,
    "sales": 0.1,
    "other": 0.1
}


# --------------------------------------------------
# AUTO DERIVATION
# --------------------------------------------------
def derive_parameters(d: UniversalValuationInput):
    cfg = STAGE_CONFIG[d.stage_of_business]

    if d.stage_of_business == "pre_revenue":
        return {
            "arpu": None,
            "gross_margin": cfg["gross_margin"],
            "fixed_costs": cfg["fixed_costs"],
            "variable_cost": cfg["variable_cost"],
            "exit_value": cfg["base_value"] * cfg["exit_multiplier"],
        }

    arpu = d.monthly_revenue / max(d.customers, 1)

    return {
        "arpu": arpu,
        "gross_margin": cfg["gross_margin"],
        "fixed_costs": cfg["fixed_costs"],
        "variable_cost": cfg["variable_cost"],
        "exit_value": d.monthly_revenue * 12 * cfg["exit_multiplier"],
    }


# --------------------------------------------------
# SHARED HELPERS
# --------------------------------------------------
def scorecard_value(base, ratings):
    return base * (1 + sum(WEIGHTS[f] * ratings[f] for f in ratings))


def risk_value(base, d):
    return base + TEAM_RISK[d.team_strength] + MARKET_RISK[d.market_size] + COMP_RISK[d.competitive_position]


# --------------------------------------------------
# VALUATION MODELS
# --------------------------------------------------
def run_pre_revenue_model(d, derived):
    cfg = STAGE_CONFIG["pre_revenue"]

    berkus_val = sum(BERKUS_MAP[d.product_stage])

    ratings = {
        "market": MARKET_RISK[d.market_size] / 200_000,
        "competition": 0,
        "team": TEAM_RISK[d.team_strength] / 200_000,
        "product": 1 if d.product_stage == "MVP" else -1,
        "sales": 0,
        "other": 0
    }
    score_val = scorecard_value(cfg["base_value"], ratings)

    ctd = sum(CTD_TEMPLATE["pre_revenue"].values())

    post = derived["exit_value"] / 12
    pre = post - 500_000

    risk = risk_value(cfg["base_value"], d)

    rec = round((berkus_val + score_val + ctd + pre + risk) / 5, 2)

    return {
        "berkus": berkus_val,
        "scorecard": score_val,
        "cost_to_duplicate": ctd,
        "vc_method": {"pre_money": pre, "post_money": post},
        "risk_factor": risk,
        "recommended_pre_money": rec
    }


def run_early_revenue_model(d, derived):
    cfg = STAGE_CONFIG["early_revenue"]

    berkus_val = sum(BERKUS_MAP["MVP"])

    ratings = {
        "market": MARKET_RISK[d.market_size] / 200_000,
        "competition": 0,
        "team": TEAM_RISK[d.team_strength] / 200_000,
        "product": 1,
        "sales": 1,
        "other": 0
    }
    score_val = scorecard_value(cfg["base_value"], ratings)

    ctd = sum(CTD_TEMPLATE["early_revenue"].values())

    post = derived["exit_value"] / 8
    pre = post - 1_000_000

    risk = risk_value(cfg["base_value"], d)

    rec = round((berkus_val + score_val + ctd + pre + risk) / 5, 2)

    return {
        "berkus": berkus_val,
        "scorecard": score_val,
        "cost_to_duplicate": ctd,
        "vc_method": {"pre_money": pre, "post_money": post},
        "risk_factor": risk,
        "recommended_pre_money": rec
    }


def run_growth_model(d, derived):
    cfg = STAGE_CONFIG["growth"]

    ratings = {
        "market": MARKET_RISK[d.market_size] / 200_000,
        "competition": COMP_RISK[d.competitive_position] / 150_000,
        "team": TEAM_RISK[d.team_strength] / 200_000,
        "product": 2,
        "sales": 2,
        "other": 1
    }
    score_val = scorecard_value(cfg["base_value"], ratings)

    ctd = sum(CTD_TEMPLATE["growth"].values())

    post = derived["exit_value"] / 5
    pre = post - 3_000_000

    risk = risk_value(cfg["base_value"], d)

    rec = round((score_val + ctd + pre + risk) / 4, 2)

    return {
        "scorecard": score_val,
        "cost_to_duplicate": ctd,
        "vc_method": {"pre_money": pre, "post_money": post},
        "risk_factor": risk,
        "recommended_pre_money": rec
    }


# --------------------------------------------------
# PROJECTION ENGINE
# --------------------------------------------------
def run_projections(d, derived):
    cfg = STAGE_CONFIG[d.stage_of_business]

    if d.stage_of_business == "pre_revenue":
        customers = d.expected_customers_year1 or 300
        monthly_rev = (d.expected_monthly_revenue_year1 or 24_000) / 12
        growth = cfg["default_growth"]
        churn = cfg["default_churn"]
    else:
        customers = d.customers
        monthly_rev = d.monthly_revenue
        growth = d.monthly_growth_rate or cfg["default_growth"]
        churn = d.monthly_churn_rate or cfg["default_churn"]

    cash = cfg["default_cash"]
    projection = []

    for month in range(1, 13):
        customers = customers * (1 + growth) * (1 - churn)
        revenue = monthly_rev if d.stage_of_business == "pre_revenue" else customers * derived["arpu"]

        cost = cfg["fixed_costs"] + customers * derived["variable_cost"]
        net_profit = revenue - cost

        cash += net_profit

        projection.append({
            "month": month,
            "customers": int(customers),
            "revenue": round(revenue, 2),
            "net_profit": round(net_profit, 2),
            "cash_balance": round(cash, 2)
        })

    burn = abs(min(p["net_profit"] for p in projection))
    runway = cash / burn if burn > 0 else float("inf")

    return {
        "monthly": projection,
        "annual_revenue": round(sum(p["revenue"] for p in projection), 2),
        "runway_months": round(runway, 2)
    }


# --------------------------------------------------
# ORCHESTRATOR (PURE)
# --------------------------------------------------
def run_valuation_and_projection(data: UniversalValuationInput):
    derived = derive_parameters(data)

    if data.stage_of_business == "pre_revenue":
        valuations = run_pre_revenue_model(data, derived)
    elif data.stage_of_business == "early_revenue":
        valuations = run_early_revenue_model(data, derived)
    else:
        valuations = run_growth_model(data, derived)

    projections = run_projections(data, derived)

    return {
        "valuations": valuations,
        "projections": projections,
        "derived_parameters": derived
    }
