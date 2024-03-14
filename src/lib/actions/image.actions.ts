'use server'

import { revalidatePath } from "next/cache";
import User from "../db/models/user.model";
import Image from "../db/models/image.model";
import { connectToDB } from "../db/mongoose"
import { handleError } from "../utils"
import { redirect } from "next/navigation";

import {v2 as cloudinary} from 'cloudinary';

// reference to model User
const populateUser = (query: any) => query.populate({ 
    path: 'author', 
    model: 'User', 
    select: '_id firstName lastName clerkId'
 });

// add image
export async function addImage({image, userId, path}: AddImageParams){
    try {
        await connectToDB();

        const author = await User.findById(userId);

        if(!author){
            throw new Error("User not found");
        }

        const newImage = await Image.create({
            ...image,
            author: author._id,
        })

        revalidatePath(path);

        return JSON.parse(JSON.stringify(newImage));
    } catch (error) {
        handleError(error)
    }
} 
// update image
export async function updateImage({image, userId, path}: UpdateImageParams){
    try {
        await connectToDB();
        
        const imageToUpdate = await Image.findById(image._id);

        if(!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
            throw new Error("Image Not Found!");
            
        }

        const updatedImage = await Image.findByIdAndUpdate(
            imageToUpdate._id,
            image,
            {new: true}
        )
        revalidatePath(path);

        return JSON.parse(JSON.stringify(updatedImage));
    } catch (error) {
        handleError(error)
    }
} 
// delete image
export async function deleteImage(imageId: string){
    try {
        await connectToDB();
        
        await Image.findByIdAndDelete(imageId);
        
    } catch (error) {
        handleError(error)
    } finally {
        redirect('/')
    }
} 
// get image
export async function getImageById(imageId: string){
    try {
        await connectToDB();

        const image = await populateUser(Image.findById(imageId));
        if(!image) {
            throw new Error("Image Not Found!");
            
        }

        return JSON.parse(JSON.stringify(image));
    } catch (error) {
        handleError(error)
    }
} 

// Get all image
export async function getAllImage({limit = 9, page = 1, searchQuery = ''}: {
    limit?: number;
    page: number;
    searchQuery?: string;
}){
    try {
        await connectToDB();

        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
            secure: true
        })

        let expression = 'folder=smart-image-app'

        if(searchQuery){
            expression += ` AND ${searchQuery}`
            // console.log(expression);
        }
        console.log(searchQuery);
        

        const {resources} = await cloudinary.search.expression(expression).execute();
        console.log(resources);
        
        const resourceIds = resources.map((resource: any) => {
            return(resource.public_id)
        })
            
            let query = {};
            if(searchQuery) {
                query = {
                    publicId: {
                        $in: resourceIds
                    }
                }
                console.log(query);
            }
            

        const skipAmount = (Number(page) - 1) * limit;
        
        const images = await populateUser(Image.find(query))
            .sort({updatedAt: -1})
            .skip(skipAmount)
            .limit(limit);

        const totalImages = await Image.find(query).countDocuments();
        
        const savedImage = await Image.find().countDocuments();

        return {
            data: JSON.parse(JSON.stringify(images)),
            total: Math.ceil(totalImages / limit),
            savedImage, 
        }
    } catch (error) {
        handleError(error)
    }
} 