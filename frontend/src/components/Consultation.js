// src/components/Consultation.js
import React, { useState } from 'react';
import axios from 'axios';

const Consultation = ({ user }) => {
  // Client information state
  const [clientName, setClientName] = useState('');
  const [clientSurname, setClientSurname] = useState('');
  const [clientAge, setClientAge] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [clientIssue, setClientIssue] = useState('');
  
  // Social worker observation
  const [observation, setObservation] = useState('');
  
  // API response and status states
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission to fetch AI recommendation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all fields are provided
    if (
      !clientName ||
      !clientSurname ||
      !clientAge ||
      !clientLocation ||
      !clientIssue ||
      !observation
    ) {
      setError('Please fill in all fields.');
      return;
    }

    // Ensure age is a valid number
    const ageInt = parseInt(clientAge, 10);
    if (isNaN(ageInt)) {
      setError('Client age must be a valid number.');
      return;
    }

    setError('');
    setLoading(true);

    // Prepare clientData object as expected by the server
    const clientData = {
      name: clientName,
      surname: clientSurname,
      age: ageInt,
      location: clientLocation,
      issue: clientIssue,
    };

    try {
      // POST request to the /api/consultation endpoint
      const response = await axios.post('/api/consultation', { clientData, observation });
      // Set the recommendation returned from the server
      setRecommendation(response.data.response);
    } catch (err) {
      console.error(
        'Error during consultation API call:',
        err.response ? err.response.data : err.message
      );
      setError('Failed to generate consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consultation-container">
      <h2>Welcome, {user.name}!</h2>
      <p>Your registered email: {user.email}</p>
      
      <form onSubmit={handleSubmit}>
        <h3>Client Information</h3>
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Client Surname"
          value={clientSurname}
          onChange={(e) => setClientSurname(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Client Age"
          value={clientAge}
          onChange={(e) => setClientAge(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Client Location"
          value={clientLocation}
          onChange={(e) => setClientLocation(e.target.value)}
          required
        />
        <textarea
          placeholder="Client Issue"
          value={clientIssue}
          onChange={(e) => setClientIssue(e.target.value)}
          required
        />
        <h3>Your Observation/Concern</h3>
        <textarea
          placeholder="Enter your observation or concern..."
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit Consultation'}
        </button>
      </form>
      
      {recommendation && (
        <div className="recommendation-area">
          <h4>AI's Recommendation:</h4>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default Consultation;
