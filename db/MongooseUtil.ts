import mongoose, { ConnectionOptions } from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const { DB_HOST, DB_NAME, DB_PORT } = process.env;

const connectToDatabase = async (): Promise<void> => {
  try {
    const options: ConnectionOptions = { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true };

    await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, options);
  } catch(err) {
    console.log(err);
  }

};

export { connectToDatabase };