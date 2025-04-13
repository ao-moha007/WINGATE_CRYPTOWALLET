const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");
const Token = require("../Model/tokenModel");
const Account = require("../Model/accountModel");

/**
 * Generates a JWT token for a user ID
 * @param {string} id - The user ID to include in the token
 * @returns {string} The signed JWT token
 */
const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
};

/**
 * Creates and sends a JWT token to the client in a cookie and response
 * @param {Object} user - The user object
 * @param {number} statusCode - HTTP status code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    res.cookie("jwt", token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwaeded-proto"] === "https",
    });

    // Remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

/**
 * Test signup endpoint (dummy implementation)
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.signUp1 = async (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: "User successfully signed up",
        data: {
            username: req.body.username,
            email: req.body.email,
        }
    });
};

/**
 * Creates a new user in the database
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.signUp = async (req, res, next) => {
    console.log("the user from the signup controller :", req.body);
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
    
    res.status(201).json({
        status: "success",
        data: {
            newUser,
        },
    });
};

/**
 * Authenticates a user and sends a JWT token
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.logIn = async (req, res, next) => {
    const {email, password} = req.body;
    console.log(email, password);
    
    // 1) Check if email and password exist
    if (!email || !password) {
        res.status(400).json({
            status: "fail",
            message: "Please provide email and password!",
        });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({email}).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        res.status(401).json({
            status: "fail",
            message: "Incorrect email or password",
        });
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
};

/**
 * Retrieves all tokens from the database
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.allToken = async (req, res, next) => {
    const tokens = await Token.find();

    res.status(200).json({
        status: "success",
        data: {
            tokens,
        },
    });
};

/**
 * Creates a new token in the database
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.addToken = async (req, res, next) => {
    const createToken = await Token.create({
        name: req.body.name,
        address: req.body.address,
        symbol: req.body.symbol,
    });

    res.status(201).json({
        status: "success",
        data: {
            createToken,
        },
    });
};

/**
 * Retrieves all accounts from the database
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.allAccount = async (req, res, next) => {
    const accounts = await Account.find();
    
    res.status(200).json({
        status: "success",
        data: {
            accounts,
        },
    });
};

/**
 * Creates a new account in the database
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.createAccount = async (req, res, next) => {
    const account = await Account.create({
        privateKey: req.body.privateKey,
        address: req.body.address,
        infos: req.body.infos,
    });

    res.status(201).json({
        status: "success",
        data: {
            account,
        }
    });
};

/**
 * Updates user's info array with a new token ID
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.updateInfos = async (req, res, next) => {
    try {
        console.log("the user from the controller : ", req.body);
        const { info, address } = req.body;
        console.log("the info from the controller : ", req.body.infos);
        console.log("the address from the controller : ", address);
        
        const updatedUser = await User.findOneAndUpdate(
            { address: address },
            { $push: { infos: req.body.infos } },
            { new: true, useFindAndModify: false }
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

/**
 * Updates account's info array with a new token ID
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.updateAccountInfos = async (req, res, next) => {
    try {
        console.log("the user from the controller : ", req.body);
        const { infos, address } = req.body;
        console.log("the info from the controller : ", infos);
        console.log("the address from the controller : ", address);
        
        const updatedAccount = await Account.findOneAndUpdate(
            { address: address },
            { $push: { infos: req.body.infos } },
            { new: true, useFindAndModify: false }
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

/**
 * Retrieves an account by its address
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.retrieveAccount = async (req, res, next) => {
    console.log("from the controller of account");
    try {
        const { address } = req.query;
        console.log(req.query);
        const account = await Account.findOne({ address });

        if (!account) {
            return res.status(200).json({ message: "Account is not imported" });
        }

        res.status(200).json({ status: "success", data: account });
    } catch (error) {
        console.error("Error fetching account:", error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};

/**
 * Adds an activity to an account's activities array
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.addAccountActivity = async (req, res, next) => {
    try {
        console.log("the useractivity sender from the controller : ", req.body.sender);
        const { sender, receiver, amount } = req.body;
        
        const updatedUser = await Account.findOneAndUpdate(
            { address: sender },
            { $push: { activities: {receiver, amount} } },
            { new: true, useFindAndModify: false }
        );

        res.json({ message: "Activities updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating token:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Adds an activity to a user's activities array
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.addUserActivity = async (req, res, next) => {
    try {
        console.log("the useractivity sender from the controller : ", req.body.sender);
        const { sender, receiver, amount } = req.body;
        
        const updatedUser = await User.findOneAndUpdate(
            { address: sender },
            { $push: { activities: {receiver, amount} } },
            { new: true, useFindAndModify: false }
        );

        res.json({ message: "Activities updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating token:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Test endpoint (dummy implementation)
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.test = async (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: "User successfully signed up",
        data: {
            username: "rika",
            email: "rika@gmail.com",
        }
    });
};