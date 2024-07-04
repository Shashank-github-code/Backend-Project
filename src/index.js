// require('dotenv').config({path: './env'})
import dotenv from "dotenv" // importing all env is essential as soon as possible 
import connectDB from "./db/indexdb.js";
import {app} from './app.js';

// importing all the env
dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`server is running at port:${process.env.PORT}`);
    })

})
.catch((error)=>{
    console.log("MongoDB connection failed!!!", error)
})







// Approach 1 writting the connection code in index.js using the iife
/*
import express from'express';
const app=express()

;( async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on('error',()=>{
            console.log("ERRR: ",error);
            throw error
        })
        
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Error",error)
        throw error
    }
})()
*/