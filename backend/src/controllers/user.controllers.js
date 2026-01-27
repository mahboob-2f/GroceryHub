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
            return res.status(400)
                .json({
                    success: false,
                    message: "Missing Details ",
                })
        }
        // validating email
        if (!validator.isEmail(email)) {
            return res.status(400)
            .json({
                success: false,
                message: 'Email Invalid',
            })
        }
        console.log("here");

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400)
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
            return res.status(400)
                .json({
                    success: false,
                    message: "Registration failed",
                })
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: process.env.EXPIRYIN });
        
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
            maxAge: 7*24*60*60*1000,
        }
        res.cookie('token', token, options);

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: `Welcome ${name}! Your Account Has Been Successfully Created`,
            text: registerFormat(email,name), 
        }

        await transporter.sendMail(mailOptions);


        return res.status(200)
            .json({
                success: true,
                user: { email: user.email, name: user.name }
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