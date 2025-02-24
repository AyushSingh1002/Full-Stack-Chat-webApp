import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

const CheckAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized1" });
        }
        else{
            const {userId} = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(userId);
            req.user = user;
            if (!user) {
                return res.status(401).json({ message: "Unauthorized2" });
            }
            next()
        }
    } catch (error) {
        console.log("error in checkAuth middleware", error);
        res.status(500);
        
    }
}
export {CheckAuth}