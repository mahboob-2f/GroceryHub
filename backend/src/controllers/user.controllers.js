import validator from 'validator';
import { User } from '../models/users.models.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { registerFormat } from '../configs/registerTemp.js';
import { registerOtpFormat } from '../configs/registerOtpTemp.js';
import transporter from '../configs/transporter.configs.js';
import { PendingRegistration } from '../models/pendingRegistration.models.js';
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})

const otpExpiryInMs = 10 * 60 * 1000;

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

const validateRegistrationFields = (name, email, password) => {
    if ([name, email, password].some((field) => field?.trim() === "")) {
        return "Missing Details";
    }

    if (!validator.isEmail(email)) {
        return "Email Invalid";
    }

    if (password.trim().length < 6) {
        return "Password must be at least 6 characters long";
    }

    return null;
}

const normalizeRegistrationPayload = ({ name, email, password }) => ({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
});

const sendRegistrationWelcomeMail = async (name, email) => {
    const mailOptions = {
        from: `GroceryHub Team ${process.env.SENDER_EMAIL}`,
        to: email,
        subject: `Welcome ${name}! Your Account Has Been Successfully Created`,
        html: registerFormat(name, email),
    };

    await transporter.sendMail(mailOptions);
};

export const sendRegisterOtp = async (req, res) => {
    try {
        const normalizedPayload = normalizeRegistrationPayload(req.body);
        const { name, email, password } = normalizedPayload;

        const validationMessage = validateRegistrationFields(name, email, password);
        if (validationMessage) {
            return res.status(200).json({
                success: false,
                message: validationMessage,
            });
        }

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(200).json({
                success: false,
                message: "User already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiresAt = new Date(Date.now() + otpExpiryInMs);

        await PendingRegistration.findOneAndUpdate(
            { email },
            {
                name,
                email,
                password: hashedPassword,
                otp: hashedOtp,
                otpExpiresAt,
                expiresAt: otpExpiresAt,
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        await transporter.sendMail({
            from: `GroceryHub Team ${process.env.SENDER_EMAIL}`,
            to: email,
            subject: 'Your GroceryHub verification code',
            html: registerOtpFormat(name, otp),
        });

        return res.status(200).json({
            success: true,
            message: `OTP sent to ${email}. Verify it to finish registration.`,
        });
    } catch (error) {
        console.log("Send OTP failed", error.message);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const register = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if ([email, otp].some((field) => field?.trim() === "")) {
            return res.status(200).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const pendingRegistration = await PendingRegistration.findOne({ email: normalizedEmail });

        if (!pendingRegistration) {
            return res.status(200).json({
                success: false,
                message: "No pending registration found. Please request a new OTP.",
            });
        }

        if (pendingRegistration.otpExpiresAt < new Date()) {
            await PendingRegistration.deleteOne({ _id: pendingRegistration._id });
            return res.status(200).json({
                success: false,
                message: "OTP expired. Please request a new OTP.",
            });
        }

        const existedUser = await User.findOne({ email: normalizedEmail });
        if (existedUser) {
            await PendingRegistration.deleteOne({ _id: pendingRegistration._id });
            return res.status(200).json({
                success: false,
                message: "User already exists.",
            });
        }

        const isOtpCorrect = await bcrypt.compare(otp.trim(), pendingRegistration.otp);
        if (!isOtpCorrect) {
            return res.status(200).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const user = await User.create({
            name: pendingRegistration.name,
            email: pendingRegistration.email,
            password: pendingRegistration.password,
        });

        await PendingRegistration.deleteOne({ _id: pendingRegistration._id });

        const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: process.env.EXPIRYIN });

        res.cookie('token', token, getCookieOptions());
        await sendRegistrationWelcomeMail(user.name, user.email);

        return res.status(200).json({
            success: true,
            user: { email: user.email, name: user.name },
            message: `Welcome ${user.name}! Your Account Has Been Successfully Created.`,
        });
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
        res.cookie('token',token,getCookieOptions());  

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
        res.clearCookie('token',getCookieOptions());

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
