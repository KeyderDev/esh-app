const { Server } = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://192.168.0.10", // Cambia esto al origen de tu aplicación frontend
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
        // Emitir el nuevo mensaje a todos los usuarios en el canal
        io.to(data.channelId).emit('message-received', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Iniciar el servidor en el puerto 6001
server.listen(6001, () => {
    console.log('Socket.IO server running on port 6001');
});
