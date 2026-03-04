import express from "express";
import "dotenv/config";
import OpenAI from "openai";
import cors from "cors";
import { query } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));

// Initialize Groq client using the OpenAI SDK
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Function to store client data in PostgreSQL
async function storeClientData(clientData) {
  const sql = `
    INSERT INTO Clients (name, surname, age, location, issue, response)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    clientData.name,
    clientData.surname,
    clientData.age,
    clientData.location,
    clientData.issue,
    clientData.response,
  ];

  try {
    const res = await query(sql, values);
    console.log("🐘 Client data stored in Postgres:", res.rows[0].id);
    return res.rows[0];
  } catch (err) {
    console.error("❌ Error storing client data:", err);
    throw err;
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
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a professional Social Worker assistant. Help provide advice and guidance based on the client's background.",
        },
        { role: "user", content: fullMessage },
      ],
    });

    const aiResponse = response.choices[0].message.content;

    // Save to PostgreSQL
    await storeClientData({
      ...clientData,
      response: aiResponse,
    });

    res.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
