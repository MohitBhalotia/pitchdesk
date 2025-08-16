import mongoose, { Schema } from 'mongoose'

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
        type: Date,
        default: Date.now
    },
}, {_id: false})

const ConversationSchema = new Schema<Conversation>({
    conversationDate: {
        type: Date,
        default: Date.now
    },
    messages: [
        MessageSchema
    ],
    Duration: {
        type: Number,
        default: 0
    }
}, {_id: false})


const PitchSchema = new Schema<Pitch>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        recordingUrl: {
            type: String,
            default: null
        },
        conversationHistory: [
            ConversationSchema
        ]   
    },{
        timestamps: true
    }
)

const PitchMode = mongoose.models.Pitch || mongoose.model<Pitch>("Pich", PitchSchema);

export default PitchSchema