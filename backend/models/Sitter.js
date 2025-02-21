// // import mongoose from 'mongoose';
// // import Review from './Review.js';

// // const sitterSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: [true, 'Sitter name is required'],
// //   },
// //   email: {
// //     type: String,
// //     required: [true, 'Email is required'],
// //     unique: true,
// //   },
// //   experience: {
// //     type: String,
// //     required: [true, 'Experience details are required'],
// //   },
// //   hourlyRate: {
// //     type: Number,
// //     required: [true, 'Hourly rate is required'],
// //   },
// //   paymentLink: {
// //     type: String,
// //     required: [true, 'Payment link is required'],
// //   },
// //   reviews: [Review],
// // }, { timestamps: true });

// // export default mongoose.model('Sitter', sitterSchema);

// import mongoose from 'mongoose';
// import { reviewSchema } from './Review.js';

// const sitterSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Sitter name is required'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//     },
//     experience: {
//       type: String,
//       required: [true, 'Experience details are required'],
//     },
//     hourlyRate: {
//       type: Number,
//       required: [true, 'Hourly rate is required'],
//     },
//     paymentLink: {
//       type: String,
//       required: [true, 'Payment link is required'],
//     },
//     skills: {
//       type: [String], 
//       required: [true, 'Skills are required'],
//     },
//     aboutme: {
//       type: String,
//       required: [true, 'About Me is required for sitter'],
//     },
//     facebook: {
//       type: String,
//       required: false,
//     },
//     instagram: {
//       type: String,
//       required: false, 
//     },
//     reviews: [reviewSchema], 

//     specialRoles: {
//       type: [String],
//       enum: ['vet', 'breeder'],
//       default: [], // Allows multiple roles (vet, breeder, or both)
//     },

//     verifiedRoles: {
//       vet: {
//         type: Boolean,
//         default: false,
//       },
//       breeder: {
//         type: Boolean,
//         default: false,
//       },
//     },

//     verificationDocs: {
//       vet: {
//         type: [String], // Store vet license documents
//         required: function() {
//           return this.specialRoles.includes('vet');
//         },
//       },
//       breeder: {
//         type: [String], // Store breeding certification documents
//         required: function() {
//           return this.specialRoles.includes('breeder');
//         },
//       },
//     },
//   },
//   { timestamps: true }
// );

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
    skills: {
      type: [String],
      required: [true, 'Skills are required'],
    },
    aboutme: {
      type: String,
      required: [true, 'About Me is required for sitter'],
    },
    facebook: {
      type: String,
      required: false,
    },
    instagram: {
      type: String,
      required: false,
    },
    reviews: [reviewSchema],

    // Optional vet role
    isVet: {
      type: Boolean,
      default: false,
    },

    // Vet verification documents (required only if isVet is true)
    verificationDocs: {
      type: [String],
      required: function () {
        return this.isVet;
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Sitter', sitterSchema);
