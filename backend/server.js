import express, { json, urlencoded } from 'express';
import dotevn from 'dotenv';
dotevn.config({path:'./.env'});
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './src/db/index.js';
import { userRouter } from './src/routes/user.routes.js';
import { sellerRouter } from './src/routes/seller.routes.js';
import { connectCloudinary } from './src/configs/cloudinary.configs.js';
import { productRouter } from './src/routes/product.routes.js';
import { cartRouter } from './src/routes/cart.routes.js';
import { addressRouter } from './src/routes/address.routes.js';
import { orderRouter } from './src/routes/order.routes.js';

const app = express();
const port = process.env.PORT || 3000;

await connectDB();
await connectCloudinary();

//  allow multiples origins
const allowedOrigins=['http://localhost:5173']

//    adding middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:allowedOrigins,credentials:true}));


//            -----  API Endpoints   -----            //


app.get('/',(req,res)=>{
    res.send('Server is listening ...');
})
app.use('/api/user',userRouter);
app.use('/api/seller',sellerRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/address',addressRouter);
app.use('/api/order',orderRouter);


app.listen(port,()=>{
    console.log("Server is listening at port 3000");
})