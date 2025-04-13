const express = require("express");
const cors = require("cors");

const userRouter = require("./Api/Routers/userRouter");
const tokenRouter =  require("./Api/Routers/tokenRouter");
const accountRouter = require("./Api/Routers/accountRouter");

//MIDDLEWARE
const app = express();
// Use middleware to parse JSON
app.use(express.json());

//app.use(cors());
// Configure CORS
app.use(cors({
    origin:  '*',//'http://localhost:5500/',  // Frontend URL (replace with your actual frontend URL)
    methods: 'GET, POST, PUT, DELETE, OPTIONS',             // Allowed HTTP methods (GET, POST, etc.)
    allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
  }));
app.options("*",cors());

//3) ROUTES
app.use("/api/v1/user",userRouter);
app.use("/api/v1/tokens",tokenRouter);
app.use("/api/v1/account",accountRouter);

module.exports = app;
