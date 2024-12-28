import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({ 
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    subcategory: {
        type: String, 
        required: true
    },
    quantity: {
        type: Number, 
        required: true
    },
    seller:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cloudinary_id: {
        type: String,
        required: true
    },
}, { timestamps: true });   

export const Product = mongoose.model("Product", productSchema); 