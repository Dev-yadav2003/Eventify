import bcrypt from "bcryptjs";
import { query, withTransaction } from "../config/db.js";

const mapUser = (row, { includePassword = false } = {}) => {
  if (!row) {
    return null;
  }

  const user = {
    _id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatar: row.avatar,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (includePassword) {
    user.password = row.password;
  }

  return user;
};

export const findUserByEmail = async (email, { includePassword = false } = {}) => {
  const normalizedEmail = email.trim().toLowerCase();
  const { rows } = await query("SELECT * FROM users WHERE email = $1 LIMIT 1", [normalizedEmail]);
  return mapUser(rows[0], { includePassword });
};

export const findUserById = async (id, { includePassword = false } = {}) => {
  const { rows } = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
  return mapUser(rows[0], { includePassword });
};

export const createUser = async ({ name, email, password, role = "attendee", avatar = "" }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const normalizedEmail = email.trim().toLowerCase();

  return withTransaction(async (client) => {
    const { rows } = await query(
      `
        INSERT INTO users (name, email, password, role, avatar, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `,
      [name.trim(), normalizedEmail, passwordHash, role, avatar],
      client
    );

    const user = rows[0];

    if (role === "organizer") {
      await query(
        `
          INSERT INTO organizer_profiles (user_id, organization_name, created_at, updated_at)
          VALUES ($1, $2, NOW(), NOW())
        `,
        [user.id, name.trim()],
        client
      );
    } else {
      await query(
        `
          INSERT INTO attendee_profiles (user_id, city, created_at, updated_at)
          VALUES ($1, $2, NOW(), NOW())
        `,
        [user.id, null],
        client
      );
    }

    return mapUser(user);
  });
};

export const listUsersByRole = async (role) => {
  const { rows } = await query("SELECT * FROM users WHERE role = $1 ORDER BY id ASC", [role]);
  return rows.map((row) => mapUser(row));
};

export const matchPassword = (candidatePassword, passwordHash) => bcrypt.compare(candidatePassword, passwordHash);
