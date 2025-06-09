import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true , "Name is required"],
        trim : true
    },
    email : {
        type : String,
        required : [true , "Email is required"],
        unique : true,
        lowercase : true,
        trim : true,
          match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address",
      ],
    },
    password : {
        type : String,
        required : [true , "Password is required"],
        minLength : [6, "Password must be atleast 6 characters long"]
    },
    role : {
        type : String,
        enum : ["Player" , "Owner"],
        default : "Player"
    },
    phoneNum : {
        type : String,
        trim : true
    },
    city : {
        type : String,
        trim : true,
    },

    bookingHistory : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Booking"
        }
    ],

} , {timestamps : true});

module.exports = mongoose.model("User" , UserSchema);

