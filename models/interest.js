import mongoose from 'mongoose'

const interestSchema = new mongoose.Schema({
    text: String,
    icon: String,
}, {
    timestamps: true
})

export default mongoose.model('interest', interestSchema)