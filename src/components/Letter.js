import React from 'react';
import '../styles/Letter.css'

function Letter({ letter, onDelete, onEdit, isAdmin, isCreator }) {
  return (
    <>
    <div className="letter">
      <img src={letter.fdirect} required></img>
      <p className="letter-opening">Dear, {letter.to}</p>
      <p className="letter-body">{letter.text}</p>
      <p className="letter-closing">From, {letter.from}</p>
      

      </div>
      {isAdmin && (
        <button onClick={() => onDelete(letter._id)}>Delete</button>
      )}
      {isCreator && (
        <button onClick={() => onEdit(letter)}>Edit</button>
      )}
    </>
  );
}

export default Letter;
