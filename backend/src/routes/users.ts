import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, is_admin, archived, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, is_admin, archived, created_at",
      [name, email, passwordHash]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1 AND id != $2", [email, id]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE id = $4",
        [name, email, passwordHash, id]
      );
    } else {
      await pool.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3",
        [name, email, id]
      );
    }

    const result = await pool.query(
      "SELECT id, name, email, is_admin, archived, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/archive", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { archived } = req.body;

  if (typeof archived !== "boolean") {
    res.status(400).json({ error: "archived must be a boolean" });
    return;
  }

  try {
    const result = await pool.query(
      "UPDATE users SET archived = $1 WHERE id = $2 RETURNING id, name, email, is_admin, archived, created_at",
      [archived, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Archive user error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
