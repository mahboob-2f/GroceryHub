import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';

const SellerLogin = () => {
    const {isSeller,setIsSeller,navigate}= useContext(AppContext);
    
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState('');

    useEffect(()=>{
        if(isSeller) navigate('/seller');
    },[isSeller]);

    const submitHandler = async(e)=>{
        e.preventDefault();
        setIsSeller(true);
    }

  return !isSeller && (
    <form onSubmit={submitHandler}>
        <div className=''>
            <p className=''><span className=''>Seller</span>Login</p>
        </div>
    </form>
  );
};

export default SellerLogin;