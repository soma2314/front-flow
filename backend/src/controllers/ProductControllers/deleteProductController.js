import express from 'express'; 
import { Product } from '../../models/product.models.js';
import { deleteFromCloudinary } from '../../utils/cloudinary.js';

export const deleteProductController = async(req, res)=>{
    console.log('deleteProductController', req.params.id); 
    const { id } = req.params;
    try {
        
        const response = await Product.findByIdAndDelete(id);
        console.log('response', response); 
        console.log("Now deleting from the cloudinary");
        // delete from cloudinary 
        await deleteFromCloudinary(response.cloudinary_id);
        console.log("Deleted from cloudinary successfully");
        res.status(200).json({
            message:"Product deleted successfully"
        });
    
    } catch (error) {
        res.status(500).json({
            message:"Internal server error"
        });
    }
}

// response {
//     _id: new ObjectId('676db5681a69105d882bfd00'),
//     title: 'sdfsa',
//     description: 'sdfs ',
//     price: 13,
//     image: 'http://res.cloudinary.com/dxzyrmpsv/image/upload/v1735243112/n4fasly4ialv31du0dow.png', 
//     cloudinary_id:"yhtiwlx9vrpiydvbqgds"
//     category: 'sdfsda',
//     quantity: 123,
//     seller: 'sadf ',
//     author: new ObjectId('676d3814e09949b38f63b7b2'),
//     createdAt: 2024-12-26T19:58:32.985Z,
//     updatedAt: 2024-12-26T19:58:32.985Z,
//     __v: 0
//   }
  