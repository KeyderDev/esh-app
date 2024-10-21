require('dotenv').config();
const { Server } = require('socket.io');
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();

const credentials = {
    key: fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8'),
    cert: fs.readFileSync(process.env.SSL_CERTIFICATE, 'utf8'),
};

const server = https.createServer(credentials, app);

const allowedOrigin = process.env.APP_URL || "http://localhost"; 

const io = new Server(server, {
    cors: {
        origin: allowedOrigin, 
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-channel', (channelId) => {
        socket.join(channelId);
        console.log(`User ${socket.id} joined channel: ${channelId}`);
    });

    socket.on('new-message', (data) => {
        console.log('New message received on server:', data);
        io.to(data.channelId).emit('message-received', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const port = 6001; 
server.listen(port, () => {
    console.log(`Socket.IO server running on port ${port}`);
});
