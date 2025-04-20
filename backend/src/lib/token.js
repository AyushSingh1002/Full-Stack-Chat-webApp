import jwt from "jsonwebtoken";

const generateTokens = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // true if using HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

export { generateTokens };
