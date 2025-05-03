import React from 'react';

const Login = ({ onLogin }) => {
    // State variables for the form fields and error messages
    const [councilNo, setCouncilNo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); //Prevent the default form submission

        if (!councilNo || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setError('');

        const loginPayload = {councilNo, email, password};

        try {
            onLogin(loginPayload);
        } catch (err) {
            setError('Login failed. Please provide correct credetials');
        }
    };

    return (
        <div className="login-container">
        <h2>Login to CareMind.</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="council no.">Council No:</label><br />
            <input
              type="council no."
              id="council no."
              value={councilNo}
              onChange={(e) => setCouncilNo(e.target.value)}
              placeholder="Enter your council no."
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="email">Email:</label><br />
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
            <label htmlFor="password">Password:</label><br />
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
