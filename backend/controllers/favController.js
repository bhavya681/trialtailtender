import Favourite from "../models/Favourites.js";

export const addFavourite = async (req, res) => {
    const { sitterId } = req.params;
  const {userId} = req.params;

  try {
    const existingFavourite = await Favourite.findOne({sitterId });
    if (existingFavourite) {
      return res.status(400).json({ message: 'This sitter is already in your favourites.' });
    }

    const newFavourite = new Favourite({ userId, sitterId });
    await newFavourite.save();
    res.status(201).json({ message: 'Sitter added to favourites.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleFavourite = async (req, res) => {
  const { sitterId, userId } = req.params;

  try {
    const existingFavourite = await Favourite.findOne({ userId, sitterId });

    if (existingFavourite) {
      // If sitter is already a favourite, remove it
      await Favourite.deleteOne({ _id: existingFavourite._id });
      return res.status(200).json({ success: true, message: 'Sitter removed from favourites.' });
    } 

    // If sitter is not a favourite, add it
    const newFavourite = new Favourite({ userId, sitterId });
    await newFavourite.save();
    res.status(201).json({ success: true, message: 'Sitter added to favourites.' });

  } catch (error) {
    console.error("Error toggling favourite:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getFavourites = async (req, res) => {
    const {userId} = req.params;

    try {
      const favourites = await Favourite.findById({ userId }).populate('sitterId');
      res.status(200).json({success:true, favourites});
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};

export const removeFavourite = async (req, res) => {
    const { sitterId } = req.params;
  const {userId} = req.params;

  try {
    await Favourite.findOneAndDelete({ userId, sitterId });
    res.status(200).json({ message: 'Sitter removed from favourites.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

