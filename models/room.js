import mongoose from 'mongoose';

const RoomModel = new mongoose.Schema({
    _id: String,
    name: String,
    avatar: String,
    isPrivate: Boolean,
    admins:[],
    createBy: String,
    createdAt:   Number,
    updatedAt: Number,
}, {
    timestamps: true
})

export default mongoose.model('rooms', RoomModel)