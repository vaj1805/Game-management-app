import mongoose from "mongoose";

const ownerSchema = mongoose.Schema({
    owner : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : [true , "Owner business is required"],
    },
    quantity : {
        type : Number,
        default : 1,
        min : [1 , "Quantity must be atleast 1"],
    },

}, { timestamps : true});


module.exports = mongoose.model("Owner" , ownerSchema);

