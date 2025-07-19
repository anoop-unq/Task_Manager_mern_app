// Src/Models/noteModel.js
import mongoose from 'mongoose';

const noteValidation = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: (v) => v.trim().length > 0,
        message: 'Title cannot be empty',
      },
    },
    content: {
      type: String,
      required: true,
      validate: {
        validator: (v) => v.trim().length > 0,
        message: 'Content cannot be empty',
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'In-progress', 'Completed'],
      default: 'Pending',
    },
    user:{
      type:mongoose.Schema.ObjectId,
      ref:"user",
      required:true
    }
  },
  {
    timestamps: true,
  }
);

const noteModel = mongoose.model('task', noteValidation);

export default noteModel;
