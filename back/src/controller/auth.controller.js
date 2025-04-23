import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      profilePic: user.profilePic,
      email: user.email,
      token: user.token,
    });
  } catch (error) {
    console.error(`Error while logging in: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Successfully logged out." });
  } catch (error) {
    console.error(`Error while logging out: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    //hash password

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already in use." });

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "User creation failed." });
    }
  } catch (error) {
    console.log(`Error while signing up user: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (res, req) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  try {
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required." });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found to upload image." });
    }
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      profilePic: updatedUser.profilePic,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error(`Error while uploading image: ${error.message}`);
    return res.status(500).json({ message: "Image upload failed." });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error(`Error while checking auth: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
