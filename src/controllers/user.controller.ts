import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { UserDb, UserRequestBody, UserToken } from "../utils/types.js";

const generateAccessAndRefreshTokens = async (user: UserDb): Promise<UserToken> => {
    try {
        const accessToken: string = user.generateAccessToken();
        const refreshToken: string = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error while generating access and referesh token");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, password }: UserRequestBody = req.body

    if (
        [fullName, userName, password].some((field): boolean => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ userName });

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exist");
    }

    const user = await User.create({
        fullName,
        password,
        userName,
    });

    if (!user) {
        throw new ApiError(500, "Registration failed");
    }

    user.password = "";

    return res
        .status(201)
        .json(new ApiResponse(201, user, "User registered Successfully"));
})

const loginUser = asyncHandler(async (req, res) => {
    const { userName, password }: UserRequestBody = req.body;

    if (!(userName && password)) {
        throw new ApiError(400, "Username and Password is required");
    }

    const user: UserDb | null = await User.findOne({ userName });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }

    const { accessToken, refreshToken }: UserToken = await generateAccessAndRefreshTokens(user);

    user.refreshToken = refreshToken;
    user.password = "";

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404,"Invalid user")
    }

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
    const { fullName, userName }: UserRequestBody = req.body;
  
    if (!(fullName || userName)) {
      throw new ApiError(400, "Atleast one feild is required to update");
    }
  
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullName,
          userName,
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404,"Invalid user")
        
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account deatils updated"));
  });

export {registerUser, loginUser, logoutUser, changePassword, updateUser}