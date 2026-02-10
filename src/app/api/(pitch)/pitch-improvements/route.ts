// app/api/pitch-improvements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { PitchImprovement } from '@/models/PitchImprovementModel';
import { PitchEval } from '@/models/PitchEvalModel';
import Pitch from '@/models/PitchModel';
import dbConnect from '@/lib/db';

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

        // Check if improvement analysis already exists
        const existingImprovement = await PitchImprovement.findOne({
            pitchId: new mongoose.Types.ObjectId(pitchId),
        });

        if (existingImprovement) {
            return withCors(
                NextResponse.json({
                    message: 'Improvement analysis already exists',
                    improvement: existingImprovement,
                    exists: true,
                })
            );
        }

        // Find the pitch
        const pitch = await Pitch.findById(pitchId);
        if (!pitch) {
            return withCors(
                NextResponse.json({ error: 'Pitch not found' }, { status: 404 })
            );
        }

        // Find the evaluation
        const evaluation = await PitchEval.findOne({
            pitchId: new mongoose.Types.ObjectId(pitchId),
        });

        if (!evaluation) {
            return withCors(
                NextResponse.json({
                    error: 'Evaluation not found. Please generate an evaluation first.'
                }, { status: 404 })
            );
        }

        // Get conversation history
        const conversationHistory = pitch.conversationHistory;
        if (!conversationHistory || !Array.isArray(conversationHistory) || conversationHistory.length === 0) {
            return withCors(
                NextResponse.json({
                    error: 'Pitch does not have conversation history for analysis'
                }, { status: 400 })
            );
        }

        // Transform scores to match FastAPI expected format
        const transformedScores = {
            scores: {
                "Introduction": evaluation.scores.Introduction,
                "Pitch Content": evaluation.scores.PitchContent,
                "Q&A Handling": evaluation.scores.QandAHandling,
                "Business Investability": evaluation.scores.BusinessInvestability,
                "Total Score": evaluation.scores.TotalScore,
                "Business Investability Confidence": evaluation.scores.BusinessInvestabilityConfidence,
            }
        };

        // Prepare form data for FastAPI (multipart/form-data)
        const formData = new FormData();
        formData.append('transcript', JSON.stringify({ transcript: conversationHistory }));
        formData.append('scores', JSON.stringify(transformedScores));

        // Call FastAPI improvements endpoint
        const fastAPIResponse = await fetch(
            `${process.env.NEXT_PUBLIC_FASTAPI_BACKEND}/pitch/improvements`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!fastAPIResponse.ok) {
            const errorText = await fastAPIResponse.text();
            console.error('FastAPI error response:', errorText);
            throw new Error(`FastAPI request failed: ${fastAPIResponse.status} - ${errorText}`);
        }

        const fastAPIResult = await fastAPIResponse.json();

        // Save to database
        const newImprovement = new PitchImprovement({
            userId: pitch.userId,
            pitchId: new mongoose.Types.ObjectId(pitchId),
            evaluationId: evaluation._id,
            section_wise_improvements: fastAPIResult.section_wise_improvements,
        });

        await newImprovement.save();

        return withCors(
            NextResponse.json({
                message: 'Improvement analysis created successfully',
                improvement: newImprovement,
                exists: false,
            }, { status: 201 })
        );
    } catch (error) {
        console.error('Error in pitch improvements API:', error);
        return withCors(
            NextResponse.json({
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
            }, { status: 500 })
        );
    }
}
