import User from "../models/user.model.js"
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

export function showLogin(req , res) {
    return res.render("loginpage" , {error : null});
}

export async function register(req,res,next) {
    try {
        const {name , email , password , role} = req.body;
        const existing = User.findOne({email});
        
        if(existing) {
            return res.status(400).render("dashboard" , {error : "Already existing user with email " , email});
        } 

        const  user = new User({name,email,password,role});
        await user.save();
        
        const token = jwt.sign({userId : user._id ,  role : user.role}, 
            process.env.JWT_SECRET_KEY,
            {expiresIn : "7d"}
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

export async function login(req,res,next) {
    const {email , password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return res.status(400).render("loginpage" , {error : "No account with that email " , email});
        }

        const isMatch = await bcrypt.compare(password , existingUser.password);

        if(!isMatch) {
            return res.status(400).render("login" , {error : "incorrect password." , email});
        }

        //if match of password then create a payload.

        const payload = {
            userId : existingUser._id,
            name : existingUser.name,
            email : existingUser.email,
            role : existingUser.role
        }
        const token = jwt.sign(payload , process.env.JWT_SECRET_KEY , {expiresIn : "7d"});
        

        return res.redirect("/dashboard");
        
    } catch(error) {
        next(error);
    }
}