import express from "express";
import { createRegistration, getMyRegistrations } from "../controllers/registrationController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, authorize("attendee"), asyncHandler(getMyRegistrations));
router.post("/:eventId", protect, authorize("attendee"), asyncHandler(createRegistration));

export default router;
