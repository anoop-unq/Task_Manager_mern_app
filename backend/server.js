import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import route from './routes/userRoute.js'
import { authRouter } from './routes/authUserRoute.js'
import { taskRouter } from './routes/taskRoute.js'
dotenv.config()


const app = express()
const PORT = process.env.PORT || 3800
const allowedOrigins = [
    
    'https://task-manager-mern-app-navy.vercel.app']
app.use(express.json())
app.use(cookieParser())

// app.use(cors({
//     origin:allowedOrigins,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials:true,
// }))

app.use(cors({
    origin: (origin, callback) => {
        console.log('Incoming request from origin:', origin);  // Logs the origin of incoming requests
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // Allow this origin
        } else {
            callback(new Error('Not allowed by CORS'));  // Deny this origin
        }
    },
    credentials: true,
}));


app.use("/api",route)
app.use("/api/user",authRouter)
app.use("/api/notes",taskRouter)
connectDB().then(()=>{
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})
})
