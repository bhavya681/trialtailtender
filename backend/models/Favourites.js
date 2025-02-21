import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sitter', required: true },
});

const Favourite = mongoose.model("Favourite", favouriteSchema);

export default Favourite;

