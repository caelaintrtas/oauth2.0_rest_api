"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Retrieves or creates secret key using for JWT
const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY || crypto_1.default.randomBytes(32).toString("base64") // ✅ Convert Buffer to a base64 string
);
exports.SECRET_KEY = SECRET_KEY;
