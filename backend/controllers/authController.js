import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password,role,location,profile,bio } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword,role:role,location,profile,bio });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Simulate password reset (e.g., email a reset token)
    res.status(200).json({ message: 'Password reset instructions sent to your email.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({user,success:true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const {id}=req.params;
    const profile = await User.findById(id).select('-password'); // Exclude password from response
    if (!profile) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({profile,success:true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({success:true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.location) {
      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(updates.location.coordinates[0]), parseFloat(updates.location.coordinates[1])],
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ success:true,message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const OwnersList = async (req, res) => {
  try {
   
    const user = await User.find({});
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ success:true,message: 'All Users',user});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
