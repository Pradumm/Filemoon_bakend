import mongoose, { model, Schema } from "mongoose";

const sharedSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"   // matches User model name
    },
    recieverEmail: String,
    file: {
        type: mongoose.Types.ObjectId,
        ref: "file"   // ✅ matches FileModel
    }
}, { timestamps: true });

export const sharedModel = model("share", sharedSchema);
