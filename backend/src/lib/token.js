
import jwt from "jsonwebtoken"

const generateTokens = (userId, res) => {
  const token = jwt.sign({userId},process.env.JWT_SECRET, {
    expiresIn : "7d"
  })
 res.cookie("token",token,{
    httpOnly: true,
    sameSite : "strict",
 })
 return token
}

export {generateTokens}