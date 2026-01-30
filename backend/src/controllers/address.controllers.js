import { Address } from "../models/address.models";


//   address add --   /api/address/add


export const addAddress = async(req,res)=>{
    try {
        
        const userId = req.user._id;
        const {address}= req.body;

        await Address.create({...address,userId});
        return res.status(200)
            .json({
                success:true,
                message:'Address added successfully.',
            })

    } catch (error) {
        return res.status(401)
            .json({
                success:false,
                message:`Address not added : ${error.message}`,
            })
    }
}

// get address --  /api/address/get

export const getAddress= async(req,res)=>{
    try {
        const userId = req.user._id;
        const addresses = await Address.find({userId});
        if(!addresses){
            return res.status(401)
            .json({
                success:false,
                message:'addresses not found',
            })
        }
        return res.status(200)
            .json({
                success:true,
                addresses,
                message:'addresses found  !!!',
            })
    } catch (error) {
        return res.status(401)
            .json({
                success:false,
                message:`not found addresses : ${error.message}`,
            })
    }
}