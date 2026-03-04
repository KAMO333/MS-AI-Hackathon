import express from "express";
import {
  getLatestClient,
  handleAiRequest,
} from "../controllers/clientController.js";

const router = express.Router();

router.get("/client", getLatestClient);
router.post("/send-to-ai", handleAiRequest);

export default router;
