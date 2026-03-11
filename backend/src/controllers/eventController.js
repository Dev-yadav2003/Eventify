import { sampleEvents } from "../data.js";
import {
  createEvent as createEventRecord,
  createManyEvents,
  deleteEventForOrganizer,
  findEventById,
  findEvents,
  findEventsByOrganizer,
  updateEventForOrganizer,
} from "../models/Event.js";
import { createNotifications } from "../models/Notification.js";
import { countRegistrationsForOrganizer } from "../models/Registration.js";
import {
  createUser,
  findUserByEmail,
  listUsersByRole,
} from "../models/User.js";

const seedOrganizerIfMissing = async () => {
  let organizer = await findUserByEmail("ananya.mehta@rangmanch.in");

  if (!organizer) {
    organizer = await createUser({
      name: "Ananya Mehta",
      email: "ananya.mehta@rangmanch.in",
      password: "password123",
      role: "organizer",
    });
  }

  return organizer;
};

const seedEventsIfNeeded = async () => {
  const organizer = await seedOrganizerIfMissing();
  const existingEvents = await findEvents({});
  const existingTitles = new Set(existingEvents.map((event) => event.title));
  const missingEvents = sampleEvents
    .filter((event) => !existingTitles.has(event.title))
    .map((event) => ({ ...event, organizerId: organizer._id }));

  if (missingEvents.length > 0) {
    await createManyEvents(missingEvents);
  }
};

export const getEvents = async (req, res) => {
  await seedEventsIfNeeded();
  const events = await findEvents(req.query);
  res.json(events);
};

export const getOrganizerDashboard = async (req, res) => {
  const events = await findEventsByOrganizer(req.user._id);
  const totalRegistrations = await countRegistrationsForOrganizer(req.user._id);
  const totalRevenue = events.reduce(
    (sum, event) => sum + event.price * event.registrationsCount,
    0,
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) > new Date(),
  ).length;

  res.json({
    stats: {
      totalEvents: events.length,
      totalRegistrations,
      upcomingEvents,
      totalRevenue,
    },
    events,
  });
};

export const createEvent = async (req, res) => {
  const event = await createEventRecord({
    ...req.body,
    organizerId: req.user._id,
  });

  const attendees = await listUsersByRole("attendee");
  const notificationDocs = attendees.map((user) => ({
    userId: user._id,
    title: "New event published",
    body: `${event.title} is now open for registration.`,
  }));

  if (notificationDocs.length) {
    await createNotifications(notificationDocs);
  }

  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const event = await findEventById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found.");
  }

  if (event.organizer?._id !== req.user._id) {
    res.status(404);
    throw new Error("Event not found.");
  }

  const updatedEvent = await updateEventForOrganizer(
    req.params.id,
    req.user._id,
    {
      ...event,
      ...req.body,
    },
  );

  res.json(updatedEvent);
};

export const deleteEvent = async (req, res) => {
  const deleted = await deleteEventForOrganizer(req.params.id, req.user._id);
  if (!deleted) {
    res.status(404);
    throw new Error("Event not found.");
  }

  res.json({ message: "Event removed." });
};
