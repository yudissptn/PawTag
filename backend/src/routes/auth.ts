import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../db/index.js";

const router = Router();

export const sessions = new Map<string, { userId: number; userEmail: string }>();

export function verifyToken(token: string) {
  return sessions.get(token) || null;
}

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const user = result.rows[0];

    if (!user.is_admin) {
      res.status(403).json({ error: "Access denied. Admin privileges required." });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = crypto.randomUUID();
    sessions.set(token, { userId: user.id, userEmail: user.email });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    sessions.delete(token);
  }
  res.json({ message: "Logged out" });
});

router.get("/session", (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const session = token ? sessions.get(token) : null;

  if (session) {
    res.json({
      authenticated: true,
      user: { id: session.userId, email: session.userEmail },
    });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;
