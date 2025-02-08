"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jose_1 = require("jose");
const config_1 = require("../config"); // Shared secret key
const router = (0, express_1.Router)();
// Expected parameters
const CLIENT_ID = "upfirst";
const REDIRECT_URI = "http://localhost:8081/process";
// Token expirations
const ACCESS_TOKEN_EXPIRATION = 3600; // 1 hour
const REFRESH_TOKEN_EXPIRATION = 86400; // 24 hours
// Verifies authorization code
const verifyCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payload } = yield (0, jose_1.jwtVerify)(code, config_1.SECRET_KEY);
        return payload.client_id === CLIENT_ID;
    }
    catch (_a) {
        return false;
    }
});
// Verifies refresh token
const verifyRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payload } = yield (0, jose_1.jwtVerify)(refreshToken, config_1.SECRET_KEY);
        return payload.type === "refresh_token";
    }
    catch (_a) {
        return false;
    }
});
// Generates new access or refresh token
const generateToken = (payload, expiresIn) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
        .sign(config_1.SECRET_KEY);
});
// Handles validating code/refresh token and creates new access and refresh token
router.post("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grant_type = req.body.grant_type;
    const code = req.body.code;
    const client_id = req.body.client_id;
    const redirect_uri = req.body.redirect_uri;
    const refresh_token = req.body.refresh_token;
    // Invalid parameters
    if ((grant_type !== "authorization_code" && grant_type !== "refresh_token") || client_id !== CLIENT_ID || redirect_uri !== REDIRECT_URI) {
        res.status(400).json({ error: "Invalid token request." });
        return;
    }
    //Authorization code process
    if (grant_type === "authorization_code") {
        if (!code || !(yield verifyCode(code))) {
            res.status(400).json({ error: "Invalid or expired authorization code." });
            return;
        }
    }
    else {
        // Refresh token process
        if (!refresh_token || !(yield verifyRefreshToken(refresh_token))) {
            res.status(400).json({ error: "Invalid or expired refresh token." });
            return;
        }
    }
    // Generates new tokens
    const accessToken = yield generateToken({ user: "test_user", type: "access_token" }, ACCESS_TOKEN_EXPIRATION);
    const newRefreshToken = yield generateToken({ user: "test_user", type: "refresh_token" }, REFRESH_TOKEN_EXPIRATION);
    //Returns payload
    res.json({
        access_token: accessToken,
        token_type: "bearer",
        expires_in: ACCESS_TOKEN_EXPIRATION,
        refresh_token: newRefreshToken
    });
}));
exports.default = router;
