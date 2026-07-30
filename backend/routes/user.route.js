import express from "express"
import { checkMe, login, signup } from "../controllers/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", isAuth, checkMe);

export default router;