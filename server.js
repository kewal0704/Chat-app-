const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// 🔥 MongoDB
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://kewal_12:Kewal%400704@cluster1.wopzqpe.mongodb.net/chatDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 🔥 Schema
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  time: String
});

const Message = mongoose.model("Message", messageSchema);

// ----------------------

app.use(express.static('public'));

io.on('connection', async (socket) => {
  console.log('A user connected');

  // ✅ sorted messages
  const messages = await Message.find().sort({ _id: 1 });
  socket.emit("load messages", messages);

  socket.on('chat message', async (data) => {

    const msg = new Message({
      user: data.user || "User",
      text: data.text || data,
      time: new Date().toLocaleTimeString()
    });

    await msg.save();

    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});