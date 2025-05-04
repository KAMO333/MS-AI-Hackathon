//Main component for app's UI
import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Consultation from './components/Consultation';

function App() {
  const [user, setUser] = useState(null);

  // This callback is passed to the Login component. When login is successful,
  // the Login component will call onLogin with the user data.
  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <div className="App">
      {user ? (
        // Once logged in, with a valid user object, we render the Consultation component.
        <Consultation user={user} />
      ) : (
        // Otherwise, show the login component.
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
