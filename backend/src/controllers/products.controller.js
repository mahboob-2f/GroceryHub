import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";


//  add product  --    /api/product/add
export const addProduct = async(req,res)=>{
    try {
        const image = req.file;
        console.log(image);
        if(!image){
            return res.status(400)
                .json({
                    success:false,
                    message:"image not found",
                })
        }
        const result= await uploadOnCloudinary(image.path)
        console.log(result);
        return res.status(200)
            .json({

                success:true,
                message:'image uploaded',
            })


    } catch (error) {
        return res.status(401)
            .json({
                success:false,
                message:'product is not added',
            })
    }
}


//  get product list  --    /api/product/list
export const productList = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}


//  get single product   --    /api/product/id
export const productById = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}


//  change product stock   --    /api/product/stock
export const changeStock = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}