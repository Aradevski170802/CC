import React, { useState } from 'react';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Calendar from './components/Calendar';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true); // Switch to the Calendar page
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Log the user out and return to Login page
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main>
        {isLoggedIn ? (
          <Calendar />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
};

export default App;
