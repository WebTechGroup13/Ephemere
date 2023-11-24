// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import io from 'socket.io-client'; // Import 'socket.io-client' instead of 'socketIOClient'

function App() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [text, setText] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [messages, setMessages] = useState([]);
    const [deletedMessageCount, setDeletedMessageCount] = useState(0);

    //Check for deleted message notifications
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         axios.get('http://localhost:5000/api/messages/deleted-messages')
    //             .then(response => {
    //                 setDeletedMessageCount(response.data.count || 0);
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching deleted messages:', error);
    //             });
    //     }, 5000); // Fetch every 5 seconds (adjust interval as needed)

    //     return () => clearInterval(interval); // Cleanup on unmount
    // }, []);  // End of checking for notifications

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        let result = await fetch(
        'http://localhost:5000/user', {
            method: "post",
            body: JSON.stringify({ name, email }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        console.warn(result);
        if (result) {
            alert("Data saved succesfully");
            setEmail("");
            setName("");
        }
    } // end of handleOnSubmit()

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
        const response = await axios.get('http://localhost:5000/api/messages');
        const receivedMessages = response.data;
        // Do something with the messages, such as setting them in a state to display
        console.log(messages); // Log messages to verify

        setMessages(receivedMessages);
        } catch (error) {   
        console.error('Error fetching messages:', error);
        }
    }; // end of fetchMessages()

    useEffect(() => {
        const interval = setInterval(() =>{
            fetchMessages();
        }, 3000); //Fetch messages every 3 seconds

        return () => clearInterval(interval);
    },[]); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

    return (
        <>
            <img className="logo" src="ephemere.svg"></img>
    
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
    
            {/** Render messages to display on the landing page */}
            <div className="messages" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2>Messages</h2>
                <div style={{ width: '50%', maxWidth: '600px' }}>
                    {messages.map((message, index) => (
                        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <p><strong>To:</strong> {message.to}</p>
                            {message.from && <p><strong>From:</strong> {message.from}</p>}
                            <p><strong>Text:</strong> {message.text}</p>
                            {/* Other message fields can be displayed similarly */}
                        </div>
                    ))}
                </div>
            </div>

            {deletedMessageCount > 0 && (
                <div
                    style={{
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'lightgreen',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                >
                    {`${deletedMessageCount} messages have been deleted`}
                </div>
            )}
        </>
    ); // End of return
    

}
 
export default App;
