const { client } = require("../config/mongoDB");
const database = client.db("LearnUp");
const userCollection = database.collection("users");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const { errorHandler } = require("../utilities/errorHandler");
const { generateTokens } = require("../utilities/generateTokens");

exports.signup = async (req, res, next) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    const existingUser = await userCollection.findOne({ userEmail });
    if (existingUser) {
      return next(errorHandler(409, `Email "${userEmail}" is already registered`));
    }

    const verificationToken = jwt.sign(
      { userName, userEmail, userPassword },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://web-innovators-learnup.vercel.app";
    const verificationLink = `${baseUrl}/email-verify?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: userEmail,
      subject: "LearnUP Account Verification",
      html: `
      <h1 style="font-size:26px;">Welcome to <span style="color:rgb(62, 130, 252)">Learn</span><span style="color:rgb(248, 114, 23)">UP</span></h1>
      <p style="font-size:18px;">To complete your registration, please verify your email by clicking the button below.</p>
      <p><a href="${verificationLink}" style="text-decoration:none;background-color:rgb(62, 130, 252); padding:8px; color:rgb(240, 240, 240); font-weight:500; font-size:20px">Verify & Sign in</a>.</p>
      `,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: `Please check "${userEmail}" to verify your account.`,
    });
  } catch (error) {
    next(error);
  }
};

exports.emailVerify = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return next(errorHandler(401, "Missing email verification token"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    } catch (err) {
      return next(errorHandler(401, "Invalid or expired link."));
    }

    const { userName, userEmail, userPassword } = decoded;
    const hashedPassword = bcryptjs.hashSync(userPassword, 10);

    let user = await userCollection.findOne({ userEmail });

    if (!user) {
      user = {
        userName,
        userEmail,
        userPassword: hashedPassword,
        userPhoto:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVlszH7tmKiwhO2EhbnXeR5iQg8ct-k5_MYw&s",
        userRole: "student",
        isVerified: true,
        isGoogle: false,
        createdAt: new Date(),
      };
      await userCollection.insertOne(user);
    }

    const { userPassword: _, ...userInfo } = user;

    const { learnupAccessToken, learnupRefreshToken } = generateTokens(user._id);

    res.cookie("learnupRefreshToken", learnupRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Email verification successful",
      token: learnupAccessToken,
      userInfo,
    });
  } catch (error) {
    next(error);
  }
};

exports.signOut = async (req, res, next) => {
  try {
    res.clearCookie("learnupRefreshToken");

    return res.status(200).json({ success: true, message: "Signout successful" });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { userEmail, userPassword } = req.body;

    const validUser = await userCollection.findOne({ userEmail });
    if (!validUser || !validUser.isVerified) {
      return next(errorHandler(404, "Invalid email or password"));
    }

    const validPassword = await bcryptjs.compare(userPassword, validUser.userPassword);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid email or password"));
    }

    const { learnupAccessToken, learnupRefreshToken } = generateTokens(validUser._id);

    res.cookie("learnupRefreshToken", learnupRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
    });

    const { userPassword: _, ...userInfo } = validUser;

    return res
      .status(201)
      .json({ success: true, message: "Login successful", token: learnupAccessToken, userInfo });
  } catch (error) {
    next(error);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { userEmail } = req.body;

    const existingUser = await userCollection.findOne({ userEmail });
    if (!existingUser) {
      return next(errorHandler(404, `No user found with email "${userEmail}"`));
    }

    const recoveryToken = jwt.sign({ userEmail }, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://web-innovators-learnup.vercel.app";
    const recoveryLink = `${baseUrl}/password-recovery?token=${recoveryToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: userEmail,
      subject: "WDAR Estate Password Reset",
      html: `
        <h1 style="font-size:26px;">Reset Password</h1>
        <p style="font-size:18px;">Click on the following link to reset your password:</p>
        <p><a href="${recoveryLink}" style="text-decoration:none;background-color:rgb(255, 95, 31); padding:8px; color:white; font-weight:500; font-size:20px">Reset Password</a>.</p>
      `,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: `Please check "${userEmail}" to reset your password. Recovery link is valid for 5 minutes.`,
    });
  } catch (error) {
    next(error);
  }
};

exports.recoverPassword = async (req, res, next) => {
  try {
    const { token } = req.query;

    const { newPassword } = req.body;
    if (!newPassword) {
      return next(errorHandler(400, "New password is required"));
    }
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);

    if (!token) {
      return next(errorHandler(400, "Token is missing or invalid"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    } catch (err) {
      return next(errorHandler(401, "Invalid or expired link"));
    }
    const { userEmail } = decoded;

    const updatedUser = await userCollection.findOneAndUpdate(
      { userEmail },
      { $set: { userPassword: hashedPassword } },
      { returnDocument: "after" }
    );

    const { userPassword: _, ...userInfo } = updatedUser;

    const { learnupAccessToken, learnupRefreshToken } = generateTokens(updatedUser._id);

    res.cookie("learnupRefreshToken", learnupRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
      token: learnupAccessToken,
      userInfo,
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshAccessToken = async (req, res, next) => {
  try {
    const learnupRefreshToken = req.cookies.learnupRefreshToken;
    if (!learnupRefreshToken) {
      return next(errorHandler(401, "Missing refresh token. Please sign in again."));
    }

    jwt.verify(learnupRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Invalid refresh token"));
      }

      const { learnupAccessToken } = generateTokens(user.id);

      return res.status(200).json({ success: true, token: learnupAccessToken });
    });
  } catch (error) {
    next(error);
  }
};

exports.googleLogIn = async (req, res, next) => {
  try {
    const { userName, userEmail, userPhoto } = req.body;
    let user = await userCollection.findOne({ userEmail });

    if (!user) {
      const newUser = {
        userName,
        userEmail,
        userPhoto,
        userRole: "student",
        isVerified: true,
        isGoogle: true,
      };

      const insertedUser = await userCollection.insertOne(newUser);
      user = await userCollection.findOne({ _id: insertedUser.insertedId });
    }

    const { learnupAccessToken, learnupRefreshToken } = generateTokens(user._id);

    res.cookie("learnupRefreshToken", learnupRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: user._id ? "Google login successful" : "Google registration successful",
      token: learnupAccessToken,
      userInfo: user,
    });
  } catch (error) {
    next(error);
  }
};
