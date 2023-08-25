import express, { Router } from "express";
const router: Router = express.Router();
import { login } from '../../controller/auth/authController';

router.post('/', async function (req, res, next) {
    try {
        // logic
        const { email, password } = req.body;
        const result = await login(email, password);

        return res.json(result);
    } catch (error) {
        return error;
    }
});

export default router;