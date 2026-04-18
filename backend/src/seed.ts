import "dotenv/config";
import bcrypt from "bcrypt";
import pool from "./db/index.js";

const seed = async () => {
  const email = "admin@pawtag.com";
  const password = "admin123";
  const name = "Admin";

  const hash = await bcrypt.hash(password, 10);
  console.log("Password hash:", hash);

  try {
    await pool.query(
      `INSERT INTO users (name, email, password_hash, is_admin)
       VALUES ($1, $2, $3, TRUE)
       ON CONFLICT (email) DO UPDATE SET name = $1, password_hash = $3`,
      [name, email, hash]
    );
    console.log(`Admin user created: ${email} / ${password}`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await pool.end();
  }
};

seed();