const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getAll,
  setpassword,
  getsingleuser,
  verifyOPT,
  resendotpverificationcode
} = require("../controllers/userController");
const protect = require("../middleWare/authMiddleware");
const userOPTverification = require("../models/optverificationModel");
const User = require("../models/userModel");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/setpassword/:id",setpassword);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);
router.get("/getsingleuser/:id", protect, getsingleuser);
router.get("/getAlluser", protect, getAll);
router.get("/loggedin", loginStatus);
router.patch("/updateuser", protect, updateUser);
router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.post("/verifyOPT",verifyOPT)
router.post("/resendotpverificationcode",resendotpverificationcode)




module.exports = router