const express = require('express');
const dotenv = require('dotenv')
const chats = require('./data/data');
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


app.use(notFound)
app.use(errorHandler)

const PORT = 5000 || process.env.PORT;
app.listen(PORT, console.log(`Server running on ${PORT}`))