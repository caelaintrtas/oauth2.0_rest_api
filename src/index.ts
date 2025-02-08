import express from "express";
import authRoutes from "./routes/auth";
import tokenRoutes from "./routes/token";

// Set express client
const app = express();

// Set express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/api/oauth", authRoutes);
app.use("/api/oauth", tokenRoutes);

// Use PORT from environment or default to 8080
const PORT = process.env.PORT || 8080;

// Start port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
