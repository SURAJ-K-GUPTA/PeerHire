require('dotenv').config();
const express = require('express');
const cors = require("cors")
const connectDB =require("./db/db");
const userRouter = require('./routes/user');
const jobRouter = require('./routes/job');
const bidRouter = require('./routes/bid');
const { verifyToken } = require('./utils/Auth');
const rateLimit = require('express-rate-limit');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message:{
        message:"Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // disable the `X-RateLimit-*` headers
})

// Apply rate limiter to all requests
app.use(limiter);

app.get("/", (req, res)=>{
    res.status(200).json("Welcome to PeerHire")
})


app.use("/auth", userRouter)
app.use("/jobs", verifyToken, jobRouter)
app.use("/bids", verifyToken, bidRouter)


// Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: "Something went wrong", error: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

