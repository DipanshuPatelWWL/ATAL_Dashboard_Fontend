// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Resetpassword from './pages/Resetpassword';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"
          element={
            isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route path="/Resetpassword/:token" element={<Resetpassword />} />
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <Dashboard setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
