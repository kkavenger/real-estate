import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

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
