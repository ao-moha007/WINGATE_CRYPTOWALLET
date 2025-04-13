const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");
const Token = require("../Model/tokenModel");
const Account = require("../Model/accountModel");

const signToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN,});

};

const createSendToken = (user , statusCode,req,res)=>{
    const token = signToken(user._id);

    res.cookie("jwt",token,{
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: req.secure || req.headers["x-forwaeded-proto"] === "https",


    });

    //Removepassword from output
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data:{
            user,
        },
    });
};

exports.signUp1 = async  (req, res,next) => {
    // Log the incoming request body to see the data sent from the frontend
    console.log(req.body);
  
    // Sample response with a success message and dummy data
    res.status(201).json({
        message: "User successfully signed up",
        data: {
            username: req.body.username,
            email: req.body.email,
        }
    });
  };

exports.signUp = async (req,res,next) => {
    console.log("the user from the signup controller :",req.body);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        address: req.body.address,
        private_key: req.body.private_key,
        mnemonic: req.body.mnemonic,
        infos: req.body.infos,
    });
    //createSendToken(newUser,201,req,res);
    res.status(201).json({
        status: "success",
        
        data:{
            newUser,
        },
    });

};

exports.logIn = async(req,res,next) => {
    const {email,password} = req.body;
    console.log(email,password);
    //1) Check if email and password exist
    if(!email || !password) {
        res.status(400).json({
            status: "fail",
            message: "Please provide email and password!",

        });

    }

    //2) Check if user exists && password is correct
    const user = await User.findOne({email}).select("+password");

    if(!user || !(await user.correctPassword(password,user.password))){
        res.status(401).json({
            status: "fail",
            message: "Incorrect email or password",
        });
    }

    //3) If everything ok, send token to client
    createSendToken(user,200,req,res);

};

exports.allToken = async (req,res,next) => {
    const tokens = await Token.find();

    //SEND RESPONSE
    res.status(200).json({
        status: "success",
        data: {
            tokens,
        },
    });
};

exports.addToken = async(req,res,next) => {
    const createToken = await Token.create({
        name: req.body.name,
        address: req.body.address,
        symbol: req.body.symbol,
    });

    //SEND RESPONSE
    res.status(201).json({
        status: "success",
        data: {
            createToken,
        },
    });
};

exports.allAccount = async (req,res,next) => {
    const accounts = await Account.find();
    
    //SEND RESPONSE
    res.status(200).json({
        status: "success",
        data: {
            accounts,
        },

    });
};


exports.createAccount = async(req,res,next) => {
    const account = await Account.create({
        privateKey: req.body.privateKey,
        address: req.body.address,
        infos: req.body.infos,
    });

    //SEND RESPONSE
    res.status(201).json({
        status: "success",
        data: {
            account,
        }
    });
};

exports.updateInfos =  async (req, res,next) => {
    try {
        console.log("the user from the controller : ",req.body);
        const { info,address } = req.body; // Get the new info from the request body
        //const userId = req.params.id; // Get user ID from URL
        console.log("the info from the controller : ",req.body.infos);
        console.log("the address from the controller : ",address);
        const updatedUser = await User.findOneAndUpdate(
            { address: address },  // Find by Ethereum address instead of ObjectId
            { $push: { infos: req.body.infos } },
            { new: true,useFindAndModify: false }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Token updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating token:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateAccountInfos =  async (req, res,next) => {
    try {
        console.log("the user from the controller : ",req.body);
        const { infos,address } = req.body; // Get the new info from the request body
        //const userId = req.params.id; // Get user ID from URL
        console.log("the info from the controller : ",infos);
        console.log("the address from the controller : ",address);
        const updatedAccount = await Account.findOneAndUpdate(
            { address: address },  // Find by Ethereum address instead of ObjectId
            { $push: { infos: req.body.infos } },
            { new: true,useFindAndModify: false }
        );

        if (!updatedAccount) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Token updated successfully", updatedAccount });
    } catch (error) {
        console.error("Error updating token:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.retrieveAccount =  async (req, res,next) => {
    console.log("from the controller of account");
    try {
        const { address } = req.query; // Get address from request parameters
        console.log(req.query);
        const account = await Account.findOne({ address });

        if (!account) {
            //return res.status(404).json({ message: "Account not found" });
            return res.status(200).json({ message: "Account is not imported" });
        }

        res.status(200).json({ status: "success", data: account });

    } catch (error) {
        console.error("Error fetching account:", error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};
exports.addAccountActivity = async  (req, res,next) => {
    try {
        console.log("the useractivity sender from the controller : ",req.body.sender);
        const { sender,receiver,amount } = req.body; // Get the new info from the request body
        
        const updatedUser = await Account.findOneAndUpdate(
            { address: sender },  // Find by Ethereum address instead of ObjectId
            { $push: { activities: {receiver,amount} } },
            { new: true,useFindAndModify: false }
        );

        // if (!updatedUser) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        res.json({ message: "Activities updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating token:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addUserActivity = async  (req, res,next) => {
    try {
        console.log("the useractivity sender from the controller : ",req.body.sender);
        const { sender,receiver,amount } = req.body; // Get the new info from the request body
        
        const updatedUser = await User.findOneAndUpdate(
            { address: sender },  // Find by Ethereum address instead of ObjectId
            { $push: { activities: {receiver,amount} } },
            { new: true,useFindAndModify: false }
        );

        // if (!updatedUser) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        res.json({ message: "Activities updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating token:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.test = async  (req, res,next) => {
    // Log the incoming request body to see the data sent from the frontend
    console.log(req.body);
  
    // Sample response with a success message and dummy data
    res.status(201).json({
        message: "User successfully signed up",
        data: {
            username: "rika",
            email: "rika@gmail.com",
        }
    });
  };



