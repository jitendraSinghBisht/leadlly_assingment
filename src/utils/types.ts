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

interface ProductQuery {
    page: string | number;
    limit: string | number;
    sortType: string | number;
    sortBy: string;
}

export { UserRequestBody, UserToken, UserDb, ProductQuery }