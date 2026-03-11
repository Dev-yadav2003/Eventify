import { withTransaction } from "../config/db.js";
import { findEventById, incrementEventRegistrations } from "../models/Event.js";
import { createNotification } from "../models/Notification.js";
import { createRegistration as createRegistrationRecord, findRegistration, getRegistrationsByAttendee } from "../models/Registration.js";
import { emitRegistrationUpdate } from "../services/socket.js";

export const createRegistration = async (req, res) => {
  const event = await findEventById(req.params.eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found.");
  }

  const existing = await findRegistration(event._id, req.user._id);

  if (existing) {
    res.status(400);
    throw new Error("You are already registered for this event.");
  }

  if (event.registrationsCount >= event.capacity) {
    res.status(400);
    throw new Error("Event capacity reached.");
  }

  const { registration, updatedEvent } = await withTransaction(async (client) => {
    const registrationRecord = await createRegistrationRecord(
      {
        eventId: event._id,
        attendeeId: req.user._id
      },
      client
    );

    const nextEvent = await incrementEventRegistrations(event._id, client);
    await createNotification(
      {
        userId: event.organizer._id,
        title: "New registration",
        body: `${req.user.name} registered for ${event.title}.`
      },
      client
    );

    return { registration: registrationRecord, updatedEvent: nextEvent };
  });

  emitRegistrationUpdate(updatedEvent._id.toString(), updatedEvent.registrationsCount);

  res.status(201).json(registration);
};

export const getMyRegistrations = async (req, res) => {
  const registrations = await getRegistrationsByAttendee(req.user._id);
  res.json(registrations);
};
