import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvents,
  getOrganizerDashboard,
  updateEvent
} from "../controllers/eventController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { uploadEventImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", asyncHandler(getEvents));
router.get("/dashboard/organizer", protect, authorize("organizer"), asyncHandler(getOrganizerDashboard));
router.post("/", protect, authorize("organizer"), uploadEventImage, asyncHandler(createEvent));
router.put("/:id", protect, authorize("organizer"), uploadEventImage, asyncHandler(updateEvent));
router.delete("/:id", protect, authorize("organizer"), asyncHandler(deleteEvent));

export default router;
