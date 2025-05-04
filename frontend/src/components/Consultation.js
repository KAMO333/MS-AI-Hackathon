import React, { useState } from 'react';
import axios from 'axios';

const Consultation = ({ user }) => {
  // Form state for client data
  const [clientName, setClientName] = useState('');
  const [clientSurname, setClientSurname] = useState('');
  const [clientAge, setClientAge] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [clientIssue, setClientIssue] = useState('');
  // State for the social worker's observation
  const [observation, setObservation] = useState('');
  
  // State for API response and status
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: ensure all fields are filled
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
    setError('');
    
    // Convert age to an integer. If conversion fails, halt submission.
    const ageInt = parseInt(clientAge, 10);
    if (isNaN(ageInt)) {
      setError('Client age must be a valid number.');
      return;
    }

    // Prepare clientData payload
    const clientData = {
      name: clientName,
      surname: clientSurname,
      age: ageInt,
      location: clientLocation,
      issue: clientIssue,
    };

    setLoading(true);
    try {
      // POST the consultation data to your backend
      const response = await axios.post('/api/consultation', {
        clientData,
        observation,
      });
      
      // The server returns the AI's recommendation in the 'response' field.
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
