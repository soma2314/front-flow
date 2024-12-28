import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true, 
    lowercase: true,
    trim: true,
    index: true, // cheaper to the queries search
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },  
  password: {
    type: String,
    required: [true, "password is required"], // message to frontend
  },  
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema); // create the document by this name
