import Pet from '../models/Pet.js';

export const addPet = async (req, res) => {
  try {
    const pet = new Pet({ ...req.body, owner: req.user.id });
    await pet.save();
    res.status(201).json({success:true, message: 'Pet added successfully', pet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id });
    res.status(200).json({success:true,pets});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id).populate('owner', 'name email');
    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const pet = await Pet.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    res.status(200).json({ message: 'Pet updated successfully', pet,success:true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    res.status(200).json({ message: 'Pet deleted successfully',success:true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
