import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { corsOptions } from "./utils/corsOptions.js";

dotenv.config();

export const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);
