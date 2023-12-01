// /src/components/deleteUserModal.js
import React, { useState } from 'react';
import '../styles/EditModal.css';
import axios from 'axios';

function DeleteUserModal({ onClose }) {
    const [email, setEmail] = useState('');
  
    const handleDelete = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/userByEmail/${email}`);
            const user = response.data;

            if (!user) {
                alert('User does not exist.');
                return;
            }
            
            const deleteResponse = await axios.delete(`http://localhost:5000/deleteUser/${user._id}`);
            const data = deleteResponse.data;

            if (data.status === "success") {
                alert('User deleted successfully!');
                onClose(); // Close the modal after successful deletion
            } else if (data.status === "notexist") {
                alert('User does not exist.');
            } else if (data.status === "permissionDenied") {
                alert('Permission denied: You do not have sufficient privileges to delete this user.');
            }
        } catch (error) {
            alert("Failed to delete user. Please try again");
            console.error('Delete user error:', error);
        }
    };
  
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
  
                <div className="input-group">
                <input
                    placeholder='Enter User email to delete:'
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
            <button onClick={handleDelete}>Delete User</button>
        </div>
      </div>
    );
}
  
  export default DeleteUserModal;