import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
  },
  type: {
    type: String,
    required: [true, 'Pet type is required'],
  },
  breed: {
    type: String,
    required: [true, 'Pet breed is required'],
  },
  pic: {
    type: String,
    required: [true, 'Pet Pic is required'],
  },
  age: {
    type: Number,
    required: [true, 'Pet age is required'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Pet', petSchema);
