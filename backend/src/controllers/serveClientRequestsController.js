import express from "express";
import { Product } from "../models/product.models.js";


export const serveAllProducts = async (req, res) => {
    console.log("came to the serveAllProducts controller");
    try {
        const response = await Product.find().select("-author -cloudinary_id -createdAt -updatedAt -__v -_id");
        console.log("fetched reposne is, ", response);
        res.status(200).json({status:"success", products: response});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while fetching the products" });
    }
}

export const serveParticularCategoryProducts = async (req, res) => {
    console.log("came to the serveParticularCategoryProducts controller");
    console.log("req.params is, ", req.params);
    
    const category = req.params.category;
    console.log("category is, ", category);
    
    try {
        const response = await Product.find({category}).select("-author -cloudinary_id -createdAt -updatedAt -__v -_id");
        console.log("fetched reposne is, ", response);
        res.status(200).json({message:" Products fetched successfully", products: response});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while fetching the products" });
    }
}

export const serveParticularSubCategoryProducts = async (req, res) => {
    console.log("came to the serveParticularSubCategoryProducts controller");
    console.log("req.params is, ", req.params);
    
    const subcategory = req.params.subcategory;
    console.log("subcategory is, ", subcategory);
    
    try {
        const response = await Product.find({subcategory}).select("-author -cloudinary_id -createdAt -updatedAt -__v -_id");
        console.log("fetched reposne is, ", response);
        res.status(200).json({message:" Products fetched successfully", products: response});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while fetching the products" });
    }
}

export const wrongRequest = (req, res) => {
    console.log("came to the wrongRequest controller");
    res.status(400).json({status: "error", message: "Invalid route. Please check the documentation for valid endpoints." });
}