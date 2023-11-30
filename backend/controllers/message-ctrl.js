// controllers/message-ctrls.js
const Message = require('../models/message-model');
const fs = require('fs')

const createMessage = async (req, res) => {
    try {
        // Extract data from the request body
        const { text, from, to, fdirect, creator } = req.body;
    
        console.log('Received message:', { text, from, to, fdirect, creator });

        // Create a new message object using your Message model/schema
        const newMessage = new Message({
            text,
            from,
            to,
            fdirect,
            createdAt: new Date(),
            createdBy: creator 
            // You might want to set other fields like createdAt or expiryDate here
        });
  
        // Save the message to the database
        await newMessage.save();
  
        res.status(201).json({ message: 'Message created successfully' });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: `Could not create message: ${error.message}` });
    }
};

const getMessage = async (req, res) => {
    const messageId = req.params.id;
  
    try {
      let message = await Message.findById(messageId).populate('likes', 'email');
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.status(200).json({ message });
    } catch (error) {
      console.error('Error retrieving message:', error);
      res.status(500).json({ error: 'Could not retrieve message' });
    }
  };

// Fetch all messages
const getAllMessages = async (req, res) => {
    try {
      const messages = await Message.find(); // Fetch all messages from the database
      res.status(200).json(messages); // Send the messages as JSON response
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Could not fetch messages' });
    }
  };

// Function to delete old messages
const deleteOldMessages = async (res) => {
    try {
        const currentTime = new Date();
        const oldMessages = await Message.find({ /* your criteria to find old messages */ });

        oldMessages.forEach(async (message) => {
            console.log(`Message to be deleted: ${message.text}`);
            console.log(`Time of posting: ${message.createdAt}`);
            console.log(`Time of deletion: ${currentTime}`);

            const file = `../public/${message.fdirect}`;

            fs.unlink(file, (err) =>{
                if(err){
                    console.error('Error deleting file:', err);
                } else{
                    console.log('File deleted successfully');
                }
            });
            await message.deleteOne(); // Delete the message
        });

    } catch (error) {
        console.error('Error deleting old messages:', error);
    }
};

const deleteMessageById = async (req, res) => {
    const { id } = req.params;
  
    try {
        // Find and delete the message by its _id
        const deletedMessage = await Message.findByIdAndDelete(id);
    
        if (!deletedMessage) {
          return res.status(404).json({ message: 'Message not found' });
        }
    
        res.status(200).json({ message: 'Message deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting message', error });
      }
};

const updateMessageById = async (req, res) => {
    const { id } = req.params;
    const { text, from, to } = req.body;

    try {
        const updatedMessage = await Message.findByIdAndUpdate(id, { text, from, to }, { new: true });
        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message updated successfully', data: updatedMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error updating message', error });
    }
};


const likeMessage = async (req, res) => {
  const messageId = req.params.id;
  const userIdentifier = req.body.userId; // This should be a unique string like email or username

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if the user has already liked the message
    if (message.likes.includes(userIdentifier)) {
      return res.status(400).json({ message: 'User has already liked this message' });
    }

    message.likes.push(userIdentifier);
    await message.save();

    res.status(200).json({ message: 'Message liked successfully' });
  } catch (error) {
    console.error('Error liking message:', error);
    res.status(500).json({ error: 'Could not like message' });
  }
};


const unlikeMessage = async (req, res) => {
  const messageId = req.params.id;
  const userIdentifier = req.body.userId; // This should be a unique string like email or username

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.likes.includes(userIdentifier)) {
      message.likes = message.likes.filter(identifier => identifier !== userIdentifier);
      await message.save();
      res.status(200).json({ message: 'Message unliked successfully' });
    } else {
      res.status(400).json({ message: 'User has not liked this message' });
    }
  } catch (error) {
    console.error('Error unliking message:', error);
    res.status(500).json({ error: 'Could not unlike message' });
  }
};

// If needed, stop the interval after some time or when the app shuts down
// For example, to stop the interval after 7 days
// setTimeout(() => {
//     clearInterval(cleanupInterval);
//     console.log('Cleanup interval stopped.');
// }, 7 * 24 * 60 * 60 * 1000); // Stop after 7 days

module.exports = {
    createMessage,
    getMessage,
    getAllMessages,
    deleteOldMessages,
    deleteMessageById,
    updateMessageById,
    likeMessage,
    unlikeMessage
}