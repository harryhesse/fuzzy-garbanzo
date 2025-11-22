const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

// Registration
router.get("/register", authController.registerForm);
router.post("/register", authController.register);

// Verify email
router.get("/verify/:token", authController.verifyEmail);

// Login
router.get("/login", authController.loginForm);
router.post("/login", authController.login);

// Logout
router.get("/logout", authController.logout);

// Forgot/reset password
router.get("/forgot", authController.forgotForm);
router.post("/forgot", authController.forgotPassword);
router.get("/reset/:token", authController.resetForm);
router.post("/reset/:token", authController.resetPassword);

// Dashboard
router.get("/dashboard", authController.dashboard);

module.exports = router;
