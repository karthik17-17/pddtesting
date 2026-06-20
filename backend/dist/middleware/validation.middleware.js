"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearch = exports.validatePasswordUpdate = exports.validateProfileUpdate = exports.validateResetPassword = exports.validateForgotPassword = exports.validateLogin = exports.validateRegister = void 0;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateRegister = (req, res, next) => {
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
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
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
exports.validateLogin = validateLogin;
const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "A valid email address is required"
        });
    }
    next();
};
exports.validateForgotPassword = validateForgotPassword;
const validateResetPassword = (req, res, next) => {
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
exports.validateResetPassword = validateResetPassword;
const validateProfileUpdate = (req, res, next) => {
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
exports.validateProfileUpdate = validateProfileUpdate;
const validatePasswordUpdate = (req, res, next) => {
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
exports.validatePasswordUpdate = validatePasswordUpdate;
const validateSearch = (req, res, next) => {
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
exports.validateSearch = validateSearch;
