import express, { json } from 'express';
import dotevn from 'dotenv';
dotevn.config({path:'./.env'});
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './src/db/index.js';
import { userRouter } from './src/routes/user.routes.js';
import { sellerRouter } from './src/routes/seller.routes.js';
import { connectCloudinary } from './src/configs/cloudinary.configs.js';

const app = express();
const port = process.env.PORT || 3000;

await connectDB();
await connectCloudinary;

//  allow multiples origins
const allowedOrigins=['http://localhost:5173 ']

//    adding middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));


//            -----  API Endpoints   -----            //


app.get('/',(req,res)=>{
    res.send('Server is listening ...');
})
app.use('/api/user',userRouter);
app.use('/api/seller',sellerRouter);


app.listen(port,()=>{
    console.log("Server is listening at port 3000");
})