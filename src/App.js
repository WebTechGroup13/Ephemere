// src/App.js
import './App.css';
import './styles/DarkMode.css';
import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import io from 'socket.io-client'; // Import 'socket.io-client' instead of 'socketIOClient'

function App() {
  // State to keep track of dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get the dark mode value from local storage or default to false
    return JSON.parse(localStorage.getItem('darkMode')) || false;
  });

  // Use effect hook to apply the dark mode class to the body element
  useEffect(() => {
    document.body.className = isDarkMode ? 'darkmode' : '';
    // Save the dark mode preference in local storage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      {/* Dark mode toggle with Light/Dark labels */}
      <div className="dark-mode-toggle">
        <div className="switch-container">
          <input
            type="checkbox"
            id="toggle"
            className="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <label htmlFor="toggle" className="switch">
            <span className="toggle-off">Light</span>
            <span className="toggle-on">Dark</span>
          </label>
        </div>
      </div>


      <div className='App'>
        <Router basename="/ephemere">
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/home' element={<Home isDarkMode={isDarkMode} />} />
          </Routes>
        </Router>
      </div>
    </>
  ); // End of return
}

export default App;
