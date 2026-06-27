import mongoose from "mongoose";

const postSchema = mongoose.Schema ({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" ,
        required : true
    } , 
    text : {
        type : String
    } ,
    img : {
        type : String
    } ,
    likes :[
        {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "User"
        }
    ] ,

    comments :[
        {
            text :{
                type :String ,
                required : true
            }, 
            user : {
                type :mongoose.Schema.Types.ObjectId ,
                ref : "User" ,
                required : true 
            },
            parentId: {
                type: mongoose.Schema.Types.ObjectId,
                default: null
            },
            replyToUsername: {
                type: String,
                default: null
            }
        }
    ]
} , {timestamps : true}) 

const post = mongoose.model("posts" , postSchema) ;
export default post ;