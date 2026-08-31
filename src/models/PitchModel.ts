import mongoose, { Model, Schema } from 'mongoose'

const MessageSchema = new Schema<Message>({
    role: {
        type: String,
        enum: ["user", "bot"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
})

const PitchSchema = new Schema<Pitch>(
    {
        sessionId: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        competitionId: {  //  NEW FIELD to distinguish between usual and competition pitches
            type: Schema.Types.ObjectId,
            ref: 'Competition',
            default: null
        },
        incubationId: {  // NEW FIELD to distinguish incubation pitches
            type: Schema.Types.ObjectId,
            ref: 'IncubationProgram',
            default: null
        },
        agentId: {
            type: Schema.Types.ObjectId,
            ref: 'Agent',
            default: null
        },
        pitchNumber: {
            type: Number,
            min: 1
        },
        title: {
            type: String
        },
        startTime: {
            type: Date,
            default: Date.now
        },
        lastUpdated: {
            type: Date,
            default: null
        },
        duration: {
            type: Number,
            default: null
        },
        conversationHistory: [
            MessageSchema
        ],
        endTime: {
            type: Date,
            default: null
        },
        creditsUsed: {
            type: Number,
            default: 0
        },
        overview: {
            type: Schema.Types.Mixed,
            default: null
        }
    },
    { timestamps: true }
)

PitchSchema.index(
    { userId: 1, pitchNumber: 1 },
    {
        unique: true,
        partialFilterExpression: { pitchNumber: { $type: "number" } }
    }
)

const PitchModel: Model<Pitch> = mongoose.models.Pitch || mongoose.model<Pitch>("Pitch", PitchSchema);

export default PitchModel
