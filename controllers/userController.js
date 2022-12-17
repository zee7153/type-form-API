const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const UserOTPverification = require('../models/optverificationModel')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { profile } = require("console");
const cloudinary = require("cloudinary");
const nodemailer = require("nodemailer")
// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  }).then((result) => {
    //   Generate Token
    const token = generateToken(result._id);
    sendOPTverificationemail(result)
    res.send(result)
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      // sameSite: "none",
      // secure: true,
    });
  }).catch((err) => {
    console.log(err)
  })
});
// ................................................

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //   Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    // sameSite: "none",
    // secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, name, email } = user;
    res.status(200).json({
      _id,
      name,
      email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    // sameSite: "none",
    // secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, password } = user;
    res.status(200).json({
      _id,
      name,
      email,
      password
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { email, name } = user;
    user.email = req.body.email || email;
    user.name = req.body.name || name;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// reset password for google
const setpassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (user) {
    const { password } = user;

    user.password = req.body.password || password;

    const updatedUser = await user.save();
    res.status(200).json({

      password: updatedUser.password,

    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// Change Password

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }
  //Validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  // check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password change successful");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

// ForgotPassword

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // Delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create Resete Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
      <h2>Hello ${user.name}</h2>
      <p>Please use the url below to reset your password</p>  
      <p>This reset link is valid for only 30minutes.</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      <p>Regards...</p>
      <p>Type Form</p>
    `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token, then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // fIND tOKEN in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
});



/// Get All User
const getAll = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (users) {

    res.status(200).json({
      users
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});



const getsingleuser = asyncHandler(async (req, res) => {
  const users = await User.findById({ _id: req.params.id });

  if (users) {

    res.status(200).json({
      users
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});


//send opt verification email

const sendOPTverificationemail = async (result) => {
  const { _id, email } = result
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`

    // mail option
    const milOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email address",
      html: `<h2>Hello</h2>
             <p>Please Enter ${otp} for login </p>  
             <p>This otp is valid for only 60  minutes.</p>
             <p>Regards...</p>
             <p>Type Form</p>` };
    const saltRound = 10;
    const hashedotp = await bcrypt.hash(otp, saltRound);
    const newOTPverification = await new UserOTPverification({
      userId: _id,
      otp: hashedotp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    //save otp code 
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }

    });
    await newOTPverification.save();
    transporter.sendMail(milOption, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
    
    // await transporter.sendEmail(milOption);

    // res.json({
    //   status:"pending",
    //   message:"verification email send to you email address",
    //   data:{
    //     userId:_id,
    //     email,
    //   },
    // })
    //  } catch (error) {
    //   res.json({
    //     status:"Failed",
    //     message:error.message,
    //   })
    //  }
  }catch(error){
    console.log(error)
  }
}


// Verify the otp 

const verifyOPT = async (req, res) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed")
    } else {
      const UserOTPverificationRecords = await UserOTPverification.find({
        userId,
      });
      if (UserOTPverificationRecords.length <= 0) {
        // no record found
        throw new Error(
          "Account record not exist or has been verified. please signup and log in"
        );
      } else {
        // user OTP record exist 
        const { expiresAt } = UserOTPverificationRecords[0];
        const hashedotp = UserOTPverificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          // user otp record has been expired

          await UserOTPverification.deleteMany({ userId });

          throw new Error("code has been expired please try again request");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedotp);

          if (!validOTP) {
            //supplied otp wrong
            throw new Error("invalied code passed check your inbox");
          } else {
            //success
            await User.updateOne({ _id: userId }, { verified: true });
            await UserOTPverification.deleteMany({ userId });
            res.json({
              status: "verified",
              message: `user email verified successfully`
            })
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message
    })
  }
}

// resend the otp for verification


const resendotpverificationcode = async (req, res) => {
  try {
    let { userId, email } = req.body;
    if (!userId || !email) {
      throw Error("Empty user details are not allowed")
    } else {
      await UserOTPverification.deleteMany({ userId });
      sendOPTverificationemail({ _id: userId, email })
      res.send("verification email send to  your email address")
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  getAll,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  setpassword,
  getsingleuser,
  sendOPTverificationemail,
  verifyOPT,
  resendotpverificationcode

}