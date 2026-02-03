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
        type: String,
        default: Date.now().toString()
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
        creditsUsed: {
            type: Number,
            default: 0
        },
        overview: {
            type: Schema.Types.Mixed,
            default: null
        }
    }
)

const PitchModel: Model<Pitch> = mongoose.models.Pitch || mongoose.model<Pitch>("Pitch", PitchSchema);

export default PitchModel