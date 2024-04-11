import { Date, ObjectId } from "mongoose";

interface UserRequestBody {
    userName?: string;
    fullName?: string;
    password?: string;
}

interface UserToken {
    accessToken?: string;
    refreshToken?: string;
}

interface UserDb {
    _id?: ObjectId;
    userName?: string;
    fullName?: string;
    password?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isPasswordCorrect: (a: string) => Promise<boolean>;
    generateRefreshToken: () => string;
    generateAccessToken: () => string;
}

export { UserRequestBody, UserToken, UserDb }