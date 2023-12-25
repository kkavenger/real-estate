import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();

//Use to take JSON input
app.use(express.json());

//Adding cookie parser to app
app.use(cookieParser());

//Connecting to mongodb database
mongoose
.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Connected to Database")
})
.catch((err) => {
    console.log("Error connecting to Database");
});

const __dirname = path.resolve();

//Starting the server
app.listen(8000, () => {
    console.log("Server listening on port 8000");
});

//making API routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

//Making middleware for error handlers
app.use((err ,req, res, next) => {
    const statuscode = err.statusCode || 500;
    const message = err.message || "Internal Server error";
    return res.status(statuscode).json({
        success: false,
        statuscode,
        message,
    });
});