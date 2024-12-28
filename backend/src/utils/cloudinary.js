import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(fileBuffer) => {
    try {
        if (!fileBuffer) return null;

        // Convert buffer to Base64
        const b64 = Buffer.from(fileBuffer).toString('base64');
        const dataURI = "data:image/jpeg;base64," + b64;

        // Upload to Cloudinary
        const response = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(dataURI, {
                resource_type: "auto",
            }, (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });

        console.log("File uploaded to cloudinary successfully");
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};

const deleteFromCloudinary = async(cloudinary_id) => {
    try {
        if (!cloudinary_id) return null;
        const response = await cloudinary.uploader.destroy(cloudinary_id);
        return response;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };