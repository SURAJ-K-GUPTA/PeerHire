require('dotenv').config();
const express = require('express');
const cors = require("cors")
const connectDB =require("./db/db");
const userRouter = require('./routes/user');
const jobRouter = require('./routes/job');
const bidRouter = require('./routes/bid');
const { verifyToken } = require('./utils/Auth');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res)=>{
    res.status(200).json("Welcome to PeerHire")
})


app.use("/auth", userRouter)
app.use("/jobs", verifyToken, jobRouter)
app.use("/bids", verifyToken, bidRouter)


// Error Handler
app.use((error, req, res, next)=>{
    res.status(500).json({message: "Route not found", error })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

