import express from "express";
import dotenv from 'dotenv';
import cors from 'cors'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";

dotenv.config();
const PORT = process.env.PORT || 8001;


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth" , authRoutes);
app.use("/api/games" , gameRoutes);
app.use("/api/bookings" , bookingRoutes);
app.use("/api/payments" , paymentRoutes);


const razorpay =  new Razorpay({
    key_id : ,
    key_secret : ,
})

app.listen(PORT , () => {
    console.log(`Server started on port : ${PORT}`);
})

