import Stripe from 'stripe';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

dotenv.config();

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a new Stripe customer and update the user
export const createCustomer = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.stripeCustomerId) {
      const customer = await stripeInstance.customers.create({ name, email });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    res.status(200).json({ message: 'Customer created successfully', stripeCustomerId: user.stripeCustomerId });
  } catch (error) {
    console.error('Error creating Stripe customer:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addNewCard = async (req, res) => {
  try {
    const { customer_id,card_Name,card_ExpYear,cardExpMonth,card_Number,card_CVC} = req.body;

   const card_token=await stripeInstance.tokens.create({
    card:{
      name:card_Name,
      number:card_Number,
      exp_month:cardExpMonth,
      exp_year:card_ExpYear,
      cvc:card_CVC,
    }
   })

   const card=await stripeInstance.customers.createSource(customer_id,{source:`${card_token.id}`});
   res.status(200).json({message:"card added successfully",card});
  } catch (error) {
    console.error('Error adding card:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a charge for the customer
export const createCharges = async (req, res) => {
  try {
    const { customerId, amount, paymentMethodId } = req.body;

    if (!customerId || !amount || !paymentMethodId) {
      return res.status(400).json({ error: 'Customer ID, amount, and payment method ID are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const charge = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      customer: customerId,
      confirm: true,
    });

    const payment = new Payment({
      customer: customerId,
      paymentMethod: paymentMethodId,
      amount: amount,
      currency: 'usd',
      chargeStatus: charge.status,
      chargeId: charge.id,
    });

    await payment.save();

    res.status(200).json({ message: 'Charge created successfully', charge });
  } catch (error) {
    console.error('Error creating charge:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
