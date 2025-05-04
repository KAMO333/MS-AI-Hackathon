import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
  // Local state for the prompt, recommendation, and any error messages.
  const [prompt, setPrompt] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  // Handler to fetch an AI recommendation from your backend.
  const getRecommendation = async (e) => {
    e.preventDefault();
    
    // Basic validation.
    if (!prompt) {
      setError('Please enter a prompt about the client presenting issue.');
      return;
    }
    
    setError('');
    
    try {
      // Make a POST request to your backend's recommendation endpoint.
      // Ensure your development proxy (or CORS configuration) is set up so that
      // /api/generate correctly routes to your backend.
      const response = await axios.post('/api/generate', { prompt });
      
      // Assume the backend responds with an object like:
      // { recommendation: "Your AI-generated recommendation here" }
      setRecommendation(response.data.recommendation);
    } catch (err) {
      console.error(
        'Error generating recommendation:',
        err.response ? err.response.data : err.message
      );
      setError('Failed to fetch recommendation. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.name}!</h2>
      <p>Your registered email: {user.email}</p>
      
      <div className="recommendation-section">
        <h3>Get an AI Recommendation</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={getRecommendation}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your client's issue or query..."
            rows="4"
            cols="50"
            required
          ></textarea>
          <br />
          <button type="submit">Get Recommendation</button>
        </form>
        {recommendation && (
          <div className="recommendation-display">
            <h4>AI's Recommendation:</h4>
            <p>{recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
