import express from "express";
import "dotenv/config";
import OpenAI from "openai";
import readline from "readline/promises";
import sql from 'mssql';

const app = express();
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to find client by name
async function findClientByName(name) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .query('SELECT * FROM Clients WHERE name = @name');
    
    return result.recordset[0]; // Return first matching client or undefined
  } catch (err) {
    console.error('Error finding client:', err);
    throw err;
  } finally {
    sql.close();
  }
}

// Function to get client information from user
async function getClientInfo() {
  const name = await rl.question("Enter client name: ");
  const existingClient = await findClientByName(name);
  
  if (existingClient) {
    console.log("Client found in database!");
    return existingClient;
  }
  
  console.log("New client! Please enter client details:");
  const newClient = {
    name: name,
    surname: await rl.question("Enter surname: "),
    age: parseInt(await rl.question("Enter age: ")),
    location: await rl.question("Enter location: "),
    issue: await rl.question("Enter issue: ")
  };
  
  return newClient;
}

const client1 = {
  name: "kamogelo",
  surname: "xxx",
  age: 25,
  location: "soweto",
  issue: "need help quitting drugs",
};

// Start the server first
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Then start the AI interaction
  startAIInteraction();
});

async function startAIInteraction() {
  try {
    // Get client information
    const clientData = await getClientInfo();
    
    // Get social worker's observation/concern
    const userMessage = await rl.question("Please describe your observation or concern about the client: ");

    // Create a more structured message for the AI
    const fullMessage = `
    Client Background:
    - Name: ${clientData.name}
    - Age: ${clientData.age}
    - Location: ${clientData.location}
    - Current Issue: ${clientData.issue}
    
    Social Worker's Observation/Concern: ${userMessage}
    
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
    
    // Add the response to clientData object
    clientData.response = aiResponse;

    // Only store if it's a new client
    if (!clientData.id) {
      await storeClientData(clientData);
    }

    console.log("\nSuggested plan of action:");
    console.log(aiResponse);

    rl.close();
    process.exit(0); // Exit after completion
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
