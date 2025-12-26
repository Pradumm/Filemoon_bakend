

import mongoose, { Schema, model } from "mongoose";




const fileSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User", 
        required: true
    },
    filename: {
        type: String,
        required: true,
        lowercase: true
    },
    path: {
        type: String,
        required: true,
        lowercase: true
    },
    size: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
    }

}, {
    timestamps: true
})

export const FileModel = model("file", fileSchema)