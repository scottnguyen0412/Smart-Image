import { Document } from "mongodb";
import { model, models, Schema } from "mongoose";

// extends: kế thưad lớp cơ sở (base class)
// và có thể định nghĩa thêm các thuộc tính và phương thức riêng của nó. 
export interface Image extends Document {
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: URL;
    width?: number;
    height?: number;
    config?: object;
    transformationURL?: URL;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author?: {_id : string, firstName: string, lastname: string};
    createdAt?: Date;
    updatedAt?: Date;
  }

const ImageSchema = new Schema({
    title: {type: String, required: true},
    transformationType: {type: String, required: true},
    publicId: {type: String, required: true},
    secureURL: {type: String, required: true},
    width: {type: Number},
    height: {type: Number},
    config: {type: Object},
    transformationURL: {type: String},
    // tỷ lệ khung hình
    aspectRatio: {type: String},
    color: {type: String},
    prompt: {type: String},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},

})

const Image = models?.Image || model('Image', ImageSchema); 

export default Image;