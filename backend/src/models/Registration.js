import { query } from "../config/db.js";

const mapRegistration = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    event: row.event_id
      ? {
          _id: row.event_id,
          title: row.event_title,
          description: row.event_description,
          category: row.event_category,
          date: row.event_date,
          location: row.event_location,
          price: Number(row.event_price),
          capacity: row.event_capacity,
          registrationsCount: row.event_registrations_count,
          image: row.event_image,
          status: row.event_status,
          organizer: row.organizer_id
            ? {
                _id: row.organizer_id,
                name: row.organizer_name,
                email: row.organizer_email
              }
            : undefined,
          createdAt: row.event_created_at,
          updatedAt: row.event_updated_at
        }
      : row.event,
    attendee: row.attendee_id,
    quantity: row.quantity,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const findRegistration = async (eventId, attendeeId, client = null) => {
  const { rows } = await query(
    "SELECT * FROM registrations WHERE event_id = $1 AND attendee_id = $2 LIMIT 1",
    [eventId, attendeeId],
    client
  );

  return mapRegistration(rows[0]);
};

export const createRegistration = async ({ eventId, attendeeId, quantity = 1, status = "confirmed" }, client) => {
  const { rows } = await query(
    `
      INSERT INTO registrations (event_id, attendee_id, quantity, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `,
    [eventId, attendeeId, quantity, status],
    client
  );

  return mapRegistration(rows[0]);
};

export const getRegistrationsByAttendee = async (attendeeId) => {
  const { rows } = await query(
    `
      SELECT
        r.*,
        e.id AS event_id,
        e.title AS event_title,
        e.description AS event_description,
        e.category AS event_category,
        e.date AS event_date,
        e.location AS event_location,
        e.price AS event_price,
        e.capacity AS event_capacity,
        e.registrations_count AS event_registrations_count,
        e.image AS event_image,
        e.status AS event_status,
        e.created_at AS event_created_at,
        e.updated_at AS event_updated_at,
        u.id AS organizer_id,
        u.name AS organizer_name,
        u.email AS organizer_email
      FROM registrations r
      JOIN events e ON e.id = r.event_id
      JOIN users u ON u.id = e.organizer_id
      WHERE r.attendee_id = $1
      ORDER BY r.created_at DESC
    `,
    [attendeeId]
  );

  return rows.map(mapRegistration);
};

export const countRegistrationsForOrganizer = async (organizerId) => {
  const { rows } = await query(
    `
      SELECT COUNT(*)::int AS count
      FROM registrations r
      JOIN events e ON e.id = r.event_id
      WHERE e.organizer_id = $1
    `,
    [organizerId]
  );

  return rows[0].count;
};
