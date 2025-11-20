import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { CompetitionPitchEval } from '@/models/CompetitionPitchEvalModel';
import Pitch from '@/models/PitchModel';
import Participant from '@/models/Participant';
import dbConnect from '@/lib/db';

interface FastAPIResponse {
  scores: {
    "PROBLEM & MARKET OPPORTUNITY": { Subtotal: number };
    "SOLUTION & INNOVATION": { Subtotal: number };
    "BUSINESS MODEL & SCALABILITY": { Subtotal: number };
    "TEAM & EXECUTION CAPABILITY": { Subtotal: number };
    "TRACTION & VALIDATION": { Subtotal: number };
    "PITCH QUALITY & COMMUNICATION": { Subtotal: number };
    "Total Score": number;
    "Business Investability Confidence": number;
  };
  summary: string;
}

function transformFastAPIResponse(fastAPIResponse: FastAPIResponse) {
  return {
    scores: {
      ProblemMarketOpportunity: fastAPIResponse.scores["PROBLEM & MARKET OPPORTUNITY"].Subtotal,
      SolutionInnovation: fastAPIResponse.scores["SOLUTION & INNOVATION"].Subtotal,
      BusinessModelScalability: fastAPIResponse.scores["BUSINESS MODEL & SCALABILITY"].Subtotal,
      TeamExecutionCapability: fastAPIResponse.scores["TEAM & EXECUTION CAPABILITY"].Subtotal,
      TractionValidation: fastAPIResponse.scores["TRACTION & VALIDATION"].Subtotal,
      PitchQualityCommunication: fastAPIResponse.scores["PITCH QUALITY & COMMUNICATION"].Subtotal,
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
  await dbConnect();
  
  try {
    const body = await req.json();
    const { pitchId } = body;

    if (!pitchId) {
      return withCors(
        NextResponse.json({ error: 'Missing required field: pitchId is required' }, { status: 400 })
      );
    }


    // Validate pitchId
    if (!mongoose.Types.ObjectId.isValid(pitchId)) {
      return withCors(
        NextResponse.json({ error: 'Invalid pitchId format' }, { status: 400 })
      );
    }

    // Find the pitch by ID
    const pitch = await Pitch.findById(pitchId);
    if (!pitch) {
      return withCors(
        NextResponse.json({ error: 'Pitch not found' }, { status: 404 })
      );
    }

    // Check if it's a competition pitch
    if (!pitch.competitionId) {
      return withCors(
        NextResponse.json({ error: 'This pitch is not a competition pitch' }, { status: 400 })
      );
    }

    // Check if evaluation already exists
    const existingEvaluation = await CompetitionPitchEval.findOne({
      pitchId: new mongoose.Types.ObjectId(pitchId),
    });

    if (existingEvaluation) {
      return withCors(
        NextResponse.json({
          message: 'Competition evaluation already exists',
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

    // Send transcript to FastAPI competition evaluation endpoint
    const fastAPIResponse = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_BACKEND}/evaluate-competition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: conversationHistory }),
    });

    const contentType = fastAPIResponse.headers.get('content-type');
    if (!fastAPIResponse.ok) {
      const errorText = await fastAPIResponse.text();
      console.error('FastAPI competition evaluation error:', errorText);
      throw new Error(`FastAPI competition evaluation failed: ${fastAPIResponse.status} - ${errorText}`);
    }

    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await fastAPIResponse.text();
      console.error('FastAPI returned non-JSON response:', errorText);
      throw new Error('FastAPI backend returned an invalid response format');
    }

    const fastAPIResult: FastAPIResponse = await fastAPIResponse.json();
    const transformedData = transformFastAPIResponse(fastAPIResult);

    // Create new competition evaluation
    const newEvaluation = new CompetitionPitchEval({
      userId: pitch.userId,
      pitchId: new mongoose.Types.ObjectId(pitchId),
      competitionId: pitch.competitionId, // Use the competitionId from the pitch
      scores: transformedData.scores,
      summary: transformedData.summary,
    });

    await newEvaluation.save();

    //update particpant to pitchEvaluated true
    await Participant.updateOne({
      userId: pitch.userId,
      competitionId: pitch.competitionId,
    }, { pitchEvaluated: true });

    console.log('Competition pitch evaluation created successfully for competition:', pitch.competitionId);

    return withCors(
      NextResponse.json({
        message: 'Competition evaluation created successfully',
        evaluation: newEvaluation,
        exists: false,
      }, { status: 201 })
    );
  } catch (error) {
    console.error('Error in competition evaluation API:', error);
    return withCors(
      NextResponse.json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    );
  }
}
