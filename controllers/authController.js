const User = require("../models/User");
const nodemailer = require("nodemailer");
const passport = require("passport");

// Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Render forms
exports.registerForm = (req, res) =>
  res.render("auth/register", { messages: req.flash("error") });
exports.loginForm = (req, res) =>
  res.render("auth/login", { messages: req.flash("error") });
exports.forgotForm = (req, res) =>
  res.render("auth/forgot", { messages: req.flash("error") });

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      req.flash("error", "Email already exists");
      return res.redirect("/register");
    }
    user = new User({ name, email, password });
    const token = user.generateVerificationToken();
    await user.save();

    const url = `http://${req.headers.host}/verify/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: `<p>Click to verify: <a href="${url}">${url}</a></p>`,
    });

    res.send("Registration successful! Check your email to verify.");
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.send("Invalid token");
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.render("auth/verify", {
      message: "Email verified! You can now login.",
    });
  } catch (err) {
    res.send("Error verifying email");
  }
};

// Login
exports.login = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true,
});

// Logout
exports.logout = (req, res) => {
  req.logout(() => res.redirect("/login"));
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "Email not found");
      return res.redirect("/forgot");
    }
    const token = user.generateResetToken();
    await user.save();

    const url = `http://${req.headers.host}/reset/${token}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Reset password",
      html: `<p>Click to reset: <a href="${url}">${url}</a></p>`,
    });

    res.send("Check your email for reset link.");
  } catch (err) {
    res.send("Error occurred");
  }
};

// Reset password form
exports.resetForm = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.send("Invalid or expired token");
  res.render("auth/reset", { token: req.params.token });
};

// Reset password
exports.resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.send("Invalid or expired token");

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.send("Password reset successful. You can now login.");
};

// Dashboard
exports.dashboard = (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  res.render("dashboard", { user: req.user });
};
