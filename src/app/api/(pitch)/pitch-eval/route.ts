// app/api/pitch-eval/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { PitchEval } from '@/models/PitchEvalModel';
import Pitch from '@/models/PitchModel';
import dbConnect from '@/lib/db';

interface FastAPIResponse {
  scores: {
    Introduction: Record<string, number>;
    "Pitch Content": Record<string, number>;
    "Q&A Handling": Record<string, number>;
    "Delivery & Style": Record<string, number>;
    "Business Investability": Record<string, number>;
    "Total Score": number;
    "Business Investability Confidence": number;
  };
  summary: string;
}

function transformFastAPIResponse(fastAPIResponse: FastAPIResponse) {
  return {
    scores: {
      Introduction: fastAPIResponse.scores.Introduction,
      PitchContent: fastAPIResponse.scores["Pitch Content"],
      QandAHandling: fastAPIResponse.scores["Q&A Handling"],
      DeliveryAndStyle: fastAPIResponse.scores["Delivery & Style"],
      BusinessInvestability: fastAPIResponse.scores["Business Investability"],
      TotalScore: fastAPIResponse.scores["Total Score"],
      BusinessInvestabilityConfidence: fastAPIResponse.scores["Business Investability Confidence"],
    },
    summary: fastAPIResponse.summary,
  };
}

// CORS headers helper
function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// OPTIONS preflight
export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 200 }));
}

// POST method
export async function POST(req: NextRequest) {
  dbConnect()
  try {
    const body = await req.json();
    const { pitchId } = body;

    if (!pitchId) {
      return withCors(
        NextResponse.json({ error: 'Missing required field: pitchId is required' }, { status: 400 })
      );
    }

    console.log(pitchId)

    // Validate pitchId
    if (!mongoose.Types.ObjectId.isValid(pitchId)) {
      return withCors(
        NextResponse.json({ error: 'Invalid pitchId format' }, { status: 400 })
      );
    }

    // Find the pitch by ID (pass string directly)
    const pitch = await Pitch.findById(pitchId);
    if (!pitch) {
      return withCors(
        NextResponse.json({ error: 'Pitch not found' }, { status: 404 })
      );
    }

    const existingEvaluation = await PitchEval.findOne({
      pitchId: new mongoose.Types.ObjectId(pitchId),
    });

    if (existingEvaluation) {
      return withCors(
        NextResponse.json({
          message: 'Evaluation already exists',
          evaluation: existingEvaluation,
          exists: true,
        })
      );
    }

    const conversationHistory = pitch.conversationHistory;
    if (!conversationHistory || !Array.isArray(conversationHistory) || conversationHistory.length === 0) {
      return withCors(
        NextResponse.json({ error: 'Pitch does not have conversation history for evaluation' }, { status: 400 })
      );
    }

    // Send transcript to FastAPI
    const fastAPIResponse = await fetch('http://127.0.0.1:8000/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: conversationHistory }),
    });

    const contentType = fastAPIResponse.headers.get('content-type');
    if (!fastAPIResponse.ok) {
      const errorText = await fastAPIResponse.text();
      console.error('FastAPI error response:', errorText);
      throw new Error(`FastAPI request failed: ${fastAPIResponse.status} - ${errorText}`);
    }

    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await fastAPIResponse.text();
      console.error('FastAPI returned non-JSON response:', errorText);
      throw new Error('FastAPI backend returned an invalid response format');
    }

    const fastAPIResult: FastAPIResponse = await fastAPIResponse.json();
    const transformedData = transformFastAPIResponse(fastAPIResult);

    const newEvaluation = new PitchEval({
      userId: pitch.userId,
      pitchId: new mongoose.Types.ObjectId(pitchId),
      scores: transformedData.scores,
      summary: transformedData.summary,
    });

    await newEvaluation.save();

    return withCors(
      NextResponse.json({
        message: 'Evaluation created successfully',
        evaluation: newEvaluation,
        exists: false,
      }, { status: 201 })
    );
  } catch (error) {
    console.error('Error in evaluation API:', error);
    return withCors(
      NextResponse.json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    );
  }
}
