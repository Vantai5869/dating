import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {type: String, default: 'user'},
    gender: {type: String, default: 'male'},
    mobile: {type: String, default: ''},
    address: {type: String, default: ''},
    story: {
        type: String, 
        default: '',
        maxlength: 200
    },
    followers: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    location: {
        type: String,
        default: ''
    },
    about: {type: String, default: ''},
    avatar: {type: String},
    active:  {
        type: Boolean,
        default: false
    },
    interests: [{type: mongoose.Types.ObjectId, ref: 'interest'}],
}, {
    timestamps: true
})


export default mongoose.model('user', userSchema)