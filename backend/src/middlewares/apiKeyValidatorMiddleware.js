import express from "express";
import { Api } from "../models/api.models.js"; 

export const apiKeyValidator = async (req, res, next) => {
    console.log("came to apiKeyValidator");
    
    const apiKey = req.params.apiKey;
    try {
        const api = await Api.findOne({ apiKey });
        if (!api) {
            return res.status(401).json({status: "error", message: "Invalid API key. Please provide a valid API key." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};