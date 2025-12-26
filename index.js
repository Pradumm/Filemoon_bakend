
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

import mongoose from "mongoose";
mongoose.connect(process.env.DB).then(() => console.log("conected"))

import express from "express";
import { Login, signUp } from "./controller/user.controller.js";
import { createFile, deleteFile, downloadFile, fetchFiles } from "./controller/file.controller.js";
const app = express()
import { v4 as uniqueId } from 'uuid';

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.listen(process.env.PORT || 8000)

import multer from "multer";
import { fetchDashboard } from "./controller/dashboard.controller.js";
import { verifyToken } from "./controller/token.controller.js";
import { getSharedFile, sharedFile } from "./controller/share.controller.js";
import { AuthMiddleware } from "./middleware/auth.middleware.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "files/");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        const name = `${uniqueId()}.${ext}`;
        cb(null, name); // ✅ MUST be string
    }
});


const upload = multer({
    storage,
    limits: {
        fileSize: 200 * 1000 * 1000
    }
});




app.post("/signup", signUp)
app.post("/login", Login)
app.post("/file", AuthMiddleware, upload.single("file"), createFile)
app.get("/file", AuthMiddleware, fetchFiles)
app.delete("/file/:id", deleteFile)
app.get("/file/download/:id", downloadFile)
app.get("/dashboard-reports", fetchDashboard)
app.post("/token/verify", verifyToken)
app.post("/api/share", AuthMiddleware, sharedFile)
app.get("/api/history", AuthMiddleware, getSharedFile)



app.get("/", (req, res) => {
    res.send("hello")
})

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint Not found" })
})