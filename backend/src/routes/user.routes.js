import express, { Router } from 'express';
import { register } from '../controllers/user.controllers.js';


const userRouter= express.Router();


userRouter.post('/register',register);


export {userRouter};