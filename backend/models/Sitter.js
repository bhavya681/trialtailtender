// import mongoose from 'mongoose';
// import Review from './Review.js';

// const sitterSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Sitter name is required'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//   },
//   experience: {
//     type: String,
//     required: [true, 'Experience details are required'],
//   },
//   hourlyRate: {
//     type: Number,
//     required: [true, 'Hourly rate is required'],
//   },
//   paymentLink: {
//     type: String,
//     required: [true, 'Payment link is required'],
//   },
//   reviews: [Review],
// }, { timestamps: true });

// export default mongoose.model('Sitter', sitterSchema);

import mongoose from 'mongoose';
import { reviewSchema } from './Review.js';

const sitterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sitter name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience details are required'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
    },
    paymentLink: {
      type: String,
      required: [true, 'Payment link is required'],
    },
    reviews: [reviewSchema], // Use the schema instead of the model
  },
  { timestamps: true }
);

export default mongoose.model('Sitter', sitterSchema);
