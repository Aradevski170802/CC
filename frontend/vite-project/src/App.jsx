import React, { useState } from 'react';
import Login from './components/Login';
import Calendar from './components/Calendar';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true); // Switch to the Calendar page
  };

  return (
    <div>
      {isLoggedIn ? (
        <Calendar />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
