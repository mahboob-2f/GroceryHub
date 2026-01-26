import express, { json } from 'express';
import dotevn from 'dotenv';
dotevn.config({path:'./.env'});
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './src/db/index.js';

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

//  allow multiples origins
const allowedOrigins=['http://localhost:5173 ']

//    adding middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));

app.get('/',(req,res)=>{
    res.send('Server is listening ...');
})

app.listen(port,()=>{
    console.log("Server is listening at port 3000");
})