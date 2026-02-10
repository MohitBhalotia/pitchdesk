import os
import json
from typing import List, Dict, Any
from openai import OpenAI

# -------------------------
# OpenAI Client
# -------------------------
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = "gpt-4.1-mini"

# -------------------------
# Micro-level Max Scores
# -------------------------
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

# -------------------------
# Helpers
# -------------------------
def transcript_to_text(transcript: List[Dict[str, str]]) -> str:
    lines = []
    for turn in transcript:
        role = turn.get("role", "").upper()
        content = turn.get("content", "")
        lines.append(f"{role}: {content}")
    return "\n".join(lines)


def enrich_criteria_with_max_scores(
    section: str,
    criteria: Dict[str, Any]
) -> Dict[str, Dict[str, int]]:
    """
    Returns:
    {
        criterion_name: {
            "score_received": int,
            "max_score": int
        }
    }
    """
    enriched = {}
    max_scores_for_section = MICRO_MAX_SCORES.get(section, {})

    for criterion, score in criteria.items():
        if any(x in criterion.lower() for x in ["subtotal", "total"]):
            continue

        max_score = max_scores_for_section.get(criterion)

        if max_score is None:
            # Safety fallback (should not happen if schema is correct)
            continue

        enriched[criterion] = {
            "score_received": score,
            "max_score": max_score
        }

    return enriched


def build_prompt(
    transcript_text: str,
    section: str,
    criteria_with_max: Dict[str, Dict[str, int]]
) -> str:
    return f"""
You are a strict but helpful startup pitch coach and VC evaluator.

Transcript:
{transcript_text}

Evaluation Section:
{section}

Scoring Details (DO NOT MODIFY THESE NUMBERS):
{json.dumps(criteria_with_max, indent=2)}

Your tasks:
1. For EACH criterion:
   - Use the given score_received and max_score
   - Calculate marks_lost = max_score - score_received
   - Explain WHY marks were lost (based only on transcript)
   - Explain WHAT the founder should do to get full marks
2. Do NOT re-score or change any numbers.
3. Be direct, practical, and VC-style.
4. Ignore anything not listed in the scoring details.

Return STRICT JSON ONLY in the format below:

{{
  "criteria_feedback": {{
    "<criterion_name>": {{
      "score_received": number,
      "max_score": number,
      "marks_lost": number,
      "reason": "string",
      "how_to_improve": "string"
    }}
  }},
  "summary": {{
    "strengths": [string],
    "gaps": [string],
    "improvements": [string]
  }}
}}

IMPORTANT:
- Output must be valid JSON.
- No markdown.
- No explanations outside JSON.
"""


# -------------------------
# Main Function
# -------------------------
def generate_section_improvement(
    transcript: List[Dict[str, str]],
    section: str,
    criteria: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generates detailed improvement feedback for one evaluation section
    using fixed micro-level max scores.
    """

    transcript_text = transcript_to_text(transcript)

    criteria_with_max = enrich_criteria_with_max_scores(
        section=section,
        criteria=criteria
    )

    if not criteria_with_max:
        return {
            "error": f"No valid criteria found for section '{section}'"
        }

    prompt = build_prompt(
        transcript_text=transcript_text,
        section=section,
        criteria_with_max=criteria_with_max
    )

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a professional VC pitch coach who gives numeric, criterion-wise feedback."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    raw_output = response.choices[0].message.content

    # Safe JSON parsing
    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        return {
            "error": "Model returned invalid JSON",
            "raw_output": raw_output
        }
