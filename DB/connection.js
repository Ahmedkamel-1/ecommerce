import mongoose from "mongoose"

export const connectDB = async ()=> {
    await mongoose.connect(process.env.CONNECT_URL)
    .then(()=> console.log("DB Connected"))
    .catch(()=> console.log("Connection Failed!"))
}