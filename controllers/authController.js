const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendEmail");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }



    const user = await User.create(
      req.body
    );

    res.status(201).json({
      message: "User created successfully",
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};


exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get user from DB
    const currentUser = await User.findById(decoded.id).select("-password");

    if (!currentUser) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    // 4. Attach user to request
    req.user = currentUser;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized, token invalid",
    });
  }
};
exports.allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to access this route",
      });
    }

    next();
  };
};



/// forget password islemleri

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new Error("This user is not found"));


  const resetCode = crypto.randomInt(100000, 999999).toString();;
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();


  try {
    sendMail({ message: `Hi ${user.name} your reset code is: ${resetCode}`, email: user.email, subject: "this code invalid on 10 minuts" });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new Error("Error in sending email"));
  }

  res
    .status(201)
    .json({ status: "success", message: "Reset Code sent to email" })

})



exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne(
    {
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() }
    }
  );

  if (!user)
    return next(new Error("Reset code invalid or expired"));

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "success" });
})


exports.resetPassword = asyncHandler(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email })
  if (!user)
    return next(new Error("No User with this email"))

  if (!user.passwordResetVerified)
    return next(new Error("Reset Code Not Verified"));


  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = await generateToken(user._id);

  res.status(200).json({ status: "success", token })

})

