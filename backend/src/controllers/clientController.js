import { query } from "../db/db.js";
import { generateSocialWorkerAdvice } from "../services/aiService.js";

export const getLatestClient = async (req, res) => {
  try {
    const sql = `SELECT * FROM Clients ORDER BY created_at DESC LIMIT 1;`;
    const result = await query(sql);

    if (result.rows.length === 0) {
      return res.json({
        name: "New",
        surname: "Client",
        age: 0,
        location: "None",
        issue: "No history found",
        response: null,
      });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching client:", error);
    res.status(500).json({ error: "Failed to fetch client data" });
  }
};

export const handleAiRequest = async (req, res) => {
  try {
    const { message, clientData } = req.body;

    // 1. Get AI response from our service
    const aiResponse = await generateSocialWorkerAdvice(clientData, message);

    // 2. Prepare SQL for PostgreSQL
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
      aiResponse,
    ];

    const dbResult = await query(sql, values);
    console.log("🐘 Client data stored in Postgres:", dbResult.rows[0].id);

    res.json({ success: true, response: aiResponse, id: dbResult.rows[0].id });
  } catch (error) {
    console.error("❌ Error in handleAiRequest:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
