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
    // Get single user input
    const userMessage = await rl.question("Your message to AI: ");

    // Create raw combined message
    const fullMessage = `
    Client Data: 
    ${JSON.stringify(client1, null, 2)}
    
    Message: ${userMessage}
    `;

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
    
    // Add the response to client1 object
    client1.response = aiResponse;

    // Store client data in database with the response
    await storeClientData(client1);

    console.log("\nAI Response:");
    console.log(aiResponse);

    rl.close();
    process.exit(0); // Exit after completion
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
