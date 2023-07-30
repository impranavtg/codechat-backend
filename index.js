const connectToMongo=require("./db")
const express=require("express")
var cors = require('cors')
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");
const app = express()
const dotenv=require("dotenv")
dotenv.config({path:'./config.env'})
const port = process.env.PORT || 7000;
const { notFound, errorHandler } = require("./middleware/error");
const http = require("http");
const httpserver = http.createServer(app);


connectToMongo();
app.use(cors())
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hello TG")
})

app.use('/api/auth',require('./routes/auth.js'))
app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server=httpserver.listen(port, () => {
    console.log(`CodeChat is listening on port ${port}`)
  })

  const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"https://codechat-frontend.vercel.app",
    }
  });

  io.on("connection",(socket)=>{
   console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

   socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

  

