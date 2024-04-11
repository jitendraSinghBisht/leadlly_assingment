import { Secret } from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            MONGODB_URI: string;
            CORS_ORIGIN: string;
            ACCESS_TOKEN_SECRET: Secret;
            ACCESS_TOKEN_EXPIRY: string;
            REFRESH_TOKEN_SECRET: Secret;
            REFRESH_TOKEN_EXPIRY: string;
        }
    }
}