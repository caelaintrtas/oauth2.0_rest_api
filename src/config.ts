import crypto from "crypto";

// Retrieves or creates secret key using for JWT
const SECRET_KEY = new TextEncoder().encode(
    process.env.SECRET_KEY || crypto.randomBytes(32).toString("base64") // ✅ Convert Buffer to a base64 string
);

export { SECRET_KEY };
