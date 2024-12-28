import {v2 as cloudinary} from "cloudinary";
import fs from "fs"; 
import dotenv from "dotenv";

dotenv.config();  

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => { 
    
    try {
        if(!filePath) return null;
        const response = await cloudinary.uploader.upload(filePath, { resource_type: "image" });
        // console.log("Files uploaded to cloudinary successfully", response);  
        // console.log("Deleting file from server");  
        fs.unlinkSync(filePath); // remove file from server
        // console.log("File deleted from server"); 
        console.log("Files uploaded to cloudinary successfully");
        
        return response;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(filePath);
        return null;
    }
}

const deleteFromCloudinary = async (cloudinary_id) => {
    try {
        if(!cloudinary_id) return null;
        const response = await cloudinary.uploader.destroy(cloudinary_id);
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary};

