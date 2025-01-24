import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference the 'User' model instead of 'Customer'
      required: true,
    },
    paymentMethod: {
      type: String, // This could be the payment method ID (e.g., Stripe payment method ID)
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    chargeStatus: {
      type: String,
      enum: ['pending', 'successful', 'failed'],
      default: 'pending',
    },
    chargeId: {
      type: String, // The charge ID returned by Stripe
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
