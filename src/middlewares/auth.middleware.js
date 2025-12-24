import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
        const  authheader = req.headers['authorization'];

        if (!authheader){
            return res.status(401).json({ message: "Authorization header missing" });
        }
        const token = authheader && authheader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const jwtSecret = process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex');

        try{
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).json({ message: "Invalid token" });
        }
}