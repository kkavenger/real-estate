import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
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

//Starting the server
app.listen(8000, () => {
    console.log("Server listening on port 8000");
});

//making API routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

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