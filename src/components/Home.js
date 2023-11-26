// /src/components/Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home (){
    const location=useLocation()
    // State for messages
    const [text, setText] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [messages, setMessages] = useState([]);
    
    // Send a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/api/messages', {
            text,
            from,
            to,
            });
            
            console.log('Message sent:', response.data);
            alert('Message sent successfully!');
            
            // Clear input fields after successful submission if needed
            setText('');
            setFrom('');
            setTo('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
        }; // End of handleSendMessage()

    // Display all messages
    const fetchMessages = async () => {
        try {
            console.log('Fetching messages...'); // Log before fetching messages
            const response = await axios.get('http://localhost:5000/api/messages');
            console.log('Messages fetched:', response.data); // Log fetched messages
            setMessages(response.data);
            // console.log(messages); // Log messages to verify

        } catch (error) {   
        console.error('Error fetching messages:', error);
        }
    }; // end of fetchMessages()

    useEffect(() => {
        // const interval = setInterval(() =>{
            fetchMessages();
        // }, 10000); //Fetch messages every 10 seconds

        // return () => clearInterval(interval);
    },[]); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

    const handleDeleteMessage = async (messageId) => {
        try {
            // Make a DELETE request to your backend API endpoint to delete the message
            const response = await axios.delete(`http://localhost:5000/api/messages/${messageId}`);
            
            // Check the response for success or handle as needed
            console.log('Message deleted:', response.data);
            
            // Update the messages state to remove the deleted message from the UI
            setMessages(messages.filter(message => message._id !== messageId));
            
            alert('Message deleted successfully!');
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message. Please try again.');
        }
    }; // end of handleDeleteMessage

return (
    <div className="homepage">

        <h1>Hello {location.state.id} and welcome to the home</h1>
        
            {/* Image for landing page */}
            <img className="logo" src="ephemere.svg" alt="Ephemere Logo"></img>
            {/* Sending messages */}
            <form className="post" onSubmit={handleSendMessage}>
                {/* Text box field */}
                <textarea
                    maxLength="300"
                    name="text"
                    placeholder="Send A Letter."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                ></textarea>
    
                <div>
                    <input
                        maxLength="30"
                        name="from"
                        placeholder="From:"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                    <input
                        maxLength="30"
                        name="to"
                        placeholder="To:"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                    />
                    <button type="submit">Send</button>
                </div>
            </form>
    
            {/** Display Messages */}
            <div className="messages" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2>Messages</h2>
                <div style={{ width: '50%', maxWidth: '600px' }}>
                    {messages.map((message, index) => (
                        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <p><strong>To:</strong> {message.to}</p>
                            {message.from && <p><strong>From:</strong> {message.from}</p>}
                            <p><strong>Text:</strong> {message.text}</p>
                            {/* Show delete button only if user is an admin */}
                            {location.state.role === 'admin' && (
                                <button onClick={() => handleDeleteMessage(message._id)}>Delete</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

    </div>
)
}

export default Home;