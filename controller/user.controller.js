import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";

export const getProfile = async( req , res )=>{
    try {
        const {username} = req.params;
        const user = await User.findOne({username : username})
            .populate("followers", "username fullname profileImg bio")
            .populate("following", "username fullname profileImg bio")
            .select("-password");

        if(!user){
            return res.status(400).json({ error : 'not found'})
        }

        res.status(200).json(user);
        
    } catch (error) {
        console.log(`error in get user controller ${error}`);
        res.status(500).json({error : "internal server errror"})
    }
}

export const followUnFollowUser = async( req , res )=>{
    try {
        const {id} = req.params
        const UserToModify = await User.findById({_id : id})
        const currentUser = await User.findById({_id : req.user._id})

        if( id === req.user._id.toString()){
            return res.status(400).json({ err :"cant unfollow / follow"})
        }

        if( !UserToModify || !currentUser ){
            return res.status(400).json({ err : "user not found"})
        }

        const isFollowing = currentUser.following.some(followId => followId.toString() === id)

        if(isFollowing){
             await User.findByIdAndUpdate({_id : id} , {$pull : {followers : req.user._id}})
             await User.findByIdAndUpdate({_id : req.user._id} , {$pull : {following : id}})
             res.status(200).json({ message : "unfollowed"})
        }else{
             await User.findByIdAndUpdate({_id : id} , {$push :{followers : req.user._id}})
             await User.findByIdAndUpdate({_id :req.user._id } , {$push :{following : id}})
             const newNotification = new Notification({
                type : "follow" ,
                from : req.user._id ,
                to : UserToModify._id
             })
             await newNotification.save();
             res.status(200).json({ message : "followed"})
        }

    } catch (error) {
        console.log(`error in followUnFollowUser controller ${error}`);
        res.status(500).json({error : "internal server errror"})
    }
}

export const getSuggestedUsers = async( req , res )=>{
    try {
        const userId = await req.user._id ;
        const userFollowedByMe = await User.findById({_id : userId}).select("-password")

        const users = await User.aggregate([
            {
                $match :{
                    _id : {$ne : userId}
                }
            } ,
            {
                $sample :{ size : 10}
            }
        ])

        const filteredUser = users.filter((user)=> !userFollowedByMe.following.some(followId => followId.toString() === user._id.toString()))
        const suggestedUsers =filteredUser.slice(0,4) ;
        suggestedUsers.forEach((user)=> user.password = null)
        res.status(200).json(suggestedUsers)
        
    } catch (error) {
        console.log(`error in get suggested controller ${error}`);
        res.status(500).json({error : "internal server errror"})
    }
}

export const updateUser = async( req , res )=>{
    try {
        const userId = req.user._id;

        const { username , fullname , email , currentPassword , newPassword ,bio , link} =req.body ;
        let { profileImg , coverImg} = req.body 

        let user = await User.findById({_id : userId})

        if(!user){
            return res.status(400).json({err : "user not found"})
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({ err: "enter both"})
        }

        if ( currentPassword  && newPassword){
            const isMatch = await bcrypt.compare( currentPassword , user.password)

            if(!isMatch){
                return res.status(400).json({err :"current password is in correct" })
            }

            if(newPassword.length < 6){
                return res.status(400).json({err :" password is short" })
            } 

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword , salt) ;
        }

        // if(profileImg){

        //     if(user.profileImg){
        //         await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
        //     }
        //     const uploadedResponse = await cloudinary.uploader.upload(profileImg)

        //     profileImg = uploadedResponse.secure_url ;
        // }

        // if(coverImg){

        //     if(user.coverImg){
        //         await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
        //     }
        //     const uploadedResponse = await cloudinary.uploader.upload(coverImg)

        //     coverImg = uploadedResponse.secure_url ;
        // }

        user.fullname = fullname || user.fullname 
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio 

        user = await user.save();

        user.password = null ;

        return res.status(200).json(user) ;
        
    } catch (error) {
        console.log(`error in update user controller ${error}`);
        res.status(500).json({error : "internal server errror"})
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.status(200).json([]);
        }
        const regex = new RegExp(q.trim(), 'i');
        const users = await User.find({
            $or: [{ username: regex }, { fullname: regex }],
            _id: { $ne: req.user._id }
        })
        .select('username fullname profileImg bio')
        .limit(8);
        res.status(200).json(users);
    } catch (error) {
        console.log(`error in searchUsers controller ${error}`);
        res.status(500).json({ error: 'internal server error' });
    }
}

export const removeFollower = async (req, res) => {
    try {
        const { id } = req.params; // id = the follower to remove
        const myId = req.user._id;

        if (id === myId.toString()) {
            return res.status(400).json({ error: "Cannot remove yourself" });
        }

        const followerUser = await User.findById(id);
        if (!followerUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remove followerUser from my followers list
        await User.findByIdAndUpdate(myId, { $pull: { followers: id } });
        // Remove me from their following list
        await User.findByIdAndUpdate(id, { $pull: { following: myId } });

        res.status(200).json({ message: "Follower removed" });
    } catch (error) {
        console.log(`error in removeFollower controller ${error}`);
        res.status(500).json({ error: 'internal server error' });
    }
}