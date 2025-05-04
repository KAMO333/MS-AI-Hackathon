import express from "express";
import "dotenv/config";
import OpenAI from "openai";
import sql from "mssql";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to store client data in database
async function storeClientData(clientData) {
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("name", sql.NVarChar, clientData.name)
      .input("surname", sql.NVarChar, clientData.surname)
      .input("age", sql.Int, clientData.age)
      .input("location", sql.NVarChar, clientData.location)
      .input("issue", sql.NVarChar, clientData.issue)
      .input("response", sql.NVarChar, clientData.response).query(`
        INSERT INTO Clients (name, surname, age, location, issue, response)
        VALUES (@name, @surname, @age, @location, @issue, @response)
      `);
    console.log("Client data stored successfully");
    return result;
  } catch (err) {
    console.error("Error storing client data:", err);
    throw err;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// API endpoint to get client data
app.get("/api/client", (req, res) => {
  res.json({
    name: "John",
    surname: "Doe",
    age: 45,
    location: "Rosebank",
    issue: "Depression",
  });
});

// API endpoint to send message to AI
app.post("/api/send-to-ai", async (req, res) => {
  try {
    const { message, clientData } = req.body;

    const fullMessage = `
    Client Information:
    Name: ${clientData.name} ${clientData.surname}
    Age: ${clientData.age}
    Location: ${clientData.location}
    Primary Issue: ${clientData.issue}
    
    Social Worker's Message:
    ${message}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional Social Worker assistant. Your role is to help social workers by providing advice, support, and guidance for their clients. Consider the client's background information when providing responses.",
        },
        {
          role: "user",
          content: fullMessage,
        },
      ],
    });

    const aiResponse = response.choices[0].message.content;

    await storeClientData({
      ...clientData,
      response: aiResponse,
    });

    res.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
