import React from 'react';
import '../styles/EditModal.css';
import axios from 'axios';

function EditModal({ letter, onClose, onSave }) {
  const [editedText, setEditedText] = React.useState(letter.text);
  const [editedFrom, setEditedFrom] = React.useState(letter.from);
  const [editedTo, setEditedTo] = React.useState(letter.to);

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/messages/${letter._id}`, {
        text: editedText,
        from: editedFrom,
        to: editedTo,
      });
      console.log('Message updated:', response.data);
      onSave(letter._id, { text: editedText, from: editedFrom, to: editedTo });
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Failed to update message. Please try again.');
    }
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>

        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />

        <div className="input-group">
          <label htmlFor="from">From:</label>
          <input
            id="from"
            type="text"
            value={editedFrom}
            onChange={(e) => setEditedFrom(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="to">To:</label>
          <input
            id="to"
            type="text"
            value={editedTo}
            onChange={(e) => setEditedTo(e.target.value)}
          />
        </div>

        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

export default EditModal;

