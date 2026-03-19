import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async(localFilePath)=>{
    try{
        const options={
            resource_type:'auto',
        }

        const response = await cloudinary.uploader.upload(localFilePath,options);
        
        console.log('file upload successfulyy',response.secure_url);

        // fs.unlinkSync(localFilePath);        //   this will delete from our local system
        return response;

    }catch(error){
        console.log("error in cloudinary function", error.message);
        fs.unlinkSync(localFilePath);
    }
}
export {uploadOnCloudinary};