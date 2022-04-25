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

// Declare DB
const { sequelize } = require(__basedir + '/models');

// Declaring Modules
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

/** MIDDLEWARES */

// CORS Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// BodyParser Middleware
app.use(express.json());

// Cookie Parser Middleware
app.use(cookieParser());

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session

/** IMPORT ROUTES */

// authentication route
const rAuth = require(__basedir + '/routes/auth');

/** ROUTES */

// authentication route middleware
app.use('/api/auth', rAuth);

/** RUN THE API ON PORT */
app.listen(process.env.PORT||5000, async () => {
    console.log('local server is running on port', 5000);
    await sequelize.authenticate();
    console.log('database is connected');
});