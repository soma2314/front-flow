import express from "express"
import { createUser } from "../controllers/User/createUser.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { userController } from "../controllers/User/userController.js";
import { getApiKeys } from "../controllers/User/ApiController.js";
import { logoutController, loginController } from "../controllers/User/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/getUserDetails", authMiddleware, userController);
router.get("/logout", authMiddleware, logoutController);
router.post("/login", loginController);
export default router;