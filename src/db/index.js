import { connect } from "mongoose";
import { config } from "dotenv";

config();

export const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(`Error on connecting database: ${error}`);
    }
}