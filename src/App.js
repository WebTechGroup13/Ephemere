// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import io from 'socket.io-client'; // Import 'socket.io-client' instead of 'socketIOClient'

function App() {
  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/home' element={<Home />} />
          </Routes>
        </Router>
      </div>
    </>
  ); // End of return
}

export default App;
