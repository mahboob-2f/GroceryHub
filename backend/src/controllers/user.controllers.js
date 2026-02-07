import validator from 'validator';
import { User } from '../models/users.models.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { registerFormat } from '../configs/registerTemp.js';
import transporter from '../configs/transporter.configs.js';
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if ([name, email, password].some((field) => field?.trim() === "")) {
            return res.status(200)
                .json({
                    success: false,
                    message: "Missing Details ",
                })
        }
        // validating email
        if (!validator.isEmail(email)) {
            return res.status(200)
            .json({
                success: false,
                message: 'Email Invalid',
            })
        }


        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(200)
                .json({
                    success: false,
                    message: "Users already existed.",
                })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        if (!user) {
            return res.status(200)
                .json({
                    success: false,
                    message: "Registration failed",
                })
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: process.env.EXPIRYIN });
        
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7*24*60*60*1000,
        }
        res.cookie('token', token, options);  
        const mailOptions = {
            from: `GroceryHub Team ${process.env.SENDER_EMAIL}`,
            to: email,
            subject: `Welcome ${name}! Your Account Has Been Successfully Created`,
            html: registerFormat(email,name), 
        }

        await transporter.sendMail(mailOptions);


        return res.status(200)
            .json({
                success: true,
                user: { email: user.email, name: user.name },
                message:`Welcome ${name}! Your Account Has Been Successfully Created.`
            })


    } catch (error) {
        console.log("Registration failed  ", error.message);
        return res.status(400)
            .json({
                success: false,
                message: error.message,
            })
    }
}

export const login = async(req,res)=>{
    try{
        const {email, password}= req.body;
        if(
            [email,password].some((item)=>item?.trim()==="")
        ){
            return res.status(200)
                .json({
                    success:false,
                    message:"Missing Inputs"
                })
        }
        if(!validator.isEmail(email)){
            return res.status(200)
                .json({
                    success:false,
                    message:"Invalid Email"
                })
        }
        const existedUser = await User.findOne({email});
        if(!existedUser){
            return res.status(200)
                .json({
                    success:false,
                    message:"Invalid email or password",
                })
        }
        const isPasswordCorrect = await bcrypt.compare(password,existedUser.password);
        if(!isPasswordCorrect){
            return res.status(200)
                .json({
                    success:false,
                    message:"Invalid password",
                })
        }

        const token = jwt.sign({id:existedUser._id},process.env.SECRETKEY,{expiresIn:process.env.EXPIRYIN});
        const options = {
            httpOnly: true,
            secure: true,
            sameSite:  'none',
            maxAge: 7*24*60*60*1000,
        }

        res.cookie('token',token,options);  

        return res.status(200)
            .json({
                success:true,
                user:{name:existedUser.name,email:existedUser.email},
                message:"User logged in successfully", 
            })


    }catch(error){
        console.log(error.message);
        return res.status(400)
            .json({
                success:false,
                message:"Login failed !!!",
            })
    }
}

export const isAuth = async(req,res)=>{
    try{
        const userId= req.user._id;
        // console.log(userId);

        const user= await User.findById(userId).select("-password");
        if(!user){
            return res.status(200) 
                .json({
                    success:false,
                    message:'User is not authenticated',
                })
        }
        return res.status(200)
            .json({
                success:true,
                user:user,
                message:"Authorised User",
            })

    }catch(error){
        console.log(error.message);
        return res.status(400) 
                .json({
                    success:false,
                    message:`not authorised user: ${error.message}`,
                })
    }
}

export const logout = async(req,res)=>{
    try{
        const options = {
            httpOnly: true,
            secure: true,
            sameSite:  'none',
            maxAge: 7*24*60*60*1000,
        }
        res.clearCookie('token',options);

        return res.status(200)
            .json({
                success:true,
                message:"Logged Out",
            })

    }catch(error){
        return res.status(400) 
                .json({
                    success:false,
                    message:'Logged out failed',
                })
    }
}