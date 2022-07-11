
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    roomId:String,
    content: String,
    type: String,
    readBy:[],
    createdAt:   Number,
    updatedAt: Number,
}, {
    timestamps: true
})

export default mongoose.model('message', messageSchema)