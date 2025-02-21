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
  phone:{
    type:Number,required:true
  },
  profile:{
    type:String,
    required:true
  },
  role: {
    type: String,
    enum: ['owner', 'sitter','breeder'],
    default: 'owner',
  },portfolio: {
    type: String,
  }, breeds: [{
    animalType: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other']
    },
    breed: {
      type: String,
      required: true
    }
  }],
  statistics: {
    successfulBreeds: {
      type: Number,
      default: 0
    },
    yearsExperience: {
      type: Number,
      default: 0
    },
    customerSatisfaction: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
