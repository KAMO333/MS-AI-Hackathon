import express from "express";
import "dotenv/config";
import OpenAI from "openai";
import sql from 'mssql';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// Function to store client data in database
async function storeClientData(clientData) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('name', sql.NVarChar, clientData.name)
      .input('surname', sql.NVarChar, clientData.surname)
      .input('age', sql.Int, clientData.age)
      .input('location', sql.NVarChar, clientData.location)
      .input('issue', sql.NVarChar, clientData.issue)
      .input('response', sql.NVarChar, clientData.response)
      .query(`
        INSERT INTO Clients (name, surname, age, location, issue, response)
        VALUES (@name, @surname, @age, @location, @issue, @response)
      `);
    
    console.log('Client data stored successfully');
    return result;
  } catch (err) {
    console.error('Error storing client data:', err);
    throw err;
  } finally {
    sql.close();
  }
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/consultation', async (req, res) => {
  try {
    const { clientData, observation } = req.body;
    
    // Check for existing client
    const existingClient = await findClientByName(clientData.name, clientData.surname);
    
    // Create message for AI
    const fullMessage = `
    Client Background:
    - Name: ${clientData.name}
    - Age: ${clientData.age}
    - Location: ${clientData.location}
    - Current Issue: ${clientData.issue}
    
    Social Worker's Observation/Concern: ${observation}
    
    Please provide professional guidance and support recommendations for this client, considering their background and current situation.`;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional Social Worker assistant. Your role is to help social workers by providing advice, support, and guidance for their clients. You should be empathetic, professional, and focus on evidence-based interventions while maintaining a supportive and non-judgmental approach. Consider the client's background information when providing responses."
        },
        {
          role: "user",
          content: fullMessage,
        },
      ],
    });

    const aiResponse = response.choices[0].message.content;
    
    // Store new client data
    if (!existingClient) {
      await storeClientData({
        ...clientData,
        response: aiResponse
      });
    }

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
