// controllers/message-ctrls.js
const Message = require('../models/message-model');

const createMessage = async (req, res) => {
    try {
        // Extract data from the request body
        const { text, from, to } = req.body;
    
        console.log('Received message:', { text, from, to });

        // Create a new message object using your Message model/schema
        const newMessage = new Message({
            text,
            from,
            to,
            createdAt: new Date(),
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
    const messageId = req.params.id; // Assuming the message ID is passed as a parameter in the URL

    try {
        const message = await Message.findById(messageId);

        console.log('Retrieved message:', message);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        return res.status(200).json({ message });
    }   catch (error) {
            console.error('Error retrieving message:', error);
            return res.status(500).json({ error: 'Could not retrieve message' });
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
const deleteOldMessages = async () => {
    try {
        const currentTime = new Date();
        const oldMessages = await Message.find({ /* your criteria to find old messages */ });

        oldMessages.forEach(async (message) => {
            console.log(`Message to be deleted: ${message.text}`);
            console.log(`Time of posting: ${message.createdAt}`);
            console.log(`Time of deletion: ${currentTime}`);

            await message.deleteOne(); // Delete the message
        });

        const deletedCount = oldMessages.length; // Get the count of deleted messages

        res.status(200).json({ message: 'Messages deleted due to expiry' });
        console.log(`Old messages deleted. Count: ${deletedCount}`);
    } catch (error) {
        console.error('Error deleting old messages:', error);
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
}