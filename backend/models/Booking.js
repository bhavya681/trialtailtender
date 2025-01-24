// import mongoose from 'mongoose';

// const bookingSchema = new mongoose.Schema({
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   sitter: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Sitter',
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled'],
//     default: 'pending',
//   },
//   startDate: {
//     type: Date,
//     required: true,
//   },
//   endDate: {
//     type: Date,
//     required: true,
//   },
//   notes: {
//     type: String,
//     default: '',
//   },
//   approvedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   serviceType: {
//     type: String,
//     enum: ['Grooming', 'Boarding', 'Daycare', 'Veterinary Check-Up'],
//     required: true,
//   },
// });

// const Booking = mongoose.model('Booking', bookingSchema);
// export default Booking;


import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sitter',
    required: true,
  },
  pets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  serviceType: {
    type: String,
    enum: ['Grooming', 'Boarding', 'Daycare', 'Veterinary Check-Up'],
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
