import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import path from "path";

import gameDatabase from './config/db.js';
import authRoutes from "./routes/auth.route.js";

import dashboardRoutes from "./routes/dashboard.route.js";


dotenv.config();
const PORT = process.env.PORT || 8001;

// connect database;
gameDatabase();

const app = express();

app.set("view engine" , "ejs");
app.set("views" , "./views");

app.use(express.urlencoded({extended : true}));    
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd() , "public")));


//paths
app.use("/api/auth" , authRoutes);

// app.use("/api/games" , gameRoutes);
// app.use("/api/bookings" , bookingRoutes);
// app.use("/api/payments" , paymentRoutes);


// const razorpay =  new Razorpay({
//     key_id : ,
//     key_secret : ,
// })

app.listen(PORT , () => {
    console.log(`Server started on port : ${PORT}`);
})

