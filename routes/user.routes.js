import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { getProfile , followUnFollowUser ,getSuggestedUsers , updateUser, searchUsers, removeFollower } from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username" , protectRoute , getProfile )
router.post("/follow/:id" , protectRoute , followUnFollowUser )
router.get("/suggested" , protectRoute , getSuggestedUsers )
router.post("/update" , protectRoute , updateUser )
router.get("/search" , protectRoute , searchUsers )
router.delete("/remove-follower/:id" , protectRoute , removeFollower )

export default router ;