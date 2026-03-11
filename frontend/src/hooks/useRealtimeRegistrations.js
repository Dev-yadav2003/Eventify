import { useEffect } from "react";
import { io } from "socket.io-client";

export const useRealtimeRegistrations = (setEvents) => {
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const socket = io(socketUrl, { transports: ["websocket"] });

    socket.on("registration:update", ({ eventId, registrationsCount }) => {
      setEvents((current) =>
        current.map((event) =>
          event._id === eventId ? { ...event, registrationsCount } : event
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [setEvents]);
};
