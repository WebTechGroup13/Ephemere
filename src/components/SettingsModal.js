import React from 'react';
import '../styles/EditModal.css';
import axios from 'axios';

function SettingsModal({user, onClose}) {

  const [editedPassword, setEditedPassword] = React.useState();


  const handleSave = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/password`, { //change to edit password api
      email: user,
      password: editedPassword,
        
      });
      console.log('password updated:', response.data);
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error('updating password:', error);
      alert('Failed to update password. Please try again.');
    }
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>

            <div className="input-group">
            <input
                id="from"
                placeholder='Change Password:'
                type="text"
                value={editedPassword}
                onChange={(e) => setEditedPassword(e.target.value)}
            />
            </div>

        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

export default SettingsModal;

