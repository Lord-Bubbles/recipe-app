import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to the Mongo Database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster.5lxangg.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
