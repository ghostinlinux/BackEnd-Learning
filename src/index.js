import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './db/db.js';
import app  from './app.js';

connectDB()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Server is running", process.env.PORT);
    })
})
.catch((err)=>
    console.log("Mongo db connection failed", err))