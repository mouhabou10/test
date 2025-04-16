import mongoose from 'mongoose';
import { DB_URI,NODE_ENV } from '../config/env.js';
if (!DB_URI)
{throw new Error('please define the mongodb_uri enviroment variable inside .env.local')
}
const connectToDatabase =async()=>{
    try {
        console.log('the data is connected')
            await mongoose.connect(DB_URI);
    }catch(error){
        console.error('error conection to data base ',error);
        process.exit(1);
        
    }
}
export default connectToDatabase