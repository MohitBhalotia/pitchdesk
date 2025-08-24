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
})

// const ConversationSchema = new Schema<Conversation>({
//     conversationDate: {
//         type: Date,
//         default: Date.now
//     },
//     messages: [
//         MessageSchema
//     ],
//     Duration: {
//         type: Number,
//         default: 0
//     }
// }, {_id: false})


const PitchSchema = new Schema<Pitch>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        duration:{
            type: Number,
            default: 0
        },
        recordingUrl: {
            type: String,
            default: null
        },
        conversationHistory: [
            MessageSchema
        ]   
    },{
        timestamps: true
    }
)

const PitchModel = mongoose.model<Pitch>("Pitch", PitchSchema);

export default PitchModel