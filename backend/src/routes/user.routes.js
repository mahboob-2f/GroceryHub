import express, { Router } from 'express';
import { isAuth, login, logout, register } from '../controllers/user.controllers.js';
import { authUser } from '../middlewares/authuser.middleware.js';


const userRouter= express.Router();


userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/is-auth',authUser,isAuth);
userRouter.post('/logout',logout);


export {userRouter};