import { Request, Response, NextFunction } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be a non-empty string"
    });
  }
  
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required"
    });
  }
  
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long"
    });
  }
  
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required"
    });
  }
  
  if (!password || typeof password !== "string" || password.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Password is required"
    });
  }
  
  next();
};

export const validateForgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required"
    });
  }
  
  next();
};

export const validateResetPassword = (req: Request, res: Response, next: NextFunction) => {
  const { email, otp, newPassword } = req.body;
  
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required"
    });
  }
  
  if (!otp || typeof otp !== "string" || otp.trim().length !== 6 || isNaN(Number(otp))) {
    return res.status(400).json({
      success: false,
      message: "A valid 6-digit OTP is required"
    });
  }
  
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters long"
    });
  }
  
  next();
};

export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { email, name } = req.body;
  
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required"
    });
  }
  
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be a non-empty string"
    });
  }
  
  next();
};

export const validatePasswordUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { email, currentPassword, newPassword } = req.body;
  
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required"
    });
  }
  
  if (!currentPassword || typeof currentPassword !== "string" || currentPassword.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Current password is required"
    });
  }
  
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters long"
    });
  }
  
  next();
};

export const validateSearch = (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.body;
  
  if (query === undefined || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Search query is required and must be a non-empty string"
    });
  }
  
  if (query.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Search query is too long (maximum 100 characters)"
    });
  }
  
  next();
};
