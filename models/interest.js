const mongoose = require('mongoose')

const interestSchema = new mongoose.Schema({
    text: String,
    icon: String,
}, {
    timestamps: true
})

module.exports = mongoose.model('interest', interestSchema)