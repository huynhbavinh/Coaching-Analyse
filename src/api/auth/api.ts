import express, { Router } from "express";
const router: Router = express.Router();
// import authRouter from "../../controller/user/userController";
import { login } from '../../controller/auth/authController'

router.post('/', async function (req, res, next) {
    // logic
    const a = await login();
    a.lenght
});

module.exports = router;