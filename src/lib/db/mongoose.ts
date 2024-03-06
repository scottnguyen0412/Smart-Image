import mongoose, {Mongoose} from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

interface MongooseConnection {
    connect: Mongoose | null;
    promise: Promise<Mongoose> | null;
}
// Tạo biến cached để lưu trữ thông tin kết nối Mongoose. 
// Biến này được lưu trữ trong biến toàn cục global để tránh tạo kết nối mới mỗi khi hàm connectToDB được gọi
let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
    cached = (global as any).mongoose = {connect: null, promise: null}
}

export const connectToDB = async () => {
    // Hàm connectToDB kiểm tra xem đã tồn tại kết nối trong biến cached.connect hay chưa. 
    // Nếu đã tồn tại, hàm sẽ trả về kết nối đó.
    if(cached.connect){
        return cached.connect;
    }

    if(!MONGODB_URL){
        throw new Error('Missing MONGODB_URL')
    }

    // Nếu biến cached.promise chưa được định nghĩa, 
    // hàm sẽ tạo một promise và sử dụng mongoose.connect để kết nối với cơ sở dữ liệu M
    cached.promise = cached.promise || mongoose.connect(
        MONGODB_URL, {dbName: 'AI-HANDLE-IMAGE', bufferCommands: false}
    )

    cached.connect = await cached.promise

    return cached.connect;
}