const defaultAllowedOrigins = ["http://localhost:5173"];

const normalizeOrigin = (origin) => origin.replace(/\/$/, "");

const getAllowedOrigins = () => {
  const rawOrigins = process.env.CLIENT_URL;

  if (!rawOrigins) {
    return defaultAllowedOrigins;
  }

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(normalizeOrigin);
};

export const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  }
};
