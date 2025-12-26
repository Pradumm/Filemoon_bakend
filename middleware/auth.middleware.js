import jwt from "jsonwebtoken";

export const AuthMiddleware = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        // 1️⃣ Check header first
        if (!authorization) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        // 2️⃣ Split after check
        const [type, token] = authorization.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({ message: "Invalid authorization format" });
        }

        // 3️⃣ Verify token
        const user = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(user,"___user")

        // 4️⃣ Attach user to request
        req.user = user;


        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
