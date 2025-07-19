import userModel from "../models/user.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from "../config/nodemailer.js";
import { generateLoginEmail, generateOtpVerificationEmail, generateResetPasswordOtpEmail, generateWelcomeEmail } from "../config/emailTemplate.js";

import dotenv from 'dotenv'

dotenv.config()

const SALT_NUM = process.env.SALT_ROUND

export const register = async(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"All Fields are required !"})
    }
    try{
    const existingUser = await userModel.findOne({email})
    if(existingUser){
        return res.status(400).json({message:"User Already Exist!"})
    }
    const hashedpassword = await bcrypt.hash(password,10)

    const user = new userModel({
        name,
        email,
        password:hashedpassword
    })
    console.log(process.env.SECRET_KEY)
    await user.save()

    const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"7d"});
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV==='production' ?
        'none':'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    // Before generating response we will send email Welcome !
    const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:`Hii ! ${name} ! Welcome to Task Management`,
        // text:`Welcome to Task Management Your account has been created with email id : ${email}`
        html:generateWelcomeEmail(name,email)

    }
    
     try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
      // Optionally: You can continue without failing the registration
    }

    return res.status(201).json({success:true,message:"User Registered Successfully !"})
}
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    console.log(process.env.SECRET_KEY)
    console.log(email,password)
    if(!email || !password){
        return res.json({message:"All Fields are required !"})
    }
    try {
    const user = await userModel.findOne({email})
    if(!user){
        return res.json({message:"Invalid Email Details"})
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        return res.json({message:"Invalid Password Details"})
    }
    
    const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"7d"});
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV==='production' ?
        'None':'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
      const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to: user.email,
        subject: `New Login Detected - ${user.name}`,
        html: generateLoginEmail(user.name, user.email, req.ip),
    }
    
     try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
      // Optionally: You can continue without failing the registration
    }

    return res.json({success:true,message:"User Logged In Successfully !"})
}
    catch(error){
        return res.json({success:false,message:error.message})
    }
}

export const logout = (req,res)=>{
    try {
        res.clearCookie('token',{
              httpOnly:true,
              secure:process.env.NODE_ENV === 'production',
              sameSite:process.env.NODE_ENV==='production' ?
              'none':'strict',
        })
        return res.status(200).json({success:true,message:"Logged Out"})
    }  catch(error){
        return res.status(501).json({success:false,message:error.message})
    }
}
// Send Verification OTP !
export const sendOtp = async(req,res)=>{
    const userId = req.userId
    try {
        
        // console.log(req.body)
        console.log(userId,"113")
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success:false,message:"Account Already verified"})
        }
        const otp = String(Math.floor(100000+Math.random()*900000))
        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save();
        console.log("ll",user)

    //     const mailOptions = {
    //     from:process.env.SENDER_EMAIL,
    //     to:user.email,
    //     subject:`Hii ! ${user.name} ! OTP Verification !`,
    //     text:`Welcome to Task Management Your account has been created with email id : ${user.email} & OTP : ${otp}`
    // }
     const mailOptions = {
        from: process.env.SENDER_EMAIL,
  to: user.email,
  subject: `Verify Your Task Management Account`,
  html: generateOtpVerificationEmail(user.name, otp),
    }
    
     try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
      // Optionally: You can continue without failing the registration
    }
        // await transporter.sendMail(mailOptions)
    res.json({success:true,message:"OTP sent successfull !"})
    } catch (error) {
        res.json({success:false,message:"Error"})
    }
}
// Verify Email !
export const verifyEmail = async (req, res) => {
    const userId = req.userId
    const  {otp}  = req.body;
    console.log(req.body,"ll")

      console.log("📥 req.userId:", userId);
  console.log("📥 req.body.otp:", otp);
  try {
      if (!otp) {
          return res.json({ success: false, message: "OTP is required" });
        }
        
        const user = await userModel.findById(userId);
        console.log(user.verifyOtp,"55")
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        if (user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpiresAt < Date.now()) {
            return res.json({ success: false, message: "OTP has expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiresAt = 0;
        await user.save();

        res.json({ success: true, message: "Email verified successfully!" });

    } catch (error) {
        console.error("Verify Email Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// Is login or not like User AUthentication

export const userAuthenticate = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token,"555")

    if (!token) {
      return res.json({ success: false, message: "User not logged in (no token)" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    res.json({
      success: true,
      message: "User is logged in",
      userId: decoded.id,
    });
  } catch (error) {
    res.json({ success: false, message: "Invalid or expired token" });
  }
};

// send reset OTP !
export const resetOtp = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:false,message:"Email is required"})
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User no found !"})
        }

        const otp = String(Math.floor(100000+Math.random()*900000))
        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() +  15 * 60 * 1000
        
        await user.save();
        console.log("ll",user)
        const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: `🔐 Reset Password OTP - Task Management`,
    
        html:generateResetPasswordOtpEmail(user.name, user.email, otp),
        };
        await transporter.sendMail(mailOptions)
        res.json({success:true,message:"OTP sent successfull !"})
    } catch (error) {
           console.error("Reset OTP Error:", error); // ✅ Add log for debugging
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({ success: false, message: "All fields are required!" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// verify Otp to reset password !
export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body
    console.log(email,newPassword,otp)
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"All fileds are required !"})
    }
    try {
        const user = await userModel.findOne({email})
        // console.log(user,"55")
        console.log(user,"55")
        // console.log(email,otp,newPassword)
        if(!user){
            return res.json({success:false,message:"User not found !"})
        }
        if(!user.resetOtp  || user.resetOtp !== otp){
            return res.json({success:false,message:"Invalid Otp"})
        }
        if(user.resetOtpExpiresAt< Date.now()){
            return res.json({success:false,message:"Otp expires"})
        }
        const hashedpassword = await bcrypt.hash(newPassword,10)
        user.password = hashedpassword;
        user.resetOtp =""
        user.resetOtpExpiresAt=0;
        await user.save();
        return res.json({ success: true, message: "Password reset successful!" }); 
    } catch (error) {
         res.status(500).json({ success: false, message: "Internal Server" });
    }
}
// Get user data !
export const getUserData = async(req,res)=>{
    const userId = req.userId
    const user = await userModel.findById(userId);
    if(!user){
        return res.status(400).json({success:false,message:"User not found !"})
    }
    res.json({
        success:true,
        userData:{
            name:user.name,
            isAccountVerified:user.isAccountVerified
        }

    })
}