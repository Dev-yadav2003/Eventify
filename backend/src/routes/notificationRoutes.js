import express from "express";
import { getNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, asyncHandler(getNotifications));
router.patch("/:id/read", protect, asyncHandler(markNotificationRead));

export default router;
