import User from "../models/user.model.js";
import Message from "../models/message.model.js"; // Import the Message model

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Get the logged-in user's ID from the request object
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }) // Exclude the logged-in user
      .select("-password"); // Exclude password and version fields
    res.status(200).json(filteredUsers); // Send the filtered users as a response
  } catch (error) {
    console.error(`Error in getUserForSidebar: ${error.message}`);
    res.status(500).json({ message: "Internal error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id; // Get the sender's ID from the request object
    const messages = await Message.find({
      $or: [
        { senderId: myIdId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages); // Send the user as a response
  } catch (error) {
    console.error(`Error in getMessages: ${error.message}`);
    res.status(500).json({ message: "Internal error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id; // Get the sender's ID from the request object
    const { text, image } = req.body; // Extract text and image from the request body

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, // Use the secure URL of the uploaded image
    });
    await newMessage.save(); // Save the new message to the database
    // todo real time message ==> socket.io
    // Emit the new message to the receiver using socket.io

    res.status(200).json(newMessage); // Send the user as a response
  } catch (error) {
    console.error(`Error in sendMessage: ${error.message}`);
    res.status(500).json({ message: "Internal error" });
  }
};
