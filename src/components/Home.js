// /src/components/Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import '../Home.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home (){
    const location=useLocation()
    // State for messages
    const [text, setText] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [file, setFile] = useState()
    const [fdirect, setDirectory] = useState('')

    const [searchQuery, setSearchQuery] = useState("");
    const [messages, setMessages] = useState([]);
    
    


    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
          const formData = new FormData();
          formData.append('file', file);
      
          // Upload file
          const uploadResponse = await axios.post('http://localhost:5000/single', formData);
          const fileDirectory = uploadResponse.data.fileDirectory;
          setDirectory(fileDirectory);
          console.log('File uploaded successfully:', fileDirectory);
      
          // Send a message after successful file upload
          const sendMessageResponse = await axios.post('http://localhost:5000/api/messages', {
            text,
            from,
            to,
            fdirect: fileDirectory,
          });
      
          console.log('Message sent:', sendMessageResponse.data);
          alert('Message sent successfully!');
      
          // Clear input fields after successful submission if needed
          setText('');
          setFrom('');
          setTo('');
          setFile(null);
        } catch (error) {
          console.error('Error handling message and/or uploading file:', error);
          alert('Failed to handle message and/or upload file. Please try again.');
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
            fetchMessages();
        }, 5000); //Fetch messages every 10 seconds

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
                    <label for="img-selector">Stamp</label>
                    <input 
                        id="img-selector"
                        type="file"
                        name="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button type="submit">Send</button>
                </div>
            </form>
    
            <hr></hr>

            <input
            className='searchbar'
            type="text"
            placeholder="Search Letters"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />


        
        <div className='letters-container'>
            {/** Display Messages */}
            <div className="letters-section">
                
                {filteredMessages.map((message, index) => (
                        
                    <div className="letter" key={index}>

                        <p className="letter-opening">Dear, {message.to}</p>

                        <p className="letter-body">{message.text}</p>

                        <p className="letter-closing">From, {message.from}</p>

                        <img src={message.fdirect} required></img>


                        {location.state.id === 'admin@admin' && (
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