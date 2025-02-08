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
// Generates code
const generateAuthCode = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new jose_1.SignJWT({ client_id: clientId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5m") // Expires in 5 minutes
        .sign(config_1.SECRET_KEY);
});
// Handles verifying parameters and generating url with code
router.get("/authorize", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response_type = req.query.response_type;
    const client_id = req.query.client_id;
    const redirect_uri = req.query.redirect_uri;
    const state = req.query.state;
    if (response_type !== "code" || client_id !== CLIENT_ID || redirect_uri !== REDIRECT_URI) {
        res.status(400).json({ error: "Invalid request parameters" });
        return;
    }
    const authCode = yield generateAuthCode(client_id);
    let redirectUrl = `${redirect_uri}?code=${authCode}`;
    if (state) {
        redirectUrl += `&state=${state}`;
    }
    res.redirect(redirectUrl);
}));
exports.default = router;
