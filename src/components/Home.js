    // /src/components/Home.js

    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import {useLocation} from 'react-router-dom';
    import '../styles/Home.css'
    import Letter from './Letter.js';
    import EditModal from './EditModal';
    import SettingsModal from './SettingsModal.js';
    import DeleteUserModal from './deleteUserModal'; // Import the DeleteUserModal component


    function Home ({ }){
        const location=useLocation()
        const isAdmin = location.state && location.state.id === 'admin@admin';

        // State for messages
        const [text, setText] = useState("");
        const [from, setFrom] = useState("");
        const [to, setTo] = useState("");
        const [file, setFile] = useState()
        const [fdirect, setDirectory] = useState('')

        const [searchQuery, setSearchQuery] = useState("");
        const [messages, setMessages] = useState([]);

        const [showEditModal, setShowEditModal] = useState(false);
        const [selectedLetter, setSelectedLetter] = useState(null);
        const [showSettingsModal, setShowSettingsModal] = useState(false);
        const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

        const handleSendMessage = async (e) => {
            e.preventDefault();

            try {
                if (file){
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
                        "creator":location.state.id,
                        fdirect: fileDirectory,
                        
                    });

                    console.log('Message sent:', sendMessageResponse.data);
                    alert('Message sent successfully!');
                } else {
                    // Send a message after successful file upload
                    const sendMessageResponse = await axios.post('http://localhost:5000/api/messages', {
                    text,
                    from,
                    to,
                    "creator":location.state.id,
                    });

                    console.log('Message sent:', sendMessageResponse.data);
                    alert('Message sent successfully!');
                }
        
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
                console.log('Fetching User...'); // Log before fetching messages
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
                console.error('Error deleting message this is it:', error);
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
            setShowSettingsModal(false);
            setSelectedLetter(null);
            setShowDeleteUserModal(false);
        };

        const handleDeleteUser = () => {
            if(isAdmin){
                setShowDeleteUserModal(true);
            }
        }

        const handleEditPassword = () => {
            console.log("Opening Modal");
            setShowSettingsModal(true);
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



            <button onClick={handleEditPassword}>SETTINGS</button>
            {isAdmin &&(
            <button onClick={handleDeleteUser}>Delete User</button>
            )}

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
                        <label htmlFor="img-selector">Stamp</label>
                        <input 
                            id="img-selector"
                            type="file"
                            name="file"
                            onChange={(e) => setFile(e.target.files[0])}
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

                {showSettingsModal && (
                <>
                    <div className="modal-backdrop" onClick={handleCloseModal}></div>
                    <SettingsModal
                    user={location.state.id}
                    onClose={handleCloseModal}
                    />
                </>
                )}

                {showDeleteUserModal && (
                <>    
                    <div className="modal-backdrop" onClick={handleCloseModal}></div>
                    <DeleteUserModal
                        onClose={handleCloseModal}
                        /* Pass necessary props to DeleteUserModal */
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