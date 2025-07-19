import mongoose from "mongoose";
// import noteModel from "./taskmodel.js";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    verifyOtp:{
        type:String,
        default:""
    },
     verifyOtpExpiresAt:{
        type:Number,
        default:0
    },
     isAccountVerified:{
        type:Boolean,
        default:false
    },
    taskList:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"task"
        }
    ],
    resetOtp:{
        type:String,
        default:""
    },
    resetOtpExpiresAt:{
        type:Number,
        default:0
    }

}, { timestamps: true });

const userModel = mongoose.model('user',userSchema)
export default userModel;
