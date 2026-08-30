import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import BlacklistToken from "../models/blacklist.model.js";

export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized: Token is invalid or logged out" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};