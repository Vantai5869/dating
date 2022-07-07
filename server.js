/**
 * author: larry amiel tablando
 * link: github.com/larryamiel
 * description: main index file for the API of chirodev
 */

// Declaring Global Variables
global.__basedir = __dirname;

// Declaring Environment
const dotenv = require('dotenv');
dotenv.config();

// Declaring Modules
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const http = require('http').createServer(app)


/** MIDDLEWARES */

// CORS Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// BodyParser Middleware
app.use(express.json());

// Cookie Parser Middleware
app.use(cookieParser());

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));


/** IMPORT ROUTES */

// authentication route
const rAuth= require(__basedir + '/routes/auth');
const rPost = require(__basedir + '/routes/post');
const rUser = require(__basedir + '/routes/user');
const rSendMail = require(__basedir + '/routes/send-mail');

/** ROUTES */

app.use('/api/auth', rAuth);
app.use('/api/post', rPost);
app.use('/api/user', rUser);
app.use('/api/send-mail', rSendMail);



const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

/** RUN THE API ON PORT */
const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})