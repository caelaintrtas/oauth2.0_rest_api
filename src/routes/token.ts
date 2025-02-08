import { Request, Response, Router } from "express";
import { SignJWT, jwtVerify } from "jose";
import { SECRET_KEY } from "../config"; // Shared secret key

const router = Router();

// Expected parameters
const CLIENT_ID = "upfirst";
const REDIRECT_URI = "http://localhost:8081/process";

// Token expirations
const ACCESS_TOKEN_EXPIRATION = 3600; // 1 hour
const REFRESH_TOKEN_EXPIRATION = 86400; // 24 hours

// Verifies authorization code
const verifyCode = async (code: string): Promise<boolean> => {
    try {
        const { payload } = await jwtVerify(code, SECRET_KEY);
        return payload.client_id === CLIENT_ID;
    } catch {
        return false;
    }
};

// Verifies refresh token
const verifyRefreshToken = async (refreshToken: string): Promise<boolean> => {
    try {
        const { payload } = await jwtVerify(refreshToken, SECRET_KEY);
        return payload.type === "refresh_token";
    } catch {
        return false;
    }
};

// Generates new access or refresh token
const generateToken = async (payload: Record<string, unknown>, expiresIn: number): Promise<string> => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
        .sign(SECRET_KEY);
};

// Handles validating code/refresh token and creates new access and refresh token
router.post("/token", async (req: Request, res: Response): Promise<void> => {
    const grant_type = req.body.grant_type as string;
    const code = req.body.code as string;
    const client_id = req.body.client_id as string;
    const redirect_uri = req.body.redirect_uri as string;
    const refresh_token = req.body.refresh_token as string;

    // Invalid parameters
    if ((grant_type !== "authorization_code" && grant_type !== "refresh_token") || client_id !== CLIENT_ID || redirect_uri !== REDIRECT_URI) {
        res.status(400).json({ error: "Invalid token request." });
        return;
    }

    //Authorization code process
    if (grant_type === "authorization_code") {
        if (!code || !(await verifyCode(code))) {
            res.status(400).json({ error: "Invalid or expired authorization code." });
            return;
        }
    } else {
    // Refresh token process
        if (!refresh_token || !(await verifyRefreshToken(refresh_token))) {
            res.status(400).json({ error: "Invalid or expired refresh token." });
            return;
        }
    }

    // Generates new tokens
    const accessToken = await generateToken({ user: "test_user", type: "access_token" }, ACCESS_TOKEN_EXPIRATION);
    const newRefreshToken = await generateToken({ user: "test_user", type: "refresh_token" }, REFRESH_TOKEN_EXPIRATION);

    //Returns payload
    res.json({
        access_token: accessToken,
        token_type: "bearer",
        expires_in: ACCESS_TOKEN_EXPIRATION,
        refresh_token: newRefreshToken
    });
});

export default router;
