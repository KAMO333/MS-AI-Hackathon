import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));

// Use the modular routes
app.use("/api", clientRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Modular Server running on http://localhost:${PORT}`);
});
