import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../routes/auth.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const session = verifyToken(token);
  if (!session) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  (req as any).userId = session.userId;
  (req as any).userEmail = session.userEmail;
  next();
}
