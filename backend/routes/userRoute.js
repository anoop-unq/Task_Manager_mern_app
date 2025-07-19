import express from 'express'
import { login, logout, register, resetOtp, resetPassword, sendOtp, userAuthenticate, verifyEmail, verifyOtp } from '../controllers/userController.js'
import {  userAuthMiddleware } from '../middileware/userAuth.js'
const route = express.Router()

route.post("/register",register)
route.post("/login",login)
route.post("/logout",logout)
route.post("/verify-otp",userAuthMiddleware,sendOtp)
route.post("/verify-email",userAuthMiddleware,verifyEmail)
route.get("/user-auth",userAuthenticate)
route.post("/user-reset-otp",resetOtp)
route.post("/user-verify-otp", verifyOtp);
route.post("/user-reset-password",resetPassword)



export default route;