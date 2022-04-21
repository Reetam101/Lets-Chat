const express = require('express');
const dotenv = require('dotenv')
// const chats = require('./data/data');
const connectDB = require('./config/db');

const {notFound, errorHandler} = require('./middleware/errorMiddleware')

const app = express();
dotenv.config()
connectDB()

app.use(express.json())

app.get('/', (req, res) => {
  res.send("Hello")
})

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/chat', require('./routes/chatRoutes'))
app.use("/api/message", require('./routes/messageRoutes'))


app.use(notFound)
app.use(errorHandler)

const PORT = 5000 || process.env.PORT;
const server = app.listen(PORT, console.log(`Server running on ${PORT}`))

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  }
})

io.on("connection", (socket) => {
  console.log(`Connected to socket.io ${socket}`)

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected')
  })

  socket.on("join chat", (roomId) => {
    socket.join(roomId)
    console.log(`User joined ${roomId}`)
  })

  socket.on("typing", (roomId) => {
    socket.in(roomId).emit("typing")
  })
  socket.on("stop typing", (roomId) => {
    socket.in(roomId).emit("stop typing")
  })

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat

    if(!chat.users) return console.log("chat.users not defined")

    chat.users.forEach(user => {
      if(user._id == newMessageRecieved.sender._id) {
        return
      }

      socket.in(user._id).emit("message recieved", newMessageRecieved)
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED")
    socket.leave(userData._id)
  })
})