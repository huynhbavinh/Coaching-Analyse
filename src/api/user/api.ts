import express, { Router } from "express";
const router: Router = express.Router();
import userController from "../../controller/user/userController";
import verifyToken from "../../controller/middleware/auth";

router.post('/signup',);

router.get('/view',verifyToken, userController.viewUser);
router.post('/token', userController.token);
// router.delete('/logout',verifyToken, userController.logout);


export default router;