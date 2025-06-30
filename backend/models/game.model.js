import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Game name is required"],
        trim : true
    },
    description : {
        type : String,
    },
    category : {
        type : String,
        enum : ["Indoor" , "Outdoor" , "GamingCafe"],
        required : [true, "Category is required"]
    },
    city : {
        type : String,
        required : [true , "City name is required"]
    },
     pricePerHour: {
      type: Number,
      required: [true, "Rental price per hour is required"],
      min: [0, "Price cannot be negative"],
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Owner",
        required : [true , "Owner is required"],
    },
    bookedSlots : [
        {
            date : {
                type : String,
                required : true,
            },
            timeRanges : [
                {
                    from : {
                        type : String,
                        required : true,
                    },
                    to : {
                        type : String,
                        required: true,
                    },
                },
            ],
        },
    ],

    population : {
        type : Number,
        default : 1,
        min : [1 , "number of players must be atleast 1"],
    },

}, {timestamps : true});

export default mongoose.model("Game" , gameSchema);