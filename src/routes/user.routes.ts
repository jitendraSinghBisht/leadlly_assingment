import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser, logoutUser, changePassword, updateUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-user").patch(verifyJWT, updateUser);

export default router;