import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  // State variables for the form fields and error messages
  const [councilNo, setCouncilNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!councilNo || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const councilNoInt = parseInt(councilNo, 10);
    if (isNaN(councilNoInt)) {
      setError('Council number must be a valid number.');
      return;
    }

    setError('');

    try {
      // Make API call to the login endpoint
      const response = await axios.post('/api/login', {
        councilNo: councilNoInt,
        email,
        password,
      });

      if (response.data.success) {
        onLogin(response.data.user);
      } else {
        setError(response.data.message || 'Login failed. Please provide valid credentials.');
      }
    } catch (err) {
      console.error('Login API call error:', err.response ? err.response.data : err.message);
      setError('A network error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login to CareMind.</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="councilNo">Council No:</label>
          <br />
          <input
            type="number"
            id="councilNo"
            value={councilNo}
            onChange={(e) => setCouncilNo(e.target.value)}
            placeholder="Enter your council number"
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
