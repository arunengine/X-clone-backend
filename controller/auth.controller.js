import User  from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req , res )=>{   
    try {
        const { username , fullname , email , password } = req.body  // destructuring from body 

        const emailregex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailregex.test(email)){
            return res.status(400).json({ error : " invalid email address"})
        }

        const existingEmail = await User.findOne({email : email})
        const existingUSerName = await User.findOne({ username : username})

        if ( existingEmail || existingUSerName){
            return res.status(400).json({ error : " username already exist"})
        }
        if (password.length < 6 ){
            return res.json({ error : " password is too short"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash( password , salt)

        const newUser= new User({
            username : username ,
            fullname : fullname ,
            email : email ,
            password : hashedPassword
        })

        if(newUser) {
            generateToken( newUser._id , res )
            await newUser.save();
            res.status(200).json({ 
                _id : newUser._id ,
                username : newUser.username ,
                fullname : newUser.fullname ,
                email : newUser.email ,
                followers : newUser.followers ,
                following : newUser.following ,
                bio : newUser.bio ,
                link : newUser.link 
            })
        }
        else{
            res.status(400).json({ error : " invalid"})
        }
 

    } catch (error) {
        console.log(`error in the signup control ${error}`)
        res.status(500).json({error : "internal server error"}) 
        
    } 
}

export const login = async (req , res )=>{    
   try{
    const { username , password } = req.body;
     
    const user = await User.findOne( {username : username})

    if (!user) {
        return res.status(400).json({ error: "invalid" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ error: "invalid" });
    }

    generateToken( user._id , res);
    res.status(200).json({
                _id : user._id ,
                username : user.username ,
                fullname : user.fullname ,
                email : user.email ,
                followers : user.followers ,
                following : user.following ,
                bio : user.bio ,
                link : user.link 
    })

   } catch(error){
        console.log(`error in the login control ${error}`)
        res.status(500).json({error : "internal server error"}) 
   }
}

export const logout =  async (req , res )=>{    
    try {
        res.cookie( "jwt" , " " , {maxAge : 0})
        res.status(200).json({ message : "logout success"})
    } catch (error) {
        console.log(`error in the logout control ${error}`)
        res.status(500).json({error : "internal server error"}) 
    }
}

export const getMe = async(req , res )=>{
    try {
        const user = await User.findOne({_id : req.user._id}).select("-password")
        res.status(200).json(user)
        
    } catch (error) {
        console.log(`error in the getme control ${error}`)
        res.status(500).json({error : "internal server error"}) 
    }
}