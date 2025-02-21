import mongoose from 'mongoose';

const breederDetailsSchema = new mongoose.Schema({
  breeder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  breeds: [{
    animalType: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other']
    },
    breed: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Available', 'Coming Soon', 'Sold Out', 'Limited'],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    images: [{
      type: String
    }],
    availability: {
      quantity: {
        type: Number,
        default: 0
      },
      nextAvailableDate: {
        type: Date
      }
    },
    healthCertificates: [{
      type: String
    }],
    pedigree: {
      type: String
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const BreederDetails = mongoose.model('BreederDetails', breederDetailsSchema);
export default BreederDetails;
