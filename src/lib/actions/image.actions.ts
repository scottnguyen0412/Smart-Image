'use server'

import { revalidatePath } from "next/cache";
import User from "../db/models/user.model";
import Image from "../db/models/image.model";
import { connectToDB } from "../db/mongoose"
import { handleError } from "../utils"
import { redirect } from "next/navigation";

// reference to model User
const populateUser = (query: any)  => query.populate({ 
    path: 'author', 
    model: 'User', 
    select: '_id firstName lastName'
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

        return JSON.parse(JSON.stringify(image));
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