import Sitter from '../models/Sitter.js';
import User from '../models/User.js';

// export const registerSitter = async (req, res) => {
//   try {
//     const sitter = new Sitter(req.body);
//     await sitter.save();
//     res.status(201).json({ message: 'Sitter registered successfully', sitter,success:true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


export const registerSitter = async (req, res) => {
  try {
    // Destructure fields from request body
    const {
      name,
      email,
      experience,
      hourlyRate,
      paymentLink,
      skills,
      aboutme,
      facebook,
      instagram,
      isVet,
      verificationDocs,
    } = req.body;

    // Validate required fields
    if (!name || !email || !experience || !hourlyRate || !paymentLink || !skills || !aboutme) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    // Ensure skills is an array
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ success: false, message: 'Skills must be an array with at least one skill.' });
    }

    // If the sitter is a vet, ensure verification documents are provided
    if (isVet && (!verificationDocs || !Array.isArray(verificationDocs) || verificationDocs.length === 0)) {
      return res.status(400).json({ success: false, message: 'Vet verification documents are required.' });
    }

    // Check if sitter already exists
    const existingSitter = await Sitter.findOne({ email });
    if (existingSitter) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Create new sitter object
    const sitter = new Sitter({
      name,
      email,
      experience,
      hourlyRate,
      paymentLink,
      skills,
      aboutme,
      facebook,
      instagram,
      isVet: isVet || false,
      verificationDocs: isVet ? verificationDocs : [],
    });

    // Save the sitter to the database
    await sitter.save();

    // Return success response
    res.status(201).json({ success: true, message: 'Sitter registered successfully', sitter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

// export const updateSitter = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const sitter = await Sitter.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
//     if (!sitter) return res.status(404).json({ error: 'Sitter not found' });

//     res.status(200).json({ message: 'Sitter details updated successfully', sitter ,success:true});
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



export const updateSitter = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ensure that skills is an array
    if (updates.skills && !Array.isArray(updates.skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array.',
      });
    }

    // Handle vet verification requirement
    if (updates.isVet === true && (!updates.verificationDocs || updates.verificationDocs.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Verification documents are required for vet role.',
      });
    }

    // Find and update the sitter
    const sitter = await Sitter.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!sitter) {
      return res.status(404).json({ success: false, message: 'Sitter not found.' });
    }

    res.status(200).json({ success: true, message: 'Sitter updated successfully.', sitter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
