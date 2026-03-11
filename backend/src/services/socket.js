let ioInstance;

export const setSocketServer = (io) => {
  ioInstance = io;
};

export const emitRegistrationUpdate = (eventId, registrationsCount) => {
  if (ioInstance) {
    ioInstance.emit("registration:update", { eventId, registrationsCount });
  }
};
