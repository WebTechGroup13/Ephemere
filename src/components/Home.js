// /src/components/Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Letter from './Letter.js';
import EditModal from './EditModal';

function Home (){
    const location=useLocation()
    // State for messages
    const [text, setText] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState(null);
    
    // Send a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/api/messages', {
            text,
            from,
            to,
            "creator":location.state.id,
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
        const interval = setInterval(() =>{
            console.log("location.state.id =====>", location.state.id);
            fetchMessages();
        }, 5000); //Fetch messages every 5 seconds

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

    const filteredMessages = messages.filter((message) => {
        const searchText = searchQuery.toLowerCase();
        return (
          message.text.toLowerCase().includes(searchText) ||
          message.from.toLowerCase().includes(searchText) ||
          message.to.toLowerCase().includes(searchText)
        );
      });

    const handleEditMessage = (letter) => {
        console.log("Editing letter:", letter);
        setSelectedLetter(letter);
        setShowEditModal(true);
      };
      
      const handleCloseModal = () => {
        setShowEditModal(false);
        setSelectedLetter(null);
      };
      
      const handleSaveChanges = (letterId, updatedData) => {
        // Update local state with the updated message data
        setMessages(messages.map(message => {
          if (message._id === letterId) {
            return { ...message, ...updatedData };
          }
          return message;
        }));
        handleCloseModal();
      };
      

return (
    <div className="homepage">

        <a>{location.state.id} </a>
        
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

            {showEditModal && selectedLetter && (
            <>
                <div className="modal-backdrop" onClick={handleCloseModal}></div>
                <EditModal
                letter={selectedLetter}
                onClose={handleCloseModal}
                onSave={handleSaveChanges}
                />
            </>
            )}

    
            <hr></hr>

            <input
            className='searchbar'
            type="text"
            placeholder="Search Letters"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />


        
        <div className='letters-container'>
            <div className="letters-section"> 
            {filteredMessages.map((letter, index) => (
                <Letter
                key={index}
                letter={letter}
                onDelete={handleDeleteMessage}
                onEdit={handleEditMessage}
                isAdmin={location.state.id === 'admin@admin'}
                isCreator={letter.createdBy === location.state.id}
                />
            ))}
            </div>
        </div>
    </div>
)
}

export default Home;