import express from "express";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { Product } from "../../models/product.models.js";


export const createProductController = async(req, res) => {
    try {
        console.log("createProductController");

        // 1. Auth checks
        if (!req.user) {
            return res.status(401).json({
                message: "Access denied... No token provided..."
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied... You are not authorized to create a product"
            });
        }

        // 2. Validate request body
        const { title, description, price, category, subcategory, quantity, seller } = req.body;

        if (!title || !description || !price || !category || !subcategory || !quantity || !seller) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 3. Check for image file
        if (!req.file) {
            return res.status(400).json({
                message: "Image file is required"
            });
        }

        // 4. Upload to Cloudinary
        console.log("Uploading to cloudinary");
        const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer);

        if (!cloudinaryResponse) {
            return res.status(500).json({
                message: "Failed to upload image"
            });
        }

        // 5. Create and save product
        const product = new Product({
            title,
            description,
            price,
            image: cloudinaryResponse.url,
            category,
            subcategory,
            quantity,
            seller,
            author: req.user.objectId,
            cloudinary_id: cloudinaryResponse.public_id
        });

        console.log("Saving product:", product);
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Error in createProductController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getAdminProducts = async(req, res) => {
    console.log("getAdminProducts");
    console.log("getting the user details from the token");
    if (!req.user) {
        return res.status(401).json({
            message: "Access denied... No token provided..."
        });
    }
    console.log("got the user details");
    console.log("verifying the role of the user");
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied... You are not authorized to view the products"
        });
    }
    console.log("user is admin");
    try {
        console.log("fetching the products from the database");
        const products = await Product.find({ author: req.user.objectId }).select("-author -__v -createdAt -updatedAt");
        console.log("fecthing finished");
        return res.status(200).json({
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error(Fetching products from database)", products });
    }
}

export const editProductController = async(req, res) => {
    console.log("editProductController");
    const { title, description, price, category, quantity, seller } = req.body;
    console.log("getting the user details from the token");
    if (!req.user) {
        return res.status(401).json({
            message: "Access denied... No token provided..."
        });
    }
    console.log("got the user details");
    console.log("verifying the role of the user");
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied... You are not authorized to edit a product"
        });
    }
    console.log("user is admin");
    if (!title || !description || !price || !category || !quantity || !seller) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    console.log("all fields are there");
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        product.title = title;
        product.description = description;
        product.price = price;
        product.category = category;
        product.quantity = quantity;
        product.seller = seller;
        await product.save();
        return res.status(200).json({
            message: "Product updated successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error(Updating product in database)" });
    }
}




// details are there in the 
// req.user
// example
// req.user = {
//     "email": {
//       "objectId": "676d3814e09949b38f63b7b2",
//       "name": "somanth mikali",
//       "email": "somaadmin@123",
//       "role": "admin"
//     },
//     "iat": 1735214138,
//     "exp": 1735300538
//   }

// message from cloudinary {
//     asset_id: '8e736108125567458fc91de0e120be6c',
//     public_id: 'lsnycdy0bzvuzizbiii3',
//     version: 1735234882,
//     version_id: '59acea0066d6c88fce626cc71c9d86f6',
//     signature: '18109f7be27a9ca2609adc48fb8f981a23b32e47',
//     width: 2172,
//     height: 1424,
//     format: 'png',
//     resource_type: 'image',
//     created_at: '2024-12-26T17:41:22Z',
//     tags: [],
//     bytes: 4088979,
//     type: 'upload',
//     etag: '1a545f189775706e3b6244bc232e53ff',
//     placeholder: false,
//     url: 'http://res.cloudinary.com/dxzyrmpsv/image/upload/v1735234882/lsnycdy0bzvuzizbiii3.png',
//     secure_url: 'https://res.cloudinary.com/dxzyrmpsv/image/upload/v1735234882/lsnycdy0bzvuzizbiii3.png',
//     asset_folder: '',
//     display_name: 'lsnycdy0bzvuzizbiii3',
//     original_filename: 'PM',
//     api_key: '981719784175135'
//   }