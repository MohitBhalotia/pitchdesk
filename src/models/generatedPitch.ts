import mongoose, { Schema } from "mongoose"
import { Model } from "mongoose"

const generatedPitchSchema = new Schema<IGeneratedPitchSchema>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{
        type: String,
        default: "Startup Pitch"
    },
    pitch: {
        type: String,
        required: true
    },
}, {timestamps: true})

const generatedPitchModel:Model<IGeneratedPitchSchema> = mongoose.models.generatedPitch || mongoose.model<IGeneratedPitchSchema>("generatedPitch", generatedPitchSchema)

export default generatedPitchModel