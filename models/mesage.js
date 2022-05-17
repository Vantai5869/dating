const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: 'user' },
    recipient: { type: mongoose.Types.ObjectId, ref: 'user' },
    text: String,
    call: Object,
    media: Array,
    postId:{ type: mongoose.Types.ObjectId, ref: 'user' },
    postUserId:{ type: mongoose.Types.ObjectId, ref: 'user' },
    status: Boolean
}, {
    timestamps: true
})

module.exports = mongoose.model('message', messageSchema)