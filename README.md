# Node.js Authentication MVC App

A **Node.js authentication system** built with the **MVC pattern**, **Express**, **MongoDB**, and **Passport.js**.  
Supports server-side rendered EJS views with full authentication flow.

## Features

- User registration with **email verification**  
- Login/logout with **session-based authentication**  
- Forgot and reset password via email  
- Flash messages for form feedback  
- Secure password hashing with **bcrypt**  
- MongoDB with **Mongoose**  

## Environment Variables

Create a `.env` file in the root:

```env
MONGODB_URI – Your MongoDB connection string
MAIL_HOST – SMTP host for sending emails
MAIL_PORT – SMTP port
MAIL_USER – SMTP username
MAIL_PASS – SMTP password
SESSION_SECRET – A random secret string for session security
