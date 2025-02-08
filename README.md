# OAuth 2.0 REST API

## Overview

This is a simple OAuth 2.0 REST API built with TypeScript, Express, and JOSE. It supports the Authorization Code Flow and Refresh Token Flow.

## Setup Instructions

### Clone the repository:
```
git clone https://github.com/caelaintrtas/oauth2.0_rest_api.git
cd oauth2.0_rest_api
```
### Install dependencies:
```
npm install
```
### Configure the secret key:
If you want to use a custom secret key, set the SECRET_KEY environment variable.
Otherwise, the application will generate a random secret key using the crypto module.

This is handled in config.ts:
```
import { randomBytes } from "crypto";
export const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY || randomBytes(32).toString("hex"));
```
### Run the project:
```
npm start
```

## API Endpoints

### Authorization Endpoint

- URL: GET /api/oauth/authorize

- Description: Redirects to the provided redirect_uri with an authorization code.

- Example Request:
```
curl -X GET "http://localhost:8080/api/oauth/authorize?response_type=code&client_id=upfirst&redirect_uri=http://localhost:8081/process"
```

### Token Endpoint

- URL: POST /api/oauth/token

- Description: Exchanges an authorization code or refresh token for a new access token.

#### Authorization Code Grant
```
curl -X POST http://localhost:8080/api/oauth/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=authorization_code&code=SOME_AUTH_CODE&client_id=upfirst&redirect_uri=http://localhost:8081/process"
```
#### Refresh Token Grant
```
curl -X POST http://localhost:8080/api/oauth/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=refresh_token&refresh_token=SOME_REFRESH_TOKEN&client_id=upfirst&redirect_uri=http://localhost:8081/process"
```
### Response Example
```
{
  "access_token": "NEW_ACCESS_TOKEN",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "NEW_REFRESH_TOKEN"
}
```
