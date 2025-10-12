import mongoose, { Model, Schema } from 'mongoose'

const MessageSchema = new Schema<Message>({
    role: {
        type: String,
        enum: ["user", "bot"],
        required: true
    },
    content: {
        type: String,
        require: true
    },
    timestamp: {
        type: String,
        default: Date.now().toString()
    },
})

const PitchSchema = new Schema<Pitch>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        startTime: {
            type: Date,
            default: Date.now
        },
        endTime: {
            type: Date,
            default: null
        },
        duration:{
            type: Number,
            default: 0
        },
        conversationHistory: [
            MessageSchema
        ]   
    }
)

const PitchModel:Model<Pitch> =mongoose.models.Pitch || mongoose.model<Pitch>("Pitch", PitchSchema);

export default PitchModel