import express from "express";
import userRouter from "./user/api";
import authRouter from "./auth/api";

function route(app: express.Application){
    app.use('/user', userRouter);
    app.use('/login', authRouter);
    app.use('/', userRouter);
    app.use('/', userRouter);
    app.use('/', userRouter);
}
export default route; 