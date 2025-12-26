
import { UserModel } from "../model/user.model.js";

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const signUp = async (req, res) => {
    try {
        await UserModel.create(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully"
        });
    } catch (error) {

        // Other errors
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// require("crypto").randomBytes(32).toString('hex')

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User  not found"
            });
        }

        // ✅ Correct compare
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const payload = {
            fullname: user.fullname,
            email: user.email,
            mobile: user.mobile,
            id: user._id

        }

        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })


        res.status(200).json({
            success: true,
            message: "User login successfully",
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};