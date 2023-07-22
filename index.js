const connectToMongo=require("./db")
const express=require("express")
var cors = require('cors')
const userRoutes = require("./routes/userRoutes");
const app = express()
const dotenv=require("dotenv")
dotenv.config({path:'./config.env'})
const port = process.env.PORT
const { notFound, errorHandler } = require("./middleware/error");


connectToMongo();
app.use(cors())
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hello TG")
})

app.use('/api/auth',require('./routes/auth.js'))
app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`CodeChat is listening on port ${port}`)
  })