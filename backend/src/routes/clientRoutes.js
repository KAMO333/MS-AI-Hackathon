import express from "express";
import {
  handleAiRequest,
  getLatestClient,
} from "../controllers/clientController.js";
import { validateClientRequest } from "../middleware/validateClient.js";

const router = express.Router();

router.get("/client", getLatestClient);

// The middleware runs BEFORE the controller
router.post("/send-to-ai", validateClientRequest, handleAiRequest);

export default router;
