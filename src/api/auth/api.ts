import express, { Router } from "express";
const router: Router = express.Router();
import authRouter from "../../controller/user/userController";

router.post('/', authRouter.login);

export default router;