
import LoginForm from './components/LoginForm'
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SolarSystem from './components/SolarSystem'
import NavigationHeader from './components/NavigationHeader';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <NavigationHeader authenticated={authenticated} setAuthenticated={setAuthenticated}/>
      <Routes>
        <Route path="/" element={<SolarSystem />}/>
        <Route path="/login" element={<LoginForm setAuthenticated={setAuthenticated}/>}/>
      </Routes>
 

    </Router>

  );
}

export default App;