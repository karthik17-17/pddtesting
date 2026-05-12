import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.model";
import { generateToken } from "../utils/generateToken";

// ================= REGISTER =================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken((user as any)._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: (user as any)._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      (user as any).password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken((user as any)._id.toString());

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: (user as any)._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};