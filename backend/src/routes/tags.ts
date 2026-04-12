import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../../uploads");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

const router = Router();

router.get("/public/:tagId", async (req: Request, res: Response) => {
  const { tagId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, tag_id, pet_name, owner_id, status, archived, activated_at, address, pet_status, contact, photo
       FROM tags
       WHERE tag_id = $1 AND archived = FALSE`,
      [tagId]
    );
    if (result.rows.length === 0) {
      res.json({ tag: null });
      return;
    }
    res.json({ tag: result.rows[0] });
  } catch (err) {
    console.error("Get tag error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/message", async (req: Request, res: Response) => {
  const { user_id, name, message } = req.body;

  if (!user_id || !message) {
    res.status(400).json({ error: "User ID and message are required" });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO messages (user_id, name, message)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, name, message, is_read, created_at`,
      [user_id, name || null, message]
    );
    res.status(201).json({ message: result.rows[0] });
  } catch (err) {
    console.error("Save message error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/upload/:id", upload.single("photo"), async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    const tagResult = await pool.query("SELECT pet_name, tag_id FROM tags WHERE id = $1", [id]);
    if (tagResult.rows.length === 0) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    const petName = tagResult.rows[0].pet_name || "pet";
    const tagId = tagResult.rows[0].tag_id;
    const ext = path.extname(file.originalname);
    const newFilename = `${petName}_${tagId}${ext}`;
    const newPath = path.join(uploadsDir, newFilename);

    const fs = await import("fs");
    fs.renameSync(file.path, newPath);

    const photoUrl = `/uploads/${newFilename}`;
    await pool.query("UPDATE tags SET photo = $1 WHERE id = $2", [photoUrl, id]);

    res.json({ photo: photoUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.use(requireAuth);

router.get("/mine", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const result = await pool.query(
      `SELECT id, tag_id, pet_name, owner_id, status, archived, activated_at, address, pet_status, contact, photo
       FROM tags
       WHERE owner_id = $1 AND archived = FALSE
       ORDER BY activated_at DESC`,
      [userId]
    );
    res.json({ tags: result.rows });
  } catch (err) {
    console.error("Get user tags error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/messages/unread-count", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM messages WHERE user_id = $1 AND is_read = FALSE",
      [userId]
    );
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error("Get unread count error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/messages", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const result = await pool.query(
      `SELECT id, user_id, name, message, is_read, created_at
       FROM messages
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ messages: result.rows });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/messages/:id/read", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE messages SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING id, is_read`,
      [id, (req as any).userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    res.json({ message: result.rows[0] });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT t.id, t.tag_id, t.pet_name, t.owner_id, u.name AS owner_name, t.status, t.archived, t.activated_at
       FROM tags t
       LEFT JOIN users u ON u.id = t.owner_id
       ORDER BY t.activated_at DESC`
    );
    res.json({ tags: result.rows });
  } catch (err) {
    console.error("Get tags error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { tag_id, pet_name, owner_id, status } = req.body;

  if (!tag_id) {
    res.status(400).json({ error: "Tag ID is required" });
    return;
  }

  try {
    const existingTag = await pool.query("SELECT id FROM tags WHERE tag_id = $1", [tag_id]);
    if (existingTag.rows.length > 0) {
      res.status(409).json({ error: "Tag ID already exists" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO tags (tag_id, pet_name, owner_id, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, tag_id, pet_name, owner_id, status, archived, activated_at`,
      [tag_id, pet_name || null, owner_id || null, status || "Active"]
    );

    res.status(201).json({ tag: result.rows[0] });
  } catch (err) {
    console.error("Create tag error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tag_id, pet_name, owner_id, status, address, pet_status, contact, photo } = req.body;
  const currentUserId = (req as any).userId;

  if (!tag_id) {
    res.status(400).json({ error: "Tag ID is required" });
    return;
  }

  try {
    const existingTag = await pool.query(
      "SELECT id FROM tags WHERE tag_id = $1 AND id != $2",
      [tag_id, id]
    );
    if (existingTag.rows.length > 0) {
      res.status(409).json({ error: "Tag ID already exists" });
      return;
    }

    const currentTag = await pool.query("SELECT owner_id FROM tags WHERE id = $1", [id]);
    if (currentTag.rows.length === 0) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    const effectiveOwnerId = owner_id !== undefined && owner_id !== null ? owner_id : currentUserId;

    const result = await pool.query(
      `UPDATE tags SET tag_id = $1, pet_name = $2, owner_id = $3, status = $4, address = $5, pet_status = $6, contact = $7, photo = $8
       WHERE id = $9
       RETURNING id, tag_id, pet_name, owner_id, status, archived, activated_at, address, pet_status, contact, photo`,
      [tag_id, pet_name || null, effectiveOwnerId, status, address || null, pet_status || null, contact || null, photo || null, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    res.json({ tag: result.rows[0] });
  } catch (err) {
    console.error("Update tag error:", err);
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
      `UPDATE tags SET archived = $1 WHERE id = $2
       RETURNING id, tag_id, pet_name, owner_id, status, archived, activated_at`,
      [archived, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    res.json({ tag: result.rows[0] });
  } catch (err) {
    console.error("Archive tag error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
