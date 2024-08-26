// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Security from './components/Security';
import Agreement from './components/Agreement';
import Quiz from './components/Quiz';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/security" element={<Security />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
