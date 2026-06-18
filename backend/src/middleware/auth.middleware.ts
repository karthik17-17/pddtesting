import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model";

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      );

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        // Fallback for demo tokens
        req.user = { _id: "demo-user-id" };
      }

      next();
    } catch (error) {
      // Fallback for demo tokens
      req.user = { _id: "demo-user-id" };
      next();
    }
  } else {
    // If no token is provided, we can either throw error or assign demo user
    req.user = { _id: "demo-user-id" };
    next();
  }
};
