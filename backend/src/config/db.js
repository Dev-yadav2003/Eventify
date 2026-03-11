import { Pool } from "pg";

let pool;

const getPoolConfig = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return {
    connectionString,
    ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
  };
};

const initializeSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'attendee' CHECK (role IN ('organizer', 'attendee')),
      avatar TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS organizer_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      organization_name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS attendee_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      city TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      event_time TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL DEFAULT 0,
      capacity INTEGER NOT NULL DEFAULT 100,
      registrations_count INTEGER NOT NULL DEFAULT 0,
      image TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled')),
      organizer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      attendee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (event_id, attendee_id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS event_time TEXT NOT NULL DEFAULT '';

    UPDATE events
    SET event_time = TO_CHAR(date AT TIME ZONE 'Asia/Kolkata', 'HH24:MI')
    WHERE event_time = ''
       OR event_time LIKE '%AM'
       OR event_time LIKE '%PM';
  `);

  await pool.query(`
    INSERT INTO organizer_profiles (user_id, organization_name, created_at, updated_at)
    SELECT u.id, u.name, NOW(), NOW()
    FROM users u
    WHERE u.role = 'organizer'
      AND NOT EXISTS (
        SELECT 1 FROM organizer_profiles op WHERE op.user_id = u.id
      );

    INSERT INTO attendee_profiles (user_id, city, created_at, updated_at)
    SELECT u.id, NULL, NOW(), NOW()
    FROM users u
    WHERE u.role = 'attendee'
      AND NOT EXISTS (
        SELECT 1 FROM attendee_profiles ap WHERE ap.user_id = u.id
      );
  `);
};

export const connectDatabase = async () => {
  pool = new Pool(getPoolConfig());
  await pool.query("SELECT 1");
  await initializeSchema();
  console.log("PostgreSQL connected");
};

export const query = (text, params = [], client = null) => {
  const executor = client || pool;
  return executor.query(text, params);
};

export const withTransaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
