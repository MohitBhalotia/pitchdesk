# ---------------------------------------------------------
# WINDOWS + SSL HARD FIXES
# ---------------------------------------------------------
import os
import certifi

os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

for k in ["HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy"]:
    os.environ.pop(k, None)

# ---------------------------------------------------------
# STANDARD IMPORTS
# ---------------------------------------------------------
import uuid
import base64
import logging
from typing import Dict, List
from io import BytesIO

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from PIL import Image

# ✅ Gemini SDK (same as sample)
from google import genai


# ---------------------------------------------------------
# LOAD ENV
# ---------------------------------------------------------
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ImageRegenAPI")

# ---------------------------------------------------------
# ENV
# ---------------------------------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


# ---------------------------------------------------------
# INIT CLIENTS
# ---------------------------------------------------------
client = genai.Client(api_key=GEMINI_API_KEY)

# ---------------------------------------------------------
# FASTAPI APP
# ---------------------------------------------------------
app = FastAPI(title="Gemini Avatar Image Regeneration API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# PROMPT (VC CARTOON AVATAR)
# ---------------------------------------------------------
PROMPT="""
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
- Maintain the person’s natural imperfections and unique features
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


# ---------------------------------------------------------
# IMAGE REGEN FUNCTION (MATCHES SAMPLE)
# ---------------------------------------------------------
def regenerate_image_with_gemini(
    pil_image: Image.Image,
    session_id: str
) -> Dict:

    logger.info("🎨 Generating image using Gemini (flash-image)")

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[PROMPT, pil_image],
    )

    variations: List[Dict] = []

    for part in response.parts:
        # ✅ THIS is where Gemini image bytes live
        if part.inline_data and part.inline_data.data:
            out_bytes = part.inline_data.data

    
            variations.append({
                "base64": base64.b64encode(out_bytes).decode()
            })

    if not variations:
        raise RuntimeError("Gemini returned no image")

    return {
        "session_id": session_id,
        "variations": variations
    }

# ---------------------------------------------------------
# API ENDPOINT
# ---------------------------------------------------------
@app.post("/image/regenerate")
async def regenerate_image(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image")

        pil_image = Image.open(BytesIO(image_bytes)).convert("RGBA")
        session_id = str(uuid.uuid4())

        result = regenerate_image_with_gemini(pil_image, session_id)

        return {"status": "success", "data": result}

    except Exception as e:
        logger.exception("❌ Image regeneration failed")
        raise HTTPException(status_code=500, detail=str(e))
