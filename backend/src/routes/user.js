import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js";
import { userController } from "../controllers/User/userController.js";
import { dummyController } from "../controllers/dummyController/dummyControl.js";

const router = express.Router();

router.get("/getUserDetails", authMiddleware, userController);
// router.post("/login",authMiddleware,login); for accessing the right products
export default router;