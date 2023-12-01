import React from 'react';
import '../styles/Letter.css';

function Letter({ letter, onDelete, onEdit, onLike, isAdmin, isCreator }) {
  // Function to handle the like button click
  const handleLike = () => {
    console.log(`Liking message with ID: ${letter._id}`);
    onLike(letter._id);
  };

  return (
    <>
      <div className="letter">
        {/* Only display the img if letter.fdirect has a value */}
        {letter.fdirect && <img src={letter.fdirect} alt="Letter" />}
        <p className="letter-opening">Dear, {letter.to}</p>
        <p className="letter-body">{letter.text}</p>
        <p className="letter-closing">From, {letter.from}</p>
        <div className="letter-actions">
          <button className="like-button" onClick={handleLike}>
            ❤️ 
          </button>
          <span className="like-count">{letter.likes?.length || 0}</span>
        </div>
      </div>
      {(isAdmin || isCreator) && (
        <button className="delete-button" onClick={() => onDelete(letter._id)}>Delete</button>
      )}
      {isCreator && (
        <button className="edit-button" onClick={() => onEdit(letter)}>Edit</button>
      )}
    </>
  );
}

export default Letter;
