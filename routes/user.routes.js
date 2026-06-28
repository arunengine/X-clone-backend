import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { getProfile , followUnFollowUser ,getSuggestedUsers , updateUser, searchUsers } from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username" , protectRoute , getProfile )
router.post("/follow/:id" , protectRoute , followUnFollowUser )
router.get("/suggested" , protectRoute , getSuggestedUsers )
router.post("/update" , protectRoute , updateUser )
router.get("/search" , protectRoute , searchUsers )

export default router ;