import { Product } from "../models/products.models.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";


//  add product  --    /api/product/add
export const addProduct = async(req,res)=>{
    try {

        const productData = JSON.parse(req.body.productData);
        const images = req.files;

        let imagesUrl= await Promise.all(
            images.map(async(image)=>{
                let result = await uploadOnCloudinary(image.path,{resource_type:'image'})
                return result.secure_url;
            })
        )

        await Product.create({...productData,image:imagesUrl});
        
        return res.status(200)
                .json({
                    success:true,
                    message:'Product Added',
                })

        // const image = req.file;
        // console.log(image);
        // if(!image){
        //     return res.status(400)
        //         .json({
        //             success:false,
        //             message:"image not found",
        //         })
        // }
        // const result= await uploadOnCloudinary(image.path)
        // console.log(result);
        // return res.status(200)
        //     .json({

        //         success:true,
        //         message:'image uploaded',
        //     })


    } catch (error) {
        return res.status(401)
            .json({
                success:false,
                message:`product is not added: ${error.message}`,
            })
    }
}


//  get product list  --    /api/product/list
export const productList = async(req,res)=>{
    try {

        const products = await Product.find({});
        if(!products){
            return res.status(401)
                .json({
                    success:false,
                    message:'Products not found',
                })
        }
        return res.status(200)
            .json({
                success:true,
                products,
                message:'products found',
            })

    } catch (error) {
        return res.status(401)
            .json({
                success:false,
                message:`Products not found ${error.message}`,
            })
    }
}


//  get single product   --    /api/product/id
export const productById = async(req,res)=>{
    try {
        const {id}= req.body;
        const product = await Product.findById(id);
        if(!product){
            return res.status(401)
                .json({
                    success:false,
                    message:'product not found',
                })
        }
        return res.status(200)
            .json({
                success:true,
                product,
                message:"product found",
            })
        
    } catch (error) {
        return res.status(401)
                .json({
                    success:false,
                    message:`product not found : ${error.message}`,
                })
    }
}


//  change product stock   --    /api/product/stock
export const changeStock = async(req,res)=>{
    try {
        const {id,inStock}= req.body;
        await Product.findByIdAndUpdate(id,{inStock});
        return res.status(200)
            .json({
                success:true,
                message:"stock updated",
            })
    } catch (error) {
        return res.status(401)
                .json({
                    success:false,
                    message:`stock not found : ${error.message}`,
                })
    }
}