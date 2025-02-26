import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
import { connectDb } from "./config/dbConfig.js";
// import "./config/passportJsConfig.js";
import mainRoute from "./routes/mainRoute.js";
// import passport from "passport";

const corsOptions = {
   origin: "*",
   credentials: true,
   optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Initialize Passport.js
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(
//    session({
//       secret: process.env.SESSION_SECRET,
//       resave: false,
//       saveUninitialized: true,
//    })
// );

app.use(morgan("dev"));

connectDb();

app.get("/", (req, res) => {
   res.send("server is running");
});

// api
app.use(mainRoute);

app.listen(port, async () => {
   console.log("server is running");
});
