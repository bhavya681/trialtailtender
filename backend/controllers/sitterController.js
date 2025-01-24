import Sitter from '../models/Sitter.js';
import User from '../models/User.js';

export const registerSitter = async (req, res) => {
  try {
    const sitter = new Sitter(req.body);
    await sitter.save();
    res.status(201).json({ message: 'Sitter registered successfully', sitter,success:true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSitters = async (req, res) => {
  try {
    const sitters = await Sitter.find();
    res.status(200).json({success:true,sitters});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSitter = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const sitter = await Sitter.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!sitter) return res.status(404).json({ error: 'Sitter not found' });

    res.status(200).json({ message: 'Sitter details updated successfully', sitter ,success:true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSitter = async (req, res) => {
  try {
    const { id } = req.params;

    const sitter = await Sitter.findByIdAndDelete(id);
    if (!sitter) return res.status(404).json({ error: 'Sitter not found' });

    res.status(200).json({ message: 'Sitter deleted successfully',success:true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getAllSitters = async (req, res) => {
  try {
    // Fetch all sitters
    const sitters = await Sitter.find();
    // Fetch user profiles for each sitter
    const sittersWithProfiles = await Promise.all(sitters.map(async (sitter) => {
      const user = await User.findOne({ email: sitter.email });
      return {
        ...sitter.toObject(),
        profile: user ? user.profile : null,
        location: user ? user.location : null,
        UserSid:user ? user._id : null,
        sitterId:sitter ? sitter._id:null
      };
    }));

    res.status(200).json({ success: true, sitters: sittersWithProfiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getSittersById = async (req, res) => {
  try {
    const { id } = req.params;
    const sitter = await Sitter.findById(id);

    if (!sitter) {
      return res.status(404).json({ success: false, message: 'Sitter not found' });
    }

    res.status(200).json({ success: true, sitter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
