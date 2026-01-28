import express, { Router } from 'express';
import { login, register } from '../controllers/user.controllers.js';


const userRouter= express.Router();


userRouter.post('/register',register);
userRouter.post('/login',login);


export {userRouter};