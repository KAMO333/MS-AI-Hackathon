import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

// Mock DB before importing routes
jest.unstable_mockModule("../db/db.js", () => ({
  query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
}));

// Mock controller
jest.unstable_mockModule("../controllers/clientController.js", () => ({
  getLatestClient: (req, res) => res.status(200).json({ name: "John" }),
  handleAiRequest: (req, res) =>
    res.status(200).json({ success: true, response: "Advice" }),
}));

describe("API Endpoints", () => {
  let app;

  beforeAll(async () => {
    const { default: clientRoutes } = await import("../routes/clientRoutes.js");
    app = express();
    app.use(express.json());
    app.use("/api", clientRoutes);
  });

  it("GET /api/client should return 200 or 404 if empty", async () => {
    const res = await request(app).get("/api/client");
    expect([200, 404]).toContain(res.statusCode);
  });

  it("POST /api/send-to-ai should fail if name is missing", async () => {
    const res = await request(app)
      .post("/api/send-to-ai")
      .send({
        message: "Help",
        clientData: { surname: "Doe", issue: "Depression" },
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBeDefined();
  });
});
