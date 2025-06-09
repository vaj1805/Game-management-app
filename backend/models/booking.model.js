import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : [true , "user required for booking"],

    },

    

});

module.exports = mongoose.model("Booking" , bookingSchema);

