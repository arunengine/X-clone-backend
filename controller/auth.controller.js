import User  from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req , res ) => {   
    try {
        const { username, fullname, email, password } = req.body  // destructuring from body 
        const trimmedUsername = username?.trim()
        const trimmedFullname = fullname?.trim()
        const trimmedEmail = email?.trim().toLowerCase()

        const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!trimmedEmail || !emailregex.test(trimmedEmail)) {
            return res.status(400).json({ error: "invalid email address" })
        }
        if (!trimmedUsername) {
            return res.status(400).json({ error: "username is required" })
        }
        if (!trimmedFullname) {
            return res.status(400).json({ error: "full name is required" })
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "password is too short" })
        }

        const existingEmail = await User.findOne({ email: trimmedEmail })
        const existingUserName = await User.findOne({ username: trimmedUsername })

        if (existingEmail) {
            return res.status(400).json({ error: "email already exists" })
        }
        if (existingUserName) {
            return res.status(400).json({ error: "username already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username: trimmedUsername,
            fullname: trimmedFullname,
            email: trimmedEmail,
            password: hashedPassword
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
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue || {})[0]
            const message = duplicateField === "email"
                ? "email already exists"
                : duplicateField === "username"
                    ? "username already exists"
                    : "duplicate field value"
            return res.status(400).json({ error: message })
        }
        res.status(500).json({ error: "internal server error" }) 
    } 
}

export const login = async (req , res )=>{    
   try{
    const { username , password } = req.body;
     
    let user = await User.findOne( {username : username})

    // Auto-create demo user on the fly if it doesn't exist yet in database
    const demoAccounts = ["admin", "johndoe", "guest"];
    if (!user && demoAccounts.includes(username?.toLowerCase()?.trim())) {
        const hashedPassword = await bcrypt.hash(password || "password123", 10);
        user = await User.create({
            username: username.toLowerCase().trim(),
            fullname: username === "admin" ? "Admin User" : username === "johndoe" ? "John Doe" : "Guest User",
            email: `${username.toLowerCase().trim()}@example.com`,
            password: hashedPassword,
        });
    }

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
        res.cookie("jwt", "", { maxAge: 0, httpOnly: true, sameSite: "none", secure: true })
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