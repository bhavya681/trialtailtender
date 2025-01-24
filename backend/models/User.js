import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  bio:{
    type:String,
    required:[true,'Bio is required']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },  
  profile:{
    type:String,
    required:true
  },
  role: {
    type: String,
    enum: ['owner', 'sitter'],
    default: 'owner',
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
