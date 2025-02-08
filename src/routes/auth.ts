import { Request, Response, Router } from "express";
import { SignJWT } from "jose";
import { SECRET_KEY } from "../config"; // Shared secret key

const router = Router();

// Expected parameters
const CLIENT_ID = "upfirst";
const REDIRECT_URI = "http://localhost:8081/process";

// Generates code
const generateAuthCode = async (clientId: string): Promise<string> => {
    return await new SignJWT({ client_id: clientId})
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5m") // Expires in 5 minutes
        .sign(SECRET_KEY);
};

// Handles verifying parameters and generating url with code
router.get("/authorize", async (req: Request, res: Response): Promise<void> => {
    const response_type = req.query.response_type as string;
    const client_id = req.query.client_id as string;
    const redirect_uri = req.query.redirect_uri as string;
    const state = req.query.state as string | undefined;

    if (response_type !== "code" || client_id !== CLIENT_ID || redirect_uri !== REDIRECT_URI) {
        res.status(400).json({ error: "Invalid request parameters" });
        return;
    }

    const authCode = await generateAuthCode(client_id);
    let redirectUrl = `${redirect_uri}?code=${authCode}`;
    if (state) {
        redirectUrl += `&state=${state}`;
    }

    res.redirect(redirectUrl);
});


export default router;
