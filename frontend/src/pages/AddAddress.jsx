import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const InputField = ({ type, placeholder, name, handleChange, address }) => (
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

    const {axios,navigate,user}= useContext(AppContext);

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((address) => ({ ...address, [name]: value }));;
    }

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            const {data}= await axios.post('/api/address/add',{address});
            if(data.success){
                toast.success(data.message);
                navigate('/cart');
            }else 
                toast.error(data.message);

        } catch (error) {
                toast.error(error.message);
            
        }
    }
    useEffect(()=>{
        if(!user){
            navigate('/cart');
            // toast.success("Login First");
        }
    },[user])

    return (
        <div className='mt-16 pb-16'>
            <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping
                <span className='font-semibold text-primary'> Address</span>
            </p>
            <div className='flex flex-col-reverse md: flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={submitHandler} className='space-y-3 mt-6 text-sm'>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='firstName' text='text' placeholder='First Name' />
                            <InputField handleChange={handleChange} address={address} name='lastName' text='text' placeholder='Last Name' />
                        </div>
                        <InputField handleChange={handleChange} address={address} name='email' type='email' placeholder='Enter Email' />
                        <InputField handleChange={handleChange} address={address} name='street' type='street' placeholder='Enter Street' />
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='city' type='text' placeholder='Enter City'  />
                            <InputField handleChange={handleChange} address={address} name='state' type='text' placeholder='Enter State'  />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='zipcode' type='number' placeholder='Enter ZipCode'  />
                            <InputField handleChange={handleChange} address={address} name='country' type='text' placeholder='Enter Country'  />
                        </div>
                        <InputField handleChange={handleChange} address={address} name='phone' type='text' placeholder='Enter Phone ' />
                        <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>
                            save Address
                        </button>
                    </form>
                </div>
                <img src={assets.add_address_iamge} alt="address" className='md:mr-16 mb-16 md:mt-0' />
            </div>
        </div>
    );
};

export default AddAddress;