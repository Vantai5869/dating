
import dotenv from 'dotenv';
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import http1 from'http';
import rAuth from './routes/auth.js';
import rPost from './routes/post.js';
import rUser from './routes/user.js';
import rSendMail from './routes/send-mail.js';
import rmediaUpload from './routes/mediaUpload.js';
import roomRoutes from './routes/room.js';
import participantRoutes from './routes/participant.js';
import messageRoutes from './routes/message.js';

import path from 'path';
import { Server } from "socket.io"
import SocketServer from './SocketServer.js';



const __dirname = path.resolve();
dotenv.config();
const app = express();
const http = http1.createServer(app)

export const io = new Server(http, { 
    cors: {
      origin: '*',
    }
  });
/** MIDDLEWARES */

// CORS Middleware
app.use(cors({ origin: "*", credentials: true }));

// BodyParser Middleware
app.use(express.json());

// Cookie Parser Middleware
app.use(cookieParser());

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));


/** ROUTES */

app.use('/api/v1/auth', rAuth);
app.use('/api/v1/post', rPost);
app.use('/api/v1/users', rUser);
app.use('/api/v1/send-mail', rSendMail);
app.use('/api/v1/media', rmediaUpload);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/participants', participantRoutes);

const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
})

console.log('__dirname')
console.log(__dirname)
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

io.on("connection", (socket) => {
    SocketServer(socket)
  });