import React from 'react';

function Letter({ letter, onDelete, onEdit, isAdmin, isCreator }) {
  return (
    <>
    <div className="letter">
      <p className="letter-opening">Dear, {letter.to}</p>
      <p className="letter-body">{letter.text}</p>
      <p className="letter-closing">From, {letter.from}</p>
      <img src={letter.fdirect} required></img>'

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
