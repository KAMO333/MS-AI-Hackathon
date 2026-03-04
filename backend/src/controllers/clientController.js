import { query } from "../db/db.js";
import { generateSocialWorkerAdvice } from "../services/aiService.js";

export const getLatestClient = async (req, res) => {
  try {
    const sql = `SELECT * FROM Clients ORDER BY created_at DESC LIMIT 1;`;
    const result = await query(sql);

    // Senior tip: Return null or 404 if no records exist
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No history found" });
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

    // 1. Validation Guard: Stop early if data is missing
    if (!message || !clientData || !clientData.name) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name and message are mandatory.",
      });
    }

    // 2. Get AI response
    const aiResponse = await generateSocialWorkerAdvice(clientData, message);

    // 3. Prepare SQL for PostgreSQL
    const sql = `
      INSERT INTO Clients (name, surname, age, location, issue, response)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;

    const values = [
      clientData.name,
      clientData.surname || null,
      clientData.age || null,
      clientData.location || null,
      clientData.issue || null,
      aiResponse,
    ];

    // 4. Database execution with safety check
    const dbResult = await query(sql, values);

    if (!dbResult.rows || dbResult.rows.length === 0) {
      throw new Error("Database failed to return the new record ID.");
    }

    const newId = dbResult.rows[0].id;
    console.log("🐘 Client data stored in Postgres:", newId);

    res.json({
      success: true,
      response: aiResponse,
      id: newId,
    });
  } catch (error) {
    console.error("❌ Error in handleAiRequest:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
