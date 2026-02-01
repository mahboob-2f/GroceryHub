import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const { isSeller, setIsSeller, navigate,axios } = useContext(AppContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isSeller) navigate('/seller');
    }, [isSeller]);

    const submitHandler = async (e) => {
        try{
            e.preventDefault();
            const {data}= await axios.post('api/seller/login',{email,password});
            if(data.success){
                setIsSeller(true);
                navigate('/seller');
            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(error.message);
        }
    }

    return !isSeller && (
        <form onSubmit={submitHandler} className='text-gray-600 min-h-screen flex items-center text-sm'>
            <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm: min-w-88 rounded-1g shadow-xl border border-gray-200'>
                <p className='text-2xl font-medium m-auto'><span className='text-primary'>Seller</span>Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='enter your email' className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input  onChange={e => setPassword(e.target.value)} value={password} type="password"  placeholder='enter your password' className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required/> 
                </div>
                <button className='w-full text-white py-2 rounded-md cursor-pointer bg-primary'>Login</button>
            </div>
        </form>
    );
};

export default SellerLogin;
