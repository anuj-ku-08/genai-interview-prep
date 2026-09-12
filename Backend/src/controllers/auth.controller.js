import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklist.model.js";

const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ fullName, email: normalizedEmail, password });
    const token = generateToken(user._id);

    res
      .status(201)
      .cookie("token", token, authCookieOptions)
      .json({
        message: "User registered successfully",
        user: { _id: user._id, fullName: user.fullName, email: user.email },
        token,
      });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res
      .status(200)
      .cookie("token", token, authCookieOptions)
      .json({
        message: "Login successful",
        user: { _id: user._id, fullName: user.fullName, email: user.email },
        token,
      });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.token || req.cookies?.token;

    if (token) {
      await BlacklistToken.create({ token });
    }

    res
      .clearCookie("token", {
        ...authCookieOptions,
        maxAge: undefined,
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};