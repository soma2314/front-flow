import mongoose, { Schema } from 'mongoose';
import {User} from './user.models.js'

const apiSchema = new mongoose.Schema({ 
    keyName:{
        type: String, 
        required: true
    },
    apiKey: {
        type: String, 
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: User
    }
}, { timestamps: true });   

export const Api = mongoose.model("Api", apiSchema);