import mongoose from 'mongoose';

const ParticipantModel = new mongoose.Schema({
    _id: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    roomId:String,
    createdAt:   Number,
    updatedAt: Number,
}, {
    timestamps: true
})

export default mongoose.model('participants', ParticipantModel)