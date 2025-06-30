import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const OwnerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\S+@\S+\.\S+$/,
            "Please use a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be atleast 6 characters long"],
        select: false
    },
    phoneNum: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true,
        required: [true, "City is required"]
    },
    games: [{
        type: mongoose.Types.ObjectId,
        ref: "Game"
    }],
    totalEarnings: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Hook to hash password before saving
OwnerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
OwnerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Owner = mongoose.model("Owner", OwnerSchema);

export default Owner;

