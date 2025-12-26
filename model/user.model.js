import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address"
        ]
    },

    mobile: {
        type: String,
        required: true,
    },


}, {
    timestamps: true
});


userSchema.pre("save", async function () {
    const mobileExists = await model("User").findOne({
        mobile: this.mobile,
        _id: { $ne: this._id }
    });

    if (mobileExists) {
        throw new Error("Mobile number already exists");
    }
});



userSchema.pre("save", async function () {
    const emailExists = await model("User").findOne({
        email: this.email,
        _id: { $ne: this._id }
    });


    if (emailExists) {
        throw new Error("Email already exists");
    }
});


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});



export const UserModel = model("User", userSchema)