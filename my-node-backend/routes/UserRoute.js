const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const UserOTPVerification = require('../models/UserOTPVerification');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const crypto = require('crypto');

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal format
        .slice(0, length); // Return required number of characters
};

const secretKey = 'ilovekajal7'; // Generate a 32-character (256-bit) random string
console.log("Generated Secret Key:", secretKey);


let transporter = nodemailer.createTransport({ 
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'pvsndeepak@gmail.com',
    pass: 'lhjw wtbj vynb adsl',
  },
});

const router = express.Router();

const sendOTPVerificationEmail = async (email, _id,res) => {
  try {
    console.log('Inside sendotpverificationemail method');
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail options
    const mailOptions = {
      from: 'pvsndeepak@gmail.com',
      to: email,
      subject: "Verify Your Email",
      html: `<p> Enter <b>${otp}</b> in the app to verify your email address and complete your verification </p>
             <p>This code <b>expires in 1 hour</b>.</p>`
    };

    console.log('before hashedOTP');

    //hash the otp
    const saltRounds = 10;
    
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    //save otp record
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status: "PENDING",
      message: "Verification Otp email sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    console.log("Error in sending OTP verification email");
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

//verify otp email
router.post("/verifyOTP", async (req, res) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details re not allowed");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        //no record found
        throw new Error("Account record doesn't exist or has been verified already. please sign up or log in.");
      } else {
        // user otp record exists
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;
        
        if (expiresAt < Date.now()) {
          //user otp record has expired
          
          UserOTPVerification.deleteMany({ userId });
          throw new Error("Code has expired. Please request again.");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if(!validOTP) {
            //supplied otp is wrong
            throw new Error("Invalid code passed. Check your inbox.");
          } else {
            //success
            await User.updateOne({_id: userId }, { verified: true });
            await UserOTPVerification.deleteMany({ userId });
            return res.json({
              status: "VERIFIED",
              message: `User email verified successfully.`,
            });
          }
        }
      }
    }
  } catch(error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, confirmPassword } = req.body;
        console.log(email);
        const existingUser = await User.findOne({ username });

        console.log('exsisting user is:', existingUser);
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'User already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const hpc = await bcrypt.hash(confirmPassword, 10);
        const user = new User({ firstName, lastName, email, username, password: hashedPassword, confirmPassword: hpc });
        console.log('after user schema');
        await user.save().then((result) => {
          //Handle account verification
          sendOTPVerificationEmail(email, result._id, res);
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
});

router.post('/forgotpassword', async (req, res) => {
    try {
        const {email} = req.body;
        const Email = email
        console.log('the email from reqbody is:', email);
        const ForgotPasswordRecords = await User.findOne({email: email});
        if (ForgotPasswordRecords.length <= 0) {
          //no record found
          throw new Error("User doesn't exist. Please register first or enter correct email address ");
        } else {
          console.log('inside else loop');
          if (!email) {
            throw new Error("Enter Your email address");
          }
          // const token = jwt.sign({id: ForgotPasswordRecords.userId}, "jwt_secret_key", {expiresIn: "1d"});
          console.log('before mail options');
          const mailOptions = {
            from: 'pvsndeepak@gmail.com',
            to: email,
            subject: "Reset Your Password",
            html: `http://localhost:3000/resetpassword`
          };
          console.log('after mail options');
          await transporter.sendMail(mailOptions);
          console.log('after transporter send mail');
          return res.json({
            status: "PENDING",
            message: "Reset Password email sent",
            data: {
              Email,
            },
          });
          // return res.json({
          //   status: "PASSWORD RESET SUCCESS",
          //   message: `Password has been changed successfully.`,
          // });
        }
    } catch (error) {
      res.json({
        status: "PASSWORD RESET FAILED",
        message: error.message,
      });
    }
})


router.post('/resetpassword', async (req, res) => {
 
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password with the new hashed password
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;

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
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'User does not exist!' });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          // Handle error
          console.error(err);
        }
      
        if (result) {
          // Passwords match
          const token = jwt.sign({ userId: user._id.toString() }, secretKey, { expiresIn: '1h' }); // Convert _id to string
          console.log('userID:', user._id.toString());
          res.status(200).json({ success: true, message: 'User logged in successfully.', userID: user._id.toString(), token: token});
        } else {
          // Passwords do not match
          return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
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
  app.use('/api', router);
};