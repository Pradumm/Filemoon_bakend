
import jwt from "jsonwebtoken"

export const verifyToken = async (req, res) => {
//  console.log(req.body)
    try {
        const payload = await jwt.verify(req.body.token, process.env.JWT_SECRET)
        res.status(200).json(payload)
    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
}