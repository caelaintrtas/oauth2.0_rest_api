"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const token_1 = __importDefault(require("./routes/token"));
// Set express client
const app = (0, express_1.default)();
// Set express middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Register routes
app.use("/api/oauth", auth_1.default);
app.use("/api/oauth", token_1.default);
// Use PORT from environment or default to 8080
const PORT = process.env.PORT || 8080;
// Start port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
