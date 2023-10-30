import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

const app = express();

app.use(express.json());

mongoose
.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Connected to Database")
})
.catch((err) => {
    console.log("Error connecting to Database");
});

app.listen(8000, () => {
    console.log("Server listening on port 8000");
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);