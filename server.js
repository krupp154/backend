require('dotenv').config();
require("./cronJobs/deleteExpiredMessages"); // Import and start cron job

const express = require('express');
const cors = require('cors');
const http = require("http"); // WebSocket requires HTTP server
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket
const io = new Server(server, {
    cors: { origin: "*" },
});

const dburi = process.env.MONGO_URI;
const PORT = process.env.PORT;
// const API_BASE_URL = process.env.API_BASE_URL;

const postRouter = require('./routers/post-route');
const commentRouter = require('./routers/comment-route');
const replyRouter = require('./routers/reply-route');
const messageRouter = require('./routers/message-route');
const strangerRouter = require('./routers/stranger-route');
const Message = require('./models/message-model');

app.use(cors());
app.use(bodyParser.json());
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/reply", replyRouter);
app.use("/message", messageRouter);
app.use("/stranger", strangerRouter);
app.use(express.json());

let activeUsers = new Map(); // Store active users and their sockets

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
        activeUsers.set(userId, socket.id);
        // console.log(User ${userId} registered with socket ${socket.id});
    });

    socket.on("send-request", ({ senderId, receiverId }) => {
        // console.log(Received connection request from ${senderId} to ${receiverId});
        if (activeUsers.has(receiverId)) {
            io.to(activeUsers.get(receiverId)).emit("incoming-request", { senderId });
            // console.log(Sent incoming request to ${receiverId});
        } else {
            // console.log(User ${receiverId} is not online);
        }
    });

    socket.on("accept-request", ({ senderId, receiverId }) => {
        // console.log(User ${receiverId} accepted chat request from ${senderId});
    
        // Notify both users to start chat
        io.to(activeUsers.get(senderId)).emit("request-accepted", { senderId, receiverId });
        io.to(activeUsers.get(receiverId)).emit("request-accepted", { senderId, receiverId });
    });    

    socket.on("send-message", async ({ senderId, receiverId, content }) => {
        // console.log(Message from ${senderId} to ${receiverId}: ${content});
    
        try {
            const message = new Message({
                sender: senderId,
                receiver: receiverId,
                content,
                isRead: false,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Auto-delete in 24 hours
            });
    
            const savedMessage = await message.save();
            console.log("Saved message:", savedMessage);
    
            if (activeUsers.has(receiverId)) {
                io.to(activeUsers.get(receiverId)).emit("receive-message", savedMessage);
    
                // Auto-delete message after 3 seconds
                setTimeout(async () => {
                    await Message.findByIdAndDelete(savedMessage._id);
                    
                    // Emit deletion event to both sender & receiver
                    io.emit("message-deleted", { messageId: savedMessage._id });
                
                    // console.log(Message ${savedMessage._id} deleted for both users);
                }, 3000);
                
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });
    

    socket.on("disconnect", () => {
        // console.log(User disconnected: ${socket.id});
        activeUsers.forEach((value, key) => {
            if (value === socket.id) {
                activeUsers.delete(key);
                // console.log(Removed user ${key} from active users);
            }
        });
    });
});



// Example usage of API_BASE_URL
// app.get('/api-url', (req, res) => {
//     res.send(API Base URL is ${API_BASE_URL});
// });

app.get('/', (req, res) => {
    res.send("Hello World");
});

mongoose.connect(dburi)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`:::: Server is running on ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
    });