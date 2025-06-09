import User from "../models/user.model.js"
import jwt from 'jsonwebtoken';

export async function register(req,res,next) {
    try {
        const {name , email , password , role} = req.body;
        const existing = User.findOne({email});
        
        if(existing) {
            return res.status(400).json({message : "Email already in use"});
        } 

        const  user = new User({name,email,password,role});
        await user.save();
        
        const token = jwt.sign({userId : user._id ,  role : user.role}, 
            process.env.JWT_SECRET_KEY,
            {expiresIn : "5d"}
        )
        
        if(role == "Player") {
            return res.status(201).json({token , user : {id : user._id , name , email , role : "Player"}});
        }


        return res.status(201).json({token , user : {id : user._id , name , email , role : "Owner"}});
    }
    catch(error) {      
        next(error);
    }
}

export async function login(req , res , next) {
    try {
        const {email , password} = req.body;
        const existing = User.findOne()
    } catch(error) {

    }
}