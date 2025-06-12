import User from "../models/user.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export function showRegister(req,res) {
    res.render("register" , {
        error : null,
        formData : {name : "" , email : "" , role : "Player"}
    });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .render("register", { error_msg: "Email already registered", formData: req.body });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    // Render login and pass a success message + the email to prefill
    return res
      .status(201)
      .render("login", {
        success_msg: "Registration successful. Please log in.",
        formData: { email },
      });
  } catch (error) {
    next(error);
  }
}


export function showLogin(req , res) {
    return res.render("login" , {error : null});
}


export async function login(req,res,next) {
    const {email , password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return res.status(400).render("login" , {error : "No account with that email " , email});
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


// if(role == "Player") {
 //     return res.status(201).render("success" , {token , user : {id : user._id , name , email , role : "Player"}});
 // }
