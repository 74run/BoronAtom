const express = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/UserModel');
const UserProfile = require('../models/UserprofileModel')
const UserOTPVerification = require('../models/UserOTPVerification');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const PendingUser = require('../models/PendingUsers')
const crypto = require('crypto');

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal format
        .slice(0, length); // Return required number of characters
};

const secretKey = 'ilovekajal7';



let transporter = nodemailer.createTransport({ 
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'tarunjanapati7@gmail.com',
    pass: 'irdk xweh oqla fcna',
  },
});

const router = express.Router();

const sendOTPVerificationEmail = async (email, _id) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: 'tarunjanapati7@gmail.com',
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete your verification</p>
             <p>This code <b>expires in 1 hour</b>.</p>`
    };

    // Hash the OTP
    const saltRounds = 10;
    const hashedOTP = await bcryptjs.hash(otp, saltRounds);

    // Create a new OTP verification record
    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour expiration
    });

    // Save the OTP record
    await newOTPVerification.save();

    // Send the email
    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.log("Error in sending OTP verification email:", error);
    throw new Error("Failed to send OTP verification email");
  }
};



router.post('/verifyOTP', async (req, res) => {
  try {
    const { otp, userId } = req.body;

   

    if (!otp || !userId) {
      return res.status(400).json({ success: false, message: 'OTP and userId are required.' });
    }

 

    // Check if the user exists in the PendingUser collection
    const pendingUser = await PendingUser.findById(userId);
    if (!pendingUser) {
      console.log('Invalid request. User not found.');
      return res.status(400).json({ success: false, message: 'Invalid request. User not found.' });
    }

    // Find the OTP verification record
    const otpRecord = await UserOTPVerification.findOne({ userId });
    if (!otpRecord) {
      console.log('OTP not found or already used.');
      return res.status(400).json({ success: false, message: 'OTP not found or already used.' });
    }

    // Check if the OTP has expired
    if (otpRecord.expiresAt < Date.now()) {
      await UserOTPVerification.deleteOne({ userId }); // Delete the expired OTP record
      console.log('OTP has expired.');
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Verify the OTP
    const isOtpValid = await bcryptjs.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      console.log('Invalid OTP.');
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    console.log('OTP is valid. Moving user from PendingUser to User.');

    // OTP is valid - move user from PendingUser to User
    const newUser = new User({
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      email: pendingUser.email,
      username: pendingUser.username,
      password: pendingUser.password,
      confirmPassword: pendingUser.confirmPassword,
    });

    await newUser.save();

    // Clean up: Delete the pending user and OTP record
    await PendingUser.findByIdAndDelete(userId);
    await UserOTPVerification.deleteOne({ userId });

    console.log('User email verified successfully.');

    // Respond with success
    res.status(200).json({ success: true, message: 'User email verified successfully. Redirecting to login...' });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.post('/resendOTP', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    // Find the user in the PendingUser collection
    const user = await PendingUser.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    // Generate a new OTP
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const saltRounds = 10;
    const hashedOTP = await bcryptjs.hash(otp, saltRounds);

    // Find the existing OTP record and update it
    const otpRecord = await UserOTPVerification.findOneAndUpdate(
      { userId: userId },
      {
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour expiration
      },
      { new: true, upsert: true } // Create a new record if one doesn't exist
    );

    // Send the new OTP to the user's email
    const mailOptions = {
      from: 'tarunjanapati7@gmail.com',
      to: user.email,
      subject: "Your New OTP Code",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address. This code <b>expires in 1 hour</b>.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'OTP resent successfully.' });
  } catch (error) {
    console.error('Error in resending OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const existingPendingUser = await PendingUser.findOne({ email });
    if (existingPendingUser) {
      return res.status(400).json({ success: false, message: 'A registration with this email is pending verification.' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username is already taken.' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const pendingUser = new PendingUser({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    const result = await pendingUser.save();

    // Attempt to send OTP email
    await sendOTPVerificationEmail(email, result._id);

    // Send the success response only after OTP is successfully sent
    res.status(200).json({ success: true, userId: result._id, message: "Registration successful. OTP sent to email." });

  } catch (error) {
    console.error('Error during registration:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});



router.post('/forgotpassword', async (req, res) => {
  try {
      const { email } = req.body;
      

      if (!email) {
          return res.status(400).json({ status: "FAILED", message: "Enter your email address" });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
          return res.status(404).json({ status: "FAILED", message: "User doesn't exist. Please register first or enter correct email address." });
      }

      // Generate a reset token (optional but recommended for security)
      const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });

      // Construct the reset password link
      const resetLink = `http://boronatom.me/resetpassword?token=${token}`;

      // Define email options
      const mailOptions = {
          from: 'tarunjanapati7@gmail.com',
          to: email,
          subject: "Reset Your Password",
          html: `<p>You requested to reset your password. Click the link below to reset it:</p><a href="${resetLink}">Reset Password</a>`
      };

      // Send email
      await transporter.sendMail(mailOptions);

      return res.status(200).json({
          status: "PENDING",
          message: "Reset Password email sent",
          data: { email },
      });
  } catch (error) {
      return res.status(500).json({
          status: "PASSWORD RESET FAILED",
          message: error.message,
      });
  }
});


router.post('/resetpassword', async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, "jwt_secret_key");
    
    // Find the user by the id embedded in the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user's password with the new hashed password
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    // Respond with success message
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by either username or email
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({ message: 'User does not exist!' });
    }

    // Compare the password using bcryptjs
    const result = await bcryptjs.compare(password, user.password);

    if (result) {
      // Passwords match, generate the token
      const token = jwt.sign({ userId: user._id.toString() }, secretKey, { expiresIn: '1h' });

      // Send back both token and userID to match frontend expectations
      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        token: token,
        userID: user._id.toString()
      });
    } else {
      // Passwords do not match
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Refresh token route
router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    const decoded = jwt.verify(refreshToken, refreshSecretKey); // Decode and validate the refresh token
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAccessToken = jwt.sign({ userId: user._id.toString() }, secretKey, { expiresIn: '1h' });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});



router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const userId = decoded.userId;

      User.findById(userId)
        .then(user => {
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
          // Return relevant user data (without password)
          res.status(200).json({ success: true, user: { username: user.username } });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// router.get('/user', async (req, res) => {
//     try {
//         const userId = req.userId;
//         const userLog = await User.find({ userId });
//         res.status(200).json(userLog);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal server error.' });
//     }
//     });


module.exports = (app) => {
  app.use('/', router);
};
