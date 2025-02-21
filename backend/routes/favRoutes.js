import express from "express";
import { addFavourite, getFavourites, removeFavourite, toggleFavourite } from "../controllers/favController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-fav/:sitterId/:userId", addFavourite);

router.get("/get-favs/:userId", getFavourites);

router.delete("/fav-del/:sitterId/:userId", removeFavourite);

router.post("/toggle-fav/:sitterId/:userId", toggleFavourite);

export default router;
