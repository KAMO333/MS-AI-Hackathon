import express from "express";
import {
  getLatestClient,
  handleAiRequest,
} from "../controllers/clientController.js";
import { validateClientRequest } from "../middleware/validateClient.js";

const router = express.Router();

router.get("/client", getLatestClient);
router.post("/send-to-ai", validateClientRequest, handleAiRequest);

export default router;
