import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { setSocketServer } from "./services/socket.js";
import { corsOptions } from "./utils/corsOptions.js";

const port = process.env.PORT || 5000;
const httpServer = http.createServer(app);

httpServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the existing process or change PORT in backend/.env.`);
    process.exit(1);
  }

  console.error("Server startup failed", error);
  process.exit(1);
});

const io = new Server(httpServer, { cors: corsOptions });

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
});

setSocketServer(io);

connectDatabase()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
