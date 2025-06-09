import mongoose from "mongoose";


const paymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "User required"],
     },
    
     amount : {
        type : Number,
        required : [true , "Payment amount required"],
        min : [200 , "Amount cannot be less than that"]
     },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "INR",
    },
    booking: {
        type: mongoose.Types.ObjectId,
        required: [true, "booking is required for payment"],
        ref: "Booking"
    },
    status: {
        type : String,
        enum : ["created" , "paid" , "failed" , "refunded"],

    },  
    method : {
        type : String,
        trim : true,
        default : "razorpay",
    },
    required: [true, "Payment method required"],

} , {timestamps : true})

module.exports = mongoose.model("Payment" , paymentSchema);

