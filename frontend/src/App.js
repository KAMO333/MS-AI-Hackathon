//Main component for app's UI
import './App.css';
import React, { useState } from 'react';
import Login from './components/Login';
import Consultation from './components/Consultation'; // Assuming you'll build this later

function App() {
  const [user, setUser] = useState(null);

  // Callback for when login is complete
  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <div className="App">
      {user ? <Dashboard user={user} /> : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;
