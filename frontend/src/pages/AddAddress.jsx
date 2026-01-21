import React from 'react';
import { assets } from '../assets/assets';

const InputField =({type,placeholder,name,handleChange,address})=> (
    <input 
        className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={handleChange}
        value={address[name]}
        required

    />
)

const AddAddress = () => {

    const submitHandler =async(e)=>{
        e.preventDefault();
    }

  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping
         <span className='font-semibold text-primary'> Address</span>
        </p>
        <div className='flex flex-col-reverse md: flex-row justify-between mt-10'>
            <div className='flex-1 max-w-md'>
                <form onSubmit={submitHandler} className='space-y-3 mt-6 text-sm'>
                      <InputField />
                </form>
            </div>
            <img src={assets.add_address_iamge} alt="address" className='md:mr-16 mb-16 md:mt-0' />
        </div>
    </div>
  );
};

export default AddAddress;