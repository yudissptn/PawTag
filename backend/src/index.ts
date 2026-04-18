import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db/index.js";
import authRoutes from "./routes/auth.js";
import userAuthRoutes from "./routes/userAuth.js";
import userRoutes from "./routes/users.js";
import tagRoutes from "./routes/tags.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const uploadsDir = path.join(__dirname, "../uploads");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

app.use(cors({
  origin: ["http://localhost:5173", "https://pawtag-web.onrender.com"],
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Database connection failed" });
  }
});

app.use("/api", userAuthRoutes);
app.use("/api/console", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tags", tagRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
