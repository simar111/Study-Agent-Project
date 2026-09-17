import express from "express"
import dotenv from "dotenv"
import connectDB from "./utils/connectDB.js";
dotenv.config()
const app= express()
const PORT= process.env.PORT || 5000
app.get("/", (req, res)=>{
    res.json({ message: "Exam Notes AI Server is running" })
})
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
