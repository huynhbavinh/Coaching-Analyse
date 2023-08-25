import express, { Router } from "express";
const router: Router = express.Router();
import authRouter from "../../controller/user/userController";
import { login } from '../../controller/auth/authController';

router.post('/', async function (req, res, next) {
    // logic
    login(req, res);
});

export default router;