import express from "express";
import { getCommunityMessages, sendCommunityMessage } from "../controllers/communityChatController.js";

const router = express.Router();

router.get("/:communityId", getCommunityMessages); // Fetch community messages
router.post("/", sendCommunityMessage); // Send message in community

export default router;
