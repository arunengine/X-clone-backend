import mongoose from "mongoose";
import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { createPost ,
      deletePost ,
      createComment,
      likeUnLikePost ,
      getAllPosts ,
      getLikedPosts ,
      getFollowingPosts ,
      getUserPosts } from "../controller/post.controller.js";

const router = express.Router();

router.get("/all" , protectRoute , getAllPosts)
router.get("/following" , protectRoute , getFollowingPosts)
router.get("/likes/:id" , protectRoute , getLikedPosts)
router.get("/user/:username" , protectRoute , getUserPosts)
router.post("/create" , protectRoute , createPost)
router.post("/like/:id" , protectRoute , likeUnLikePost)
router.post("/comment/:id" , protectRoute , createComment)
router.delete("/:id" , protectRoute , deletePost)

export default router ;