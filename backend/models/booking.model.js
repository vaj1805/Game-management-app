import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true,
    },
    game : {
        type : mongoose.Types.ObjectId,
        ref : "Game",
        required : true,
    },
    date : {
        type : String,
        required : true,

    },
    timeRange : {
        from : {type : String , required : true},
        to : {type : String , required : true},
    },
    quantity : {
        type : Number,
        default : 1,
        min : 1,
    },
    totalPrice : {
        type : Number,
        required : true,
    },
    paymentStatus : {
        type : String,
        enum : ["pending" , "paid" , "failed"],
        default : "pending",
    }

} , {timestamps  : true});

export default mongoose.model("Booking" , bookingSchema);
