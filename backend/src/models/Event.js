import { query } from "../config/db.js";

const mapEvent = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    date: row.date,
    location: row.location,
    price: Number(row.price),
    capacity: row.capacity,
    registrationsCount: row.registrations_count,
    image: row.image,
    status: row.status,
    organizer: row.organizer_id
      ? {
          _id: row.organizer_id,
          name: row.organizer_name,
          email: row.organizer_email
        }
      : row.organizer,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const eventSelect = `
  SELECT
    e.*,
    u.id AS organizer_id,
    u.name AS organizer_name,
    u.email AS organizer_email
  FROM events e
  JOIN users u ON u.id = e.organizer_id
`;

export const countEvents = async () => {
  const { rows } = await query("SELECT COUNT(*)::int AS count FROM events");
  return rows[0].count;
};

export const createManyEvents = async (events, client) => {
  const created = [];

  for (const event of events) {
    const { rows } = await query(
      `
        INSERT INTO events (
          title,
          description,
          category,
          date,
          location,
          price,
          capacity,
          registrations_count,
          image,
          status,
          organizer_id,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        RETURNING *
      `,
      [
        event.title,
        event.description,
        event.category,
        event.date,
        event.location,
        event.price ?? 0,
        event.capacity ?? 100,
        event.registrationsCount ?? 0,
        event.image ?? "",
        event.status ?? "published",
        event.organizerId
      ],
      client
    );

    created.push(rows[0]);
  }

  return created;
};

export const findEvents = async ({ search, category }) => {
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    const searchParam = `$${params.length}`;
    conditions.push(`(e.title ILIKE ${searchParam} OR e.description ILIKE ${searchParam} OR e.location ILIKE ${searchParam})`);
  }

  if (category && category !== "All") {
    params.push(category);
    conditions.push(`e.category = $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await query(`${eventSelect} ${whereClause} ORDER BY e.date ASC`, params);
  return rows.map(mapEvent);
};

export const findEventsByOrganizer = async (organizerId) => {
  const { rows } = await query(`${eventSelect} WHERE e.organizer_id = $1 ORDER BY e.created_at DESC`, [organizerId]);
  return rows.map(mapEvent);
};

export const findEventById = async (id, client = null) => {
  const { rows } = await query(`${eventSelect} WHERE e.id = $1 LIMIT 1`, [id], client);
  return mapEvent(rows[0]);
};

export const createEvent = async ({ title, description, category, date, location, price = 0, capacity = 100, image = "", status = "published", organizerId }) => {
  const { rows } = await query(
    `
      INSERT INTO events (
        title,
        description,
        category,
        date,
        location,
        price,
        capacity,
        registrations_count,
        image,
        status,
        organizer_id,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `,
    [title, description, category, date, location, price, capacity, image, status, organizerId]
  );

  return findEventById(rows[0].id);
};

export const updateEventForOrganizer = async (id, organizerId, { title, description, category, date, location, price, capacity, registrationsCount, image, status }) => {
  const { rows } = await query(
    `
      UPDATE events
      SET
        title = $3,
        description = $4,
        category = $5,
        date = $6,
        location = $7,
        price = $8,
        capacity = $9,
        registrations_count = $10,
        image = $11,
        status = $12,
        updated_at = NOW()
      WHERE id = $1 AND organizer_id = $2
      RETURNING id
    `,
    [id, organizerId, title, description, category, date, location, price, capacity, registrationsCount, image, status]
  );

  return findEventById(rows[0]?.id);
};

export const deleteEventForOrganizer = async (id, organizerId) => {
  const { rowCount } = await query("DELETE FROM events WHERE id = $1 AND organizer_id = $2", [id, organizerId]);
  return rowCount > 0;
};

export const incrementEventRegistrations = async (id, client) => {
  const { rows } = await query(
    `
      UPDATE events
      SET registrations_count = registrations_count + 1, updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [id],
    client
  );

  return findEventById(rows[0].id, client);
};
