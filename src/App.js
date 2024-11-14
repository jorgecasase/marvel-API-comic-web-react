import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Comics from './components/Comics';
import Profile from './components/Profile'; 
import Header from './components/Header';
import './App.css';

const App = () => {
    return (
      <div className="App">
        <Router>
            <Routes>
                <Route path="/" element={<div><Header/> <Comics /></div>} />
                <Route path="/profile" element={<div><Header/><Profile/></div>} />
            </Routes>
        </Router>
      </div>
    );
};

export default App;