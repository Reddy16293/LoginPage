const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 OTP requests
  message: 'Too many OTP requests. Please try again later.',
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL1, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  otp: { type: String, default: '' },
  otpExpires: { type: Date },
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/auth/login-password', otpLimiter,async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


const SparkPost = require('sparkpost');
const client = new SparkPost(process.env.SPARKPOST_API_KEY);  // Use your SparkPost API key
// const nodemailer = require('nodemailer');  // Import nodemailer


app.post('/api/auth/request-otp', otpLimiter,async (req, res) => {
  const { email } = req.body;
  try {
      let user = await User.findOne({ email });
      if (!user) {
          user = new User({ email }); // Create a new user if not existing
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      // Create a transporter for sending email
      const transporter = nodemailer.createTransport({
          service: 'gmail',  // You can replace 'gmail' with other services or use SMTP
          auth: {
              user: process.env.EMAIL_USER,  // Your Gmail address
              pass: process.env.EMAIL_PASS // Use the app-specific password if 2FA is enabled
          },
          tls: {
              rejectUnauthorized: false  // Disable SSL verification (for dev only)
          }
      });

      // Define email options
      const mailOptions = {
          from: 'chilekampalli2004@gmail.com',  // Your email address
          to: email,  // Recipient's email address
          subject: 'Your OTP Code',
          text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
      };

      // Send the OTP email
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              return res.status(500).json({ message: 'Failed to send OTP' });
          } else {
              console.log('Email sent: ' + info.response);
              res.status(200).json({ message: 'OTP sent successfully' });
          }
      });
  } catch (err) {
      console.error("Error during OTP request:", err);
      res.status(500).json({ message: 'Failed to send OTP' });
  }
});


app.post('/api/auth/login-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = await User.findOne({ email, otp, otpExpires: { $gte: Date.now() } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
      }
      // Clear OTP after successful login
      user.otp = '';
      user.otpExpires = null;
      await user.save();
  
      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  app.post("/api/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "Signup successful" });
    } catch (err) {
      res.status(500).json({ message: "Error signing up" });
    }
  });
  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
