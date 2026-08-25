import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. User Register (Sign Up)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // A: Check karein ke kiya is email se pehle koi user mojud hai?
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "This email is already registered" });
    }

    // B: Password ko secure (Hash) karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // C: Naya user database mein save karein
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ success: true, message: "User successfully registered!" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Registration mein masla hua!" });
  }
};
// 2. User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // A: Check karein ke is email wala user mojood hai ya nahi
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // B: Password check karein (Joh user ne abhi likha vs Joh database mein lock/hash hai)
    // Note: Yahan bcryptjs istemal hoga kyunke humne picchli baar galti theek ki thi
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "password is incorrect" });
    }

    // C: Agar sab sahi hai, toh VIP Pass (JWT Token) banayen
    // "secret_key" ko hum baad mein .env file mein bhi rakh sakte hain
    const token = jwt.sign({ userId: user.id }, "super_secret_key_amazon", {
      expiresIn: "7d", // Yeh pass 7 din tak valid rahega
    });

    // D: User ko token de dein
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong during login" });
  }
};
// 3. Get Current User (Refresh hone par data mangwane ke liye)
export const getCurrentUser = async (req, res) => {
  try {
    // A. Header se token nikalen
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Token not found" });
    }

    // B. Token verify karein (yahan wohi secret key use hogi jo login mein ki thi)
    const decoded = jwt.verify(token, "super_secret_key_amazon");

    // C. Database se user mangwayen
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true } // Password nahi bhejna!
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(401).json({ success: false, message: "Token is invalid or expired" });
  }
};