import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//add more feilds as per requirement
//eg:- product visited, buy history, bookmarked etc...
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true })

//hash the password if the password is changed or created
userSchema.pre("save",async function(next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,10)
    }
    next();
})

//Methods
// this check the password is correct or not
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password,this.password)
}
//this generates the access token
userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        { _id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
//this generates the refresh token
userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)