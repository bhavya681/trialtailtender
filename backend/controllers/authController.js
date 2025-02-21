import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import BreederDetails from '../models/BreederDetails.js';

// export const register = async (req, res) => {
//   const { name, email, password,role,location,profile,bio,phone } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword,role:role,location,profile,bio,phone });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully', success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const register = async (req, res) => {
  const { name, email, password, role, location, profile, bio, phone, portfolio, breeds, statistics } = req.body;

  try {
    // Validate required fields for breeders
    if (role === 'breeder') {
      if (!portfolio || !breeds || breeds.length === 0) {
        return res.status(400).json({ 
          message: 'Portfolio and at least one breed are required for breeders', 
          success: false 
        });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      profile,
      bio,
      phone,
      portfolio: role === 'breeder' ? portfolio : undefined, // Save portfolio only for breeders
      breeds: role === 'breeder' ? breeds : undefined, // Save breeds only for breeders
      statistics: role === 'breeder' ? statistics : undefined, // Save statistics only for breeders
    });

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
  const { role, portfolio, breeds, statistics, ...updates } = req.body;

  try {
    // Validate and update location if provided
    if (updates.location?.coordinates) {
      updates.location = {
        type: 'Point',
        coordinates: [
          parseFloat(updates.location.coordinates[0]), 
          parseFloat(updates.location.coordinates[1])
        ],
      };
    }

    // If user is a breeder, validate and update breeder-specific fields
    if (role === 'breeder') {
      if (!portfolio || !breeds?.length ) {
        return res.status(400).json({ 
          message: 'Portfolio, at least one breed, and statistics are required for breeders.', 
          success: false 
        });
      }
      updates.portfolio = portfolio;
      updates.breeds = breeds;
      updates.statistics = statistics;
    }

    // Update the user profile
    const user = await User.findByIdAndUpdate(req.user.id, updates, { 
      new: true, 
      runValidators: true 
    }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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

export const getBreedersList = async (req, res) => {
  try {
    const breeders = await User.find({ role: 'breeder' });
    res.status(200).json({ success: true, breeders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBreederProfile = async (req, res) => {
  try {
    const { breederId } = req.params;
    const breeder = await User.findById(breederId).select('-password');
    if (!breeder) return res.status(404).json({ error: 'Breeder not found' });
    res.status(200).json({ success: true, breeder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


