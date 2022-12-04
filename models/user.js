import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        // unique: true
    },
    email: {
        type: String,
        required: false,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {type: String, default: 'user'},
    verifyCode: {type: String},
    gender: {type: String},
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
    avatar: {type: String, default: 'https://res.cloudinary.com/dueyjeqd5/image/upload/v1657702541/v-network/iszpkgbxxjzxxicgoiyi.jpg'},
    active:  {
        type: Boolean,
        default: false
    },
    gallery:[],
    dateBirth:Number,
    monthBirth:Number,
    yearBirth:Number,
    interests: [{type: mongoose.Types.ObjectId, ref: 'interest'}],
}, {
    timestamps: true
})


export default mongoose.model('user', userSchema)